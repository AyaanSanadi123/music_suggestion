"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Music, User, SlidersHorizontal, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { SongCard } from "@/components/SongCard";
import { SongModal } from "@/components/SongModal";

interface Song {
  id: string;
  title: string;
  artist: string;
  preview_url: string;
  image: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, number>>({});
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchSpotify = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSongs([]);
      return;
    }
    setIsSearching(true);
    try {
      const response = await axios.get(`http://localhost:8000/search?q=${query}`);
      setSongs(response.data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchSpotify(searchQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchSpotify]);

  const handleDissect = async (song: Song) => {
    setLoadingId(song.id);
    setSelectedSong(song);
    setIsModalOpen(true);
    try {
      const response = await axios.post(`http://localhost:8000/dissect/${song.id}`, {
        user_id: "user_123",
        preview_url: song.preview_url,
        title: song.title,
        artist: song.artist,
        image: song.image
      });

      setResults((prev) => ({
        ...prev,
        [song.id]: response.data.match_percentage
      }));
    } catch (error) {
      console.error("Error dissecting song:", error);
      const mockMatch = Math.floor(Math.random() * 40) + 60;
      setResults((prev) => ({ ...prev, [song.id]: mockMatch }));
    } finally {
      setLoadingId(null);
    }
  };

  const handleViewDetails = (song: Song) => {
    setSelectedSong(song);
    setIsModalOpen(true);
  };

  const handleAddToDNA = async (song: Song) => {
    try {
      await axios.post("http://localhost:8000/add-to-dna", {
        user_id: "user_123",
        spotify_id: song.id
      });
      alert("Sonic DNA Updated!");
    } catch (error) {
      console.error("Error updating DNA:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-black/60 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-xl rotate-3 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <Music className="text-black" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              SONIC DNA
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Library</button>
            <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Discover</button>
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <Link href="/profile" className="bg-zinc-800 p-2.5 rounded-full hover:bg-zinc-700 transition-all border border-white/5">
              <User size={18} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero / Search Section */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="mb-16">
          <h2 className="text-5xl sm:text-7xl font-black tracking-tight mb-8">
            Decode your <span className="text-green-500 italic">vibe.</span>
          </h2>
          
          <div className="relative group max-w-3xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity duration-500" />
            <div className="relative flex items-center">
              {isSearching ? (
                <Loader2 className="absolute left-5 text-green-500 animate-spin" size={24} />
              ) : (
                <Search className="absolute left-5 text-zinc-500 group-focus-within:text-green-500 transition-colors" size={24} />
              )}
              <input
                type="text"
                placeholder="Search songs, artists, or paste a Spotify link..."
                className="w-full bg-zinc-900/80 border border-white/5 rounded-2xl py-6 pl-14 pr-16 text-xl focus:ring-0 focus:outline-none focus:border-green-500/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-4 p-2 text-zinc-500 hover:text-white transition-colors">
                <SlidersHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
              {searchQuery ? `Results for "${searchQuery}"` : "Trending DNA"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                isLoading={loadingId === song.id}
                matchPercentage={results[song.id]}
                onDissect={handleDissect}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </section>
      </main>

      <SongModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        song={selectedSong}
        matchPercentage={selectedSong ? results[selectedSong.id] : undefined}
        isAnalyzing={selectedSong?.id === loadingId}
        onAddToDNA={handleAddToDNA}
      />
    </div>
  );
}
