from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase_client import supabase
# from dsp_utils import AudioProcessor  <-- Assuming this is ready
# from model_loader import brain      <-- Assuming this is ready

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input schema for our endpoint
class SongRequest(BaseModel):
    user_id: str
    preview_url: str
    title: str
    artist: str

@app.post("/dissect/{spotify_id}")
async def dissect_and_match(spotify_id: str, request: SongRequest):
    """
    1. THE CACHING LOGIC
    """
    # Check if the song exists in our Data Lake
    cache_check = supabase.table("tracks").select("is_analyzed").eq("spotify_id", spotify_id).execute()
    
    # If the song is NOT in the cache, we must process it
    if not cache_check.data:
        print(f"Cache Miss! Running Heavy Inference for {spotify_id}...")
        
        # --- 1a. Download & Process ---
        # audio_buffer = await download_to_ram(request.preview_url)
        # mel_spec = processor.process_buffer(audio_buffer)
        
        # --- 1b. Run PANNs Model ---
        # song_vector = brain.run_inference(mel_spec)
        
        # [MOCK VECTOR FOR NOW WHILE COLAB DOWNLOADS]
        import random
        song_vector = [random.uniform(0, 1) for _ in range(59)]
        
        # --- 1c. Save to Cache ---
        supabase.table("tracks").insert({
            "spotify_id": spotify_id,
            "title": request.title,
            "artist": request.artist,
            "preview_url": request.preview_url,
            "analysis_vector": song_vector,
            "is_analyzed": True
        }).execute()
    else:
        print(f"Cache Hit! Bypassing GPU for {spotify_id}.")

    """
    2. SCENARIO A: SEARCH LOGIC (VECTOR SIMILARITY)
    """
    # Now that we guarantee the song is in the DB (either cached or just analyzed),
    # we ask Supabase to run the pgvector math against the user's DNA.
    try:
        match_response = supabase.rpc(
            'get_taste_match', 
            {'u_id': request.user_id, 's_id': spotify_id}
        ).execute()
        
        match_score = match_response.data
        
        # Convert to a clean percentage for the frontend (e.g., 0.8734 -> 87.3)
        match_percentage = round(match_score * 100, 1)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate match: {e}")

    # Return the final payload to the Next.js frontend
    return {
        "spotify_id": spotify_id,
        "match_percentage": match_percentage,
        "message": "Perfect Match!" if match_percentage > 85 else "Might not be your vibe."
    }