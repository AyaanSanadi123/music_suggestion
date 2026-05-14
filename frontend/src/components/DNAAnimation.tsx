import React from 'react';

export const DNAAnimation = () => {
  return (
    <div className="flex items-center justify-center gap-1 h-12 w-full">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-green-500 rounded-full animate-dna-pulse"
          style={{
            height: '20%',
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1.2s'
          }}
        />
      ))}
      <style jsx>{`
        @keyframes dna-pulse {
          0%, 100% { height: 20%; opacity: 0.3; }
          50% { height: 100%; opacity: 1; }
        }
        .animate-dna-pulse {
          animation-name: dna-pulse;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>
    </div>
  );
};
