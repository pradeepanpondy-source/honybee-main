import React from 'react';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute bottom-0 left-0 w-full h-full">
        {/* Realistic Tree - Left side (matching reference image) */}
        <div className="absolute bottom-0 left-10">
          <svg width="200" height="250" viewBox="0 0 200 250" className="drop-shadow-lg">
            {/* Tree trunk - wooden texture */}
            <rect x="90" y="180" width="20" height="70" fill="#8B4513" />
            <path d="M90 180 C85 170, 80 165, 75 170 C70 175, 75 180, 90 180" fill="#8B4513" />
            <path d="M110 180 C115 170, 120 165, 125 170 C130 175, 125 180, 110 180" fill="#8B4513" />
            <path d="M90 250 L90 180 L110 180 L110 250 Z" fill="#A0522D" />
            <path d="M95 180 L95 250" stroke="#7D3C0A" strokeWidth="1" opacity="0.7" />
            <path d="M105 180 L105 250" stroke="#7D3C0A" strokeWidth="1" opacity="0.7" />
            
            {/* Grass and small plants around trunk */}
            <ellipse cx="100" cy="250" rx="40" ry="10" fill="#4CAF50" opacity="0.8" />
            <path d="M85 250 C88 245, 90 240, 87 242 C84 244, 85 250, 85 250" fill="#388E3C" />
            <path d="M115 250 C112 245, 110 240, 113 242 C116 244, 115 250, 115 250" fill="#388E3C" />
            <path d="M75 250 C78 242, 80 238, 77 240 C74 242, 75 250, 75 250" fill="#388E3C" />
            <path d="M125 250 C122 242, 120 238, 123 240 C126 242, 125 250, 125 250" fill="#388E3C" />
            
            {/* Tree foliage - Rounded cloud-like shape as in reference */}
            <ellipse cx="100" cy="100" rx="80" ry="70" fill="#4CAF50" />
            <ellipse cx="70" cy="120" rx="40" ry="35" fill="#388E3C" />
            <ellipse cx="130" cy="120" rx="40" ry="35" fill="#388E3C" />
            <ellipse cx="100" cy="80" rx="60" ry="50" fill="#4CAF50" />
            <ellipse cx="75" cy="60" rx="35" ry="30" fill="#4CAF50" />
            <ellipse cx="125" cy="60" rx="35" ry="30" fill="#4CAF50" />
            <ellipse cx="100" cy="40" rx="45" ry="35" fill="#4CAF50" />
            <ellipse cx="85" cy="50" rx="25" ry="20" fill="#66BB6A" />
            <ellipse cx="115" cy="50" rx="25" ry="20" fill="#66BB6A" />
            <ellipse cx="100" cy="30" rx="30" ry="25" fill="#66BB6A" />
            <ellipse cx="65" cy="90" rx="25" ry="20" fill="#66BB6A" />
            <ellipse cx="135" cy="90" rx="25" ry="20" fill="#66BB6A" />
            <ellipse cx="50" cy="110" rx="20" ry="15" fill="#66BB6A" />
            <ellipse cx="150" cy="110" rx="20" ry="15" fill="#66BB6A" />
            
            {/* Darker patches for depth and texture */}
            <ellipse cx="65" cy="85" rx="18" ry="15" fill="#2E7D32" opacity="0.7" />
            <ellipse cx="135" cy="85" rx="20" ry="17" fill="#2E7D32" opacity="0.7" />
            <ellipse cx="100" cy="60" rx="15" ry="12" fill="#2E7D32" opacity="0.7" />
          </svg>
        </div>

        {/* Realistic Tree - Right side (matching reference image) */}
        <div className="absolute bottom-0 right-16">
          <svg width="180" height="220" viewBox="0 0 180 220" className="drop-shadow-lg">
            {/* Tree trunk - wooden texture */}
            <rect x="85" y="160" width="18" height="60" fill="#8B4513" />
            <path d="M85 160 C80 150, 75 145, 70 150 C65 155, 70 160, 85 160" fill="#8B4513" />
            <path d="M103 160 C108 150, 113 145, 118 150 C123 155, 118 160, 103 160" fill="#8B4513" />
            <path d="M85 220 L85 160 L103 160 L103 220 Z" fill="#A0522D" />
            <path d="M90 160 L90 220" stroke="#7D3C0A" strokeWidth="1" opacity="0.7" />
            <path d="M98 160 L98 220" stroke="#7D3C0A" strokeWidth="1" opacity="0.7" />
            
            {/* Grass and small plants around trunk */}
            <ellipse cx="94" cy="220" rx="35" ry="8" fill="#4CAF50" opacity="0.8" />
            <path d="M80 220 C83 215, 85 210, 82 212 C79 214, 80 220, 80 220" fill="#388E3C" />
            <path d="M108 220 C105 215, 103 210, 106 212 C109 214, 108 220, 108 220" fill="#388E3C" />
            <path d="M70 220 C73 212, 75 208, 72 210 C69 212, 70 220, 70 220" fill="#388E3C" />
            <path d="M118 220 C115 212, 113 208, 116 210 C119 212, 118 220, 118 220" fill="#388E3C" />
            
            {/* Tree foliage - Rounded cloud-like shape as in reference */}
            <ellipse cx="94" cy="90" rx="70" ry="60" fill="#4CAF50" />
            <ellipse cx="65" cy="105" rx="35" ry="30" fill="#388E3C" />
            <ellipse cx="123" cy="105" rx="35" ry="30" fill="#388E3C" />
            <ellipse cx="94" cy="70" rx="50" ry="45" fill="#4CAF50" />
            <ellipse cx="70" cy="55" rx="30" ry="25" fill="#4CAF50" />
            <ellipse cx="118" cy="55" rx="30" ry="25" fill="#4CAF50" />
            <ellipse cx="94" cy="40" rx="40" ry="30" fill="#4CAF50" />
            <ellipse cx="80" cy="50" rx="22" ry="18" fill="#66BB6A" />
            <ellipse cx="108" cy="50" rx="22" ry="18" fill="#66BB6A" />
            <ellipse cx="94" cy="30" rx="25" ry="20" fill="#66BB6A" />
            <ellipse cx="60" cy="85" rx="22" ry="17" fill="#66BB6A" />
            <ellipse cx="128" cy="85" rx="22" ry="17" fill="#66BB6A" />
            <ellipse cx="45" cy="100" rx="18" ry="13" fill="#66BB6A" />
            <ellipse cx="143" cy="100" rx="18" ry="13" fill="#66BB6A" />
            
            {/* Darker patches for depth and texture */}
            <ellipse cx="60" cy="75" rx="15" ry="12" fill="#2E7D32" opacity="0.7" />
            <ellipse cx="128" cy="75" rx="17" ry="14" fill="#2E7D32" opacity="0.7" />
            <ellipse cx="94" cy="55" rx="12" ry="10" fill="#2E7D32" opacity="0.7" />
          </svg>
        </div>
        
        {/* Realistic Tree - Center back (matching reference image) */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <svg width="220" height="280" viewBox="0 0 220 280" className="drop-shadow-lg opacity-90">
            {/* Tree trunk - wooden texture */}
            <rect x="100" y="200" width="25" height="80" fill="#8B4513" />
            <path d="M100 200 C95 190, 90 185, 85 190 C80 195, 85 200, 100 200" fill="#8B4513" />
            <path d="M125 200 C130 190, 135 185, 140 190 C145 195, 140 200, 125 200" fill="#8B4513" />
            <path d="M100 280 L100 200 L125 200 L125 280 Z" fill="#A0522D" />
            <path d="M107 200 L107 280" stroke="#7D3C0A" strokeWidth="1" opacity="0.7" />
            <path d="M118 200 L118 280" stroke="#7D3C0A" strokeWidth="1" opacity="0.7" />
            
            {/* Grass and small plants around trunk */}
            <ellipse cx="112" cy="280" rx="45" ry="12" fill="#4CAF50" opacity="0.8" />
            <path d="M95 280 C98 275, 100 270, 97 272 C94 274, 95 280, 95 280" fill="#388E3C" />
            <path d="M130 280 C127 275, 125 270, 128 272 C131 274, 130 280, 130 280" fill="#388E3C" />
            <path d="M85 280 C88 272, 90 268, 87 270 C84 272, 85 280, 85 280" fill="#388E3C" />
            <path d="M140 280 C137 272, 135 268, 138 270 C141 272, 140 280, 140 280" fill="#388E3C" />
            
            {/* Tree foliage - Rounded cloud-like shape as in reference */}
            <ellipse cx="112" cy="110" rx="90" ry="80" fill="#4CAF50" />
            <ellipse cx="75" cy="130" rx="45" ry="40" fill="#388E3C" />
            <ellipse cx="149" cy="130" rx="45" ry="40" fill="#388E3C" />
            <ellipse cx="112" cy="90" rx="70" ry="60" fill="#4CAF50" />
            <ellipse cx="85" cy="70" rx="40" ry="35" fill="#4CAF50" />
            <ellipse cx="139" cy="70" rx="40" ry="35" fill="#4CAF50" />
            <ellipse cx="112" cy="50" rx="50" ry="40" fill="#4CAF50" />
            <ellipse cx="95" cy="65" rx="30" ry="25" fill="#66BB6A" />
            <ellipse cx="129" cy="65" rx="30" ry="25" fill="#66BB6A" />
            <ellipse cx="112" cy="30" rx="35" ry="25" fill="#66BB6A" />
            <ellipse cx="70" cy="100" rx="28" ry="22" fill="#66BB6A" />
            <ellipse cx="154" cy="100" rx="28" ry="22" fill="#66BB6A" />
            <ellipse cx="55" cy="120" rx="22" ry="17" fill="#66BB6A" />
            <ellipse cx="169" cy="120" rx="22" ry="17" fill="#66BB6A" />
            
            {/* Darker patches for depth and texture */}
            <ellipse cx="70" cy="85" rx="18" ry="15" fill="#2E7D32" opacity="0.7" />
            <ellipse cx="154" cy="85" rx="20" ry="17" fill="#2E7D32" opacity="0.7" />
            <ellipse cx="112" cy="65" rx="15" ry="12" fill="#2E7D32" opacity="0.7" />
            
            {/* Darker patches for depth and texture */}
            <ellipse cx="75" cy="90" rx="22" ry="18" fill="#2E7D32" />
            <ellipse cx="149" cy="90" rx="24" ry="20" fill="#2E7D32" />
            <ellipse cx="112" cy="70" rx="18" ry="15" fill="#2E7D32" />
            <ellipse cx="90" cy="110" rx="25" ry="20" fill="#388E3C" />
            <ellipse cx="134" cy="110" rx="25" ry="20" fill="#388E3C" />
          </svg>
        </div>
      </div>

      {/* Bees - Keeping some subtle animation */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bee-flight"
          style={{
            animationDelay: `${i * 2}s`,
            animationDuration: `${8 + Math.random() * 4}s`
          }}
        >
          <svg width="24" height="16" viewBox="0 0 24 16" className="animate-bee-wings">
            {/* Bee body */}
            <ellipse cx="12" cy="8" rx="8" ry="4" fill="#FFD700" />
            <ellipse cx="12" cy="8" rx="6" ry="3" fill="#FFA500" />
            
            {/* Bee stripes */}
            <rect x="8" y="6" width="1" height="4" fill="#000" />
            <rect x="11" y="6" width="1" height="4" fill="#000" />
            <rect x="14" y="6" width="1" height="4" fill="#000" />
            
            {/* Bee wings */}
            <ellipse cx="6" cy="5" rx="4" ry="2" fill="#FFF" opacity="0.7" className="animate-wing-flap" />
            <ellipse cx="18" cy="5" rx="4" ry="2" fill="#FFF" opacity="0.7" className="animate-wing-flap" style={{animationDelay: '0.1s'}} />
            
            {/* Bee antennae */}
            <line x1="10" y1="4" x2="9" y2="2" stroke="#000" strokeWidth="1" />
            <line x1="14" y1="4" x2="15" y2="2" stroke="#000" strokeWidth="1" />
            <circle cx="9" cy="2" r="1" fill="#000" />
            <circle cx="15" cy="2" r="1" fill="#000" />
          </svg>
        </div>
      ))}
    </div>
  );
}