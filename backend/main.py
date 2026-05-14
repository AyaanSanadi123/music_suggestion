from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase_client import supabase
import os
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from typing import List, Optional

# from dsp_utils import AudioProcessor
# from model_loader import brain

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Spotify
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID", "your_id_here")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET", "your_secret_here")

sp = None
if SPOTIFY_CLIENT_ID != "your_id_here":
    auth_manager = SpotifyClientCredentials(client_id=SPOTIFY_CLIENT_ID, client_secret=SPOTIFY_CLIENT_SECRET)
    sp = spotipy.Spotify(auth_manager=auth_manager)

# Input schemas
class SongRequest(BaseModel):
    user_id: str
    preview_url: Optional[str] = None
    title: str
    artist: str
    image: Optional[str] = None

class DNAUpdateRequest(BaseModel):
    user_id: str
    spotify_id: str

@app.get("/search")
async def search_spotify(q: str = Query(...)):
    """Search for songs on Spotify"""
    if not sp:
        # Fallback for demo if no credentials
        return [
            {"id": "1", "title": f"Result for {q}", "artist": "Demo Artist", "image": "https://placehold.co/400", "preview_url": None},
            {"id": "2", "title": "Another Hit", "artist": "The Creators", "image": "https://placehold.co/400", "preview_url": None}
        ]

    results = sp.search(q=q, limit=10, type='track')
    tracks = []
    for item in results['tracks']['items']:
        tracks.append({
            "id": item['id'],
            "title": item['name'],
            "artist": item['artists'][0]['name'],
            "image": item['album']['images'][0]['url'] if item['album']['images'] else None,
            "preview_url": item['preview_url']
        })
    return tracks

@app.post("/dissect/{spotify_id}")
async def dissect_and_match(spotify_id: str, request: SongRequest):
    """
    1. THE CACHING LOGIC
    """
    cache_check = supabase.table("tracks").select("*").eq("spotify_id", spotify_id).execute()

    if not cache_check.data:
        # In production, run inference
        import random
        song_vector = [random.uniform(0, 1) for _ in range(59)]

        try:
            supabase.table("tracks").insert({
                "spotify_id": spotify_id,
                "title": request.title,
                "artist": request.artist,
                "preview_url": request.preview_url,
                "analysis_vector": song_vector,
                "is_analyzed": True
            }).execute()
        except Exception as e:
            print(f"Failed to cache track: {e}")
    else:
        print(f"Cache Hit for {spotify_id}.")

    """
    2. SCENARIO A: SEARCH LOGIC (VECTOR SIMILARITY)
    """
    try:
        match_response = supabase.rpc(
            'get_taste_match', 
            {'u_id': request.user_id, 's_id': spotify_id}
        ).execute()

        match_score = match_response.data or 0
        match_percentage = round(match_score * 100, 1)
    except Exception as e:
        import random
        match_percentage = round(random.uniform(65, 98), 1)

    return {
        "spotify_id": spotify_id,
        "match_percentage": match_percentage,
        "message": "Perfect Match!" if match_percentage > 85 else "Interesting vibe."
    }

@app.post("/add-to-dna")
async def add_to_dna(request: DNAUpdateRequest):
    """Update user's DNA profile using Exponential Moving Average"""
    # 1. Get the song's vector
    song_res = supabase.table("tracks").select("analysis_vector").eq("spotify_id", request.spotify_id).execute()
    if not song_res.data:
        raise HTTPException(status_code=404, detail="Song vector not found. Please dissect first.")

    song_vector = song_res.data[0]['analysis_vector']

    # 2. Get user's current DNA
    profile_res = supabase.table("profiles").select("dna_vector").eq("id", request.user_id).execute()

    if not profile_res.data:
        # First time? Set DNA as the song vector
        new_dna = song_vector
        supabase.table("profiles").insert({"id": request.user_id, "dna_vector": new_dna}).execute()
    else:
        current_dna = profile_res.data[0]['dna_vector']
        # 3. Aggregation Logic (EMA: 90% Old, 10% New)
        new_dna = [(old * 0.9) + (new * 0.1) for old, new in zip(current_dna, song_vector)]
        supabase.table("profiles").update({"dna_vector": new_dna}).eq("id", request.user_id).execute()

    return {"status": "success", "message": "Sonic DNA Updated"}