"use client";

import { Music, User, ArrowLeft, Zap, Shield, History } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  // Mock data for DNA profile
  const dnaStats = [
    { label: "Acoustic", value: 75 },
    { label: "Electronic", value: 40 },
    { label: "Instrumental", value: 20 },
    { label: "Vocal", value: 90 },
    { label: "Aggressive", value: 15 },
    { label: "Chill", value: 85 },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span>Back to Feed</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-green-500 p-2 rounded-xl rotate-3 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <Music className="text-black" size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter italic">SONIC DNA</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <section className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center p-1">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                   <User size={64} className="text-zinc-800" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-zinc-800 border border-zinc-700 p-2 rounded-lg">
                <Shield size={16} className="text-green-500" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black mb-2">Explorer_123</h1>
              <p className="text-zinc-400 mb-6 max-w-md">
                Your DNA is currently biased towards <span className="text-green-500 font-bold italic">Ambient Vocals</span> and <span className="text-green-500 font-bold italic">Deep Melodics</span>.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="px-4 py-2 bg-zinc-800/50 rounded-full border border-white/5 text-sm">
                  142 Tracks Analyzed
                </div>
                <div className="px-4 py-2 bg-zinc-800/50 rounded-full border border-white/5 text-sm">
                  92% Compatibility Avg
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* DNA Stats */}
          <section className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-8 flex items-center gap-2">
              <Zap size={16} className="text-green-500" /> Taste Breakdown
            </h3>
            <div className="space-y-6">
              {dnaStats.map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-300 font-medium">{stat.label}</span>
                    <span className="text-zinc-500 font-mono">{stat.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-1000"
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Activity History */}
          <section className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-8 flex items-center gap-2">
              <History size={16} className="text-green-500" /> Recent Sequencings
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-zinc-800/50 rounded-2xl transition-colors border border-transparent hover:border-white/5">
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl overflow-hidden" />
                  <div className="flex-1">
                    <p className="font-bold text-sm">Coming Soon...</p>
                    <p className="text-xs text-zinc-500">History logic pending training</p>
                  </div>
                  <div className="text-green-500 font-mono text-xs">8{i}%</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
