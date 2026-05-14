import React from 'react';
import { Activity, Play, Info } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  preview_url: string;
  image: string;
}

interface SongCardProps {
  song: Song;
  matchPercentage?: number;
  isLoading: boolean;
  onDissect: (song: Song) => void;
  onViewDetails: (song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ 
  song, 
  matchPercentage, 
  isLoading, 
  onDissect,
  onViewDetails 
}) => {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-4 hover:bg-zinc-800/40 transition-all group">
      <div className="relative mb-4 aspect-square overflow-hidden rounded-xl">
        <img
          src={song.image}
          alt={song.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button 
            className="bg-green-500 p-3 rounded-full hover:scale-110 transition-transform"
            onClick={(e) => { e.stopPropagation(); /* Play logic */ }}
          >
            <Play fill="black" size={24} className="text-black ml-1" />
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold truncate text-white">{song.title}</h3>
          <p className="text-zinc-400 text-sm truncate">{song.artist}</p>
        </div>
        {matchPercentage !== undefined && (
          <div className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-md text-xs font-bold border border-green-500/30">
            {matchPercentage}%
          </div>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2">
        <button
          onClick={() => onDissect(song)}
          disabled={isLoading}
          className="col-span-4 bg-white hover:bg-green-500 hover:text-white text-black text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {isLoading ? <Activity className="animate-spin" size={16} /> : <Activity size={16} />}
          {isLoading ? "Analyzing..." : "DNA Match"}
        </button>
        <button 
          onClick={() => onViewDetails(song)}
          className="col-span-1 bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center rounded-lg transition-colors"
        >
          <Info size={18} />
        </button>
      </div>
    </div>
  );
};
