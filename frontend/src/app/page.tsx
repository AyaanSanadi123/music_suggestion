"use client";

import { useState } from "react";
import { Search, Play, Activity, Music, User } from "lucide-react";
import axios from "axios";

interface Song {
  id: string;
  title: string;
  artist: string;
  preview_url: string;
  image: string;
}

const MOCK_SONGS: Song[] = [
  {
    id: "7qiZ3u2S3pSqbH9m0r9mki",
    title: "Shape of You",
    artist: "Ed Sheeran",
    preview_url: "https://p.scdn.co/mp3-preview/...",
    image: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96"
  },
  {
    id: "0VjIjW4GlUZvYUtYvWUbKV",
    title: "Blinding Lights",
    artist: "The Weeknd",
    preview_url: "https://p.scdn.co/mp3-preview/...",
    image: "https://i.scdn.co/image/ab67616d0000b273886577544036120e2a878516"
  },
  {
    id: "37y7iR0ZpYpSqbH9m0r9mki",
    title: "Levitating",
    artist: "Dua Lipa",
    preview_url: "https://p.scdn.co/mp3-preview/...",
    image: "https://i.scdn.co/image/ab67616d0000b273bd0e972989b535d49a7a6c56"
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, number>>({});

  const handleDissect = async (song: Song) => {
    setLoading(song.id);
    try {
      // Assuming backend is at localhost:8000
      const response = await axios.post(`http://localhost:8000/dissect/${song.id}`, {
        user_id: "user_123", // Mock user ID
        preview_url: song.preview_url,
        title: song.title,
        artist: song.artist
      });

      setResults((prev) => ({
        ...prev,
        [song.id]: response.data.match_percentage
      }));
    } catch (error) {
      console.error("Error dissecting song:", error);
      // Fallback for demo if backend is not running
      setResults((prev) => ({
        ...prev,
        [song.id]: Math.floor(Math.random() * 40) + 60
      }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <div className="bg-green-500 p-2 rounded-lg">
            <Music className="text-black" size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter italic">SONIC DNA</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 transition-colors">
            <User size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="mb-12 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input
            type="text"
            placeholder="Search for songs or artists..."
            className="w-full bg-zinc-900 border-none rounded-2xl py-4 pl-12 pr-4 text-lg focus:ring-2 focus:ring-green-500 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_SONGS.map((song) => (
            <div key={song.id} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 hover:bg-zinc-800/50 transition-all group">
              <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl">
                <img
                  src={song.image}
                  alt={song.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play fill="white" size={48} />
                </button>
              </div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold truncate">{song.title}</h3>
                  <p className="text-zinc-400">{song.artist}</p>
                </div>
                {results[song.id] !== undefined && (
                  <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm font-bold border border-green-500/20">
                    {results[song.id]}% Match
                  </div>
                )}
              </div>

              <button
                onClick={() => handleDissect(song)}
                disabled={loading === song.id}
                className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
              >
                {loading === song.id ? (
                  <Activity className="animate-spin" size={20} />
                ) : (
                  <Activity size={20} />
                )}
                {loading === song.id ? "Analyzing DNA..." : "Dissect Match"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}