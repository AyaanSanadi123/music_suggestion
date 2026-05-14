import React from 'react';
import { X, Activity, Music, Share2, Zap } from 'lucide-react';
import { DNAAnimation } from './DNAAnimation';

interface Song {
  id: string;
  title: string;
  artist: string;
  preview_url: string;
  image: string;
}

interface SongModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
  matchPercentage?: number;
  isAnalyzing?: boolean;
  onAddToDNA?: (song: Song) => void;
}

export const SongModal: React.FC<SongModalProps> = ({ song, isOpen, onClose, matchPercentage, isAnalyzing, onAddToDNA }) => {
  if (!isOpen || !song) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="relative h-48 sm:h-64">
          <img src={song.image} alt="" className="w-full h-full object-cover opacity-40 blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="absolute bottom-6 left-8 flex items-end gap-6">
            <img src={song.image} alt={song.title} className="w-32 h-32 rounded-xl shadow-2xl border border-white/10" />
            <div className="mb-2">
              <h2 className="text-3xl font-black text-white">{song.title}</h2>
              <p className="text-zinc-400 text-xl">{song.artist}</p>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                <Activity size={14} /> DNA Analysis
              </h4>
              <div className="space-y-4">
                {isAnalyzing ? (
                  <div className="py-4">
                    <DNAAnimation />
                    <p className="text-center text-xs text-zinc-500 mt-2 animate-pulse">Sequencing Acoustic DNA...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Match Accuracy</span>
                      <span className="text-green-500 font-mono">{matchPercentage || '??'}%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-1000" 
                        style={{ width: `${matchPercentage || 0}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => onAddToDNA?.(song)}
                className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Zap size={18} fill="black" /> Add to DNA
              </button>
              <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <div className="bg-zinc-800/30 rounded-2xl p-5 border border-zinc-700/30">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Acoustic Fingerprint</h4>
            <div className="flex items-center gap-4 text-sm text-zinc-300">
              <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
                <Music size={20} />
              </div>
              <div>
                <p className="font-bold">Neural Mapping</p>
                <p className="text-xs text-zinc-500 text-pretty">Analyzing spectral density and temporal features...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
