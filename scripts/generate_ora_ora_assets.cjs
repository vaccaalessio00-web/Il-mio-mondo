const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(__dirname, '../public/assets');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. BACKGROUND (1080x1920) - Backstage dressing room with door
const bgSvg = `
<svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3b2d4a"/>
      <stop offset="40%" stop-color="#2a2038"/>
      <stop offset="70%" stop-color="#1f182b"/>
      <stop offset="100%" stop-color="#15101d"/>
    </linearGradient>
    <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#784728"/>
      <stop offset="30%" stop-color="#5a341c"/>
      <stop offset="100%" stop-color="#341e10"/>
    </linearGradient>
    <linearGradient id="doorFrame" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#4a3728"/>
      <stop offset="50%" stop-color="#6e533c"/>
      <stop offset="100%" stop-color="#3d2c1e"/>
    </linearGradient>
    <linearGradient id="hallwayGlow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff5cc"/>
      <stop offset="100%" stop-color="#fed7aa"/>
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Wall Background -->
  <rect width="1080" height="1350" fill="url(#wallGrad)"/>
  
  <!-- Subtle Wallpaper Stripes -->
  <g opacity="0.06">
    ${Array.from({ length: 27 }, (_, i) => `<rect x="${i * 40}" y="0" width="20" height="1350" fill="#ffffff"/>`).join('')}
  </g>

  <!-- Floor -->
  <polygon points="0,1320 1080,1320 1080,1920 0,1920" fill="url(#floorGrad)"/>
  <!-- Baseboard moulding -->
  <rect x="0" y="1305" width="1080" height="20" fill="#2c1a0e"/>
  <rect x="0" y="1320" width="1080" height="5" fill="#caa472" opacity="0.4"/>
  <!-- Parquet lines -->
  <g opacity="0.15" stroke="#1d1109" stroke-width="3">
    ${Array.from({ length: 14 }, (_, i) => `<line x1="${i * 90 - 90}" y1="1325" x2="${i * 90 + 200}" y2="1920"/>`).join('')}
  </g>

  <!-- THE DOORWAY (Center-Upper: x=340 to 740, y=280 to 920) -->
  <!-- Door Architrave / Exterior Trim -->
  <rect x="330" y="270" width="420" height="660" rx="14" fill="url(#doorFrame)" stroke="#26170d" stroke-width="6"/>
  <!-- Interior Hallway Backing -->
  <rect x="360" y="310" width="360" height="610" rx="8" fill="#140f1a"/>
  <!-- Hallway light beam -->
  <polygon points="360,310 720,310 820,920 260,920" fill="url(#hallwayGlow)" opacity="0.12"/>
  
  <!-- Door sign: "BACKSTAGE / DIREZIONE" -->
  <rect x="440" y="225" width="200" height="40" rx="8" fill="#1e1828" stroke="#ca8a04" stroke-width="3"/>
  <text x="540" y="251" text-anchor="middle" fill="#fef08a" font-family="sans-serif" font-weight="bold" font-size="16" letter-spacing="3">STAFF ONLY</text>

  <!-- Hanging Left Velvet Curtain -->
  <path d="M 0,0 L 220,0 C 180,300 240,650 170,1100 C 140,1260 200,1340 0,1340 Z" fill="#991b1b" opacity="0.92"/>
  <path d="M 0,0 L 160,0 C 130,300 170,700 120,1100 L 0,1100 Z" fill="#7f1d1d" opacity="0.6"/>

  <!-- Hanging Right Velvet Curtain -->
  <path d="M 1080,0 L 860,0 C 900,300 840,650 910,1100 C 940,1260 880,1340 1080,1340 Z" fill="#991b1b" opacity="0.92"/>
  <path d="M 1080,0 L 920,0 C 950,300 910,700 960,1100 L 1080,1100 Z" fill="#7f1d1d" opacity="0.6"/>

  <!-- Hollywood Dressing Vanity Mirror (Left Side) -->
  <rect x="70" y="380" width="210" height="480" rx="12" fill="#2d2238" stroke="#d97706" stroke-width="6"/>
  <rect x="90" y="400" width="170" height="440" rx="6" fill="#64748b" opacity="0.35"/>
  <!-- Mirror bulbs left -->
  ${[420, 490, 560, 630, 700, 770].map(y => `
    <circle cx="80" cy="${y}" r="8" fill="#fef08a" filter="url(#softGlow)"/>
    <circle cx="270" cy="${y}" r="8" fill="#fef08a" filter="url(#softGlow)"/>
  `).join('')}

  <!-- Clothes Rack (Right Side) -->
  <line x1="840" y1="460" x2="1020" y2="460" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/>
  <line x1="860" y1="460" x2="860" y2="1100" stroke="#64748b" stroke-width="6"/>
  <line x1="1000" y1="460" x2="1000" y2="1100" stroke="#64748b" stroke-width="6"/>
  <!-- Hanger dresses -->
  <path d="M 880,480 L 860,530 L 860,820 L 900,820 L 900,530 Z" fill="#f43f5e" opacity="0.8"/>
  <path d="M 910,480 L 890,530 L 890,870 L 935,870 L 935,530 Z" fill="#a855f7" opacity="0.8"/>
  <path d="M 945,480 L 925,530 L 925,840 L 970,840 L 970,530 Z" fill="#38bdf8" opacity="0.8"/>
  <path d="M 980,480 L 960,530 L 960,890 L 1005,890 L 1005,530 Z" fill="#fbbf24" opacity="0.8"/>

  <!-- Backstage ambient fairy lights across top -->
  <path d="M 0,80 Q 270,140 540,90 Q 810,140 1080,80" fill="none" stroke="#ca8a04" stroke-width="2"/>
  ${[70, 160, 250, 360, 460, 560, 680, 790, 900, 1000].map((x, i) => `
    <circle cx="${x}" cy="${95 + (i % 2) * 15}" r="6" fill="#fef08a" filter="url(#softGlow)"/>
  `).join('')}
</svg>
`;

// 2. MODELS IDLE (800x650) - The two models separate, pretending to prepare
const modelsIdleSvg = `
<svg width="800" height="650" viewBox="0 0 800 650" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="drop" x="-10%" y="-10%" width="120%" height="130%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feOffset dx="0" dy="8"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <g filter="url(#drop)">
    <!-- MODEL 1 (LEFT - Blonde/Warm) -->
    <!-- Shadow under feet -->
    <ellipse cx="260" cy="620" rx="110" ry="16" fill="#000000" opacity="0.3"/>

    <!-- Dress -->
    <path d="M 210,310 Q 180,440 160,580 L 360,580 Q 340,440 310,310 Z" fill="#ec4899"/>
    <path d="M 220,310 L 260,370 L 300,310 Z" fill="#fbcfe8"/>
    <!-- Belt -->
    <rect x="205" y="360" width="110" height="14" rx="4" fill="#9d174d"/>

    <!-- Legs -->
    <rect x="210" y="575" width="26" height="50" rx="10" fill="#fed7aa"/>
    <rect x="284" y="575" width="26" height="50" rx="10" fill="#fed7aa"/>
    <!-- Shoes -->
    <ellipse cx="220" cy="620" rx="18" ry="7" fill="#be185d"/>
    <ellipse cx="298" cy="620" rx="18" ry="7" fill="#be185d"/>

    <!-- Neck & Head -->
    <rect x="245" y="190" width="30" height="30" rx="6" fill="#fed7aa"/>
    <ellipse cx="260" cy="140" rx="55" ry="60" fill="#fed7aa"/>
    <!-- Hair back -->
    <path d="M 180,120 Q 170,260 210,340 Q 260,360 290,340 Q 340,260 330,120 Z" fill="#eab308"/>
    <!-- Face details -->
    <!-- Eyes (Looking sideways/to mirror) -->
    <ellipse cx="240" cy="140" rx="8" ry="6" fill="#1e293b"/>
    <circle cx="242" cy="138" r="2.5" fill="#ffffff"/>
    <ellipse cx="280" cy="140" rx="8" ry="6" fill="#1e293b"/>
    <circle cx="282" cy="138" r="2.5" fill="#ffffff"/>
    <!-- Eyelashes & Brows -->
    <path d="M 230,130 Q 240,126 250,130" stroke="#854d0e" stroke-width="3" fill="none"/>
    <path d="M 270,130 Q 280,126 290,130" stroke="#854d0e" stroke-width="3" fill="none"/>
    <!-- Blush -->
    <ellipse cx="230" cy="154" rx="10" ry="5" fill="#fda4af" opacity="0.6"/>
    <ellipse cx="290" cy="154" rx="10" ry="5" fill="#fda4af" opacity="0.6"/>
    <!-- Sweet Smile -->
    <path d="M 252,166 Q 260,174 268,166" stroke="#e11d48" stroke-width="3" fill="none" stroke-linecap="round"/>
    <!-- Hair front / bangs -->
    <path d="M 195,120 Q 260,80 325,120 Q 300,100 260,110 Q 220,100 195,120 Z" fill="#facc15"/>
    <!-- Hand holding makeup brush/compact -->
    <path d="M 310,320 Q 350,330 360,260" stroke="#fed7aa" stroke-width="20" stroke-linecap="round" fill="none"/>
    <circle cx="360" cy="250" r="14" fill="#38bdf8"/>
    <circle cx="360" cy="250" r="9" fill="#f0f9ff"/>


    <!-- MODEL 2 (RIGHT - Brunette/Chic) -->
    <!-- Shadow under feet -->
    <ellipse cx="540" cy="620" rx="110" ry="16" fill="#000000" opacity="0.3"/>

    <!-- Dress -->
    <path d="M 490,310 Q 460,440 440,580 L 640,580 Q 620,440 590,310 Z" fill="#8b5cf6"/>
    <path d="M 500,310 L 540,370 L 580,310 Z" fill="#ddd6fe"/>
    <!-- Belt -->
    <rect x="485" y="360" width="110" height="14" rx="4" fill="#5b21b6"/>

    <!-- Legs -->
    <rect x="490" y="575" width="26" height="50" rx="10" fill="#fde68a"/>
    <rect x="564" y="575" width="26" height="50" rx="10" fill="#fde68a"/>
    <!-- Shoes -->
    <ellipse cx="500" cy="620" rx="18" ry="7" fill="#6d28d9"/>
    <ellipse cx="578" cy="620" rx="18" ry="7" fill="#6d28d9"/>

    <!-- Neck & Head -->
    <rect x="525" y="190" width="30" height="30" rx="6" fill="#fde68a"/>
    <ellipse cx="540" cy="140" rx="55" ry="60" fill="#fde68a"/>
    <!-- Hair back (Long dark glossy hair) -->
    <path d="M 460,110 Q 440,260 480,360 Q 540,390 580,360 Q 620,260 610,110 Z" fill="#312e81"/>
    <!-- Face details -->
    <!-- Eyes (Looking toward the front/mirror) -->
    <ellipse cx="520" cy="140" rx="8" ry="6" fill="#1e293b"/>
    <circle cx="518" cy="138" r="2.5" fill="#ffffff"/>
    <ellipse cx="560" cy="140" rx="8" ry="6" fill="#1e293b"/>
    <circle cx="558" cy="138" r="2.5" fill="#ffffff"/>
    <!-- Eyelashes & Brows -->
    <path d="M 510,130 Q 520,126 530,130" stroke="#1e1b4b" stroke-width="3" fill="none"/>
    <path d="M 550,130 Q 560,126 570,130" stroke="#1e1b4b" stroke-width="3" fill="none"/>
    <!-- Blush -->
    <ellipse cx="510" cy="154" rx="10" ry="5" fill="#fda4af" opacity="0.6"/>
    <ellipse cx="570" cy="154" rx="10" ry="5" fill="#fda4af" opacity="0.6"/>
    <!-- Sweet Smile -->
    <path d="M 532,166 Q 540,174 548,166" stroke="#be185d" stroke-width="3" fill="none" stroke-linecap="round"/>
    <!-- Hair front / side swept -->
    <path d="M 470,110 Q 540,75 605,115 Q 575,100 535,105 Q 495,100 470,110 Z" fill="#4338ca"/>
    <!-- Hand fixing hair -->
    <path d="M 490,320 Q 450,280 470,170" stroke="#fde68a" stroke-width="20" stroke-linecap="round" fill="none"/>
  </g>
</svg>
`;

// 3. MODELS KISSING (800x650) - The two models kissing passionately & sweetly
const modelsKissingSvg = `
<svg width="800" height="650" viewBox="0 0 800 650" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="kissGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Romantic Sparkles & Heart Aura -->
  <g filter="url(#kissGlow)" opacity="0.75">
    <path d="M 400,60 C 370,10 320,30 320,80 C 320,140 400,190 400,200 C 400,190 480,140 480,80 C 480,30 430,10 400,60 Z" fill="#f43f5e" opacity="0.6"/>
    <circle cx="280" cy="100" r="12" fill="#fb7185"/>
    <circle cx="520" cy="90" r="14" fill="#f472b6"/>
    <text x="390" y="45" font-size="34" fill="#ffedd5" text-anchor="middle">💖</text>
  </g>

  <!-- Shadows under feet -->
  <ellipse cx="400" cy="620" rx="180" ry="18" fill="#000000" opacity="0.35"/>

  <!-- MODEL 1 (Embracing from left) -->
  <g>
    <!-- Legs Left -->
    <rect x="330" y="575" width="24" height="50" rx="10" fill="#fed7aa"/>
    <ellipse cx="338" cy="620" rx="18" ry="7" fill="#be185d"/>

    <!-- Dress Left -->
    <path d="M 310,310 Q 290,440 280,580 L 410,580 Q 380,440 370,310 Z" fill="#ec4899"/>
    <!-- Belt -->
    <rect x="305" y="360" width="70" height="14" rx="4" fill="#9d174d"/>

    <!-- Left Torso & Neck -->
    <rect x="335" y="200" width="30" height="30" rx="6" fill="#fed7aa"/>
    <!-- Blonde Hair Back -->
    <path d="M 260,130 Q 230,260 270,360 Q 320,380 340,360 Q 370,260 360,130 Z" fill="#eab308"/>
    <!-- Left Head (Tilted in) -->
    <g transform="rotate(18, 360, 150)">
      <ellipse cx="355" cy="145" rx="52" ry="56" fill="#fed7aa"/>
      <!-- Closed Blissful Eyes -->
      <path d="M 365,138 Q 377,148 389,138" stroke="#854d0e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <!-- Soft Eyelashes -->
      <line x1="377" y1="145" x2="379" y2="152" stroke="#854d0e" stroke-width="2.5"/>
      <!-- Deep Pink Blush -->
      <ellipse cx="370" cy="156" rx="14" ry="7" fill="#f43f5e" opacity="0.85"/>
      <!-- Hair Bangs -->
      <path d="M 305,125 Q 360,85 410,125 Q 380,105 345,115 Z" fill="#facc15"/>
    </g>

    <!-- Left Arm Embracing Partner's Waist/Neck -->
    <path d="M 315,310 Q 390,300 450,290" stroke="#fed7aa" stroke-width="22" stroke-linecap="round" fill="none"/>
  </g>

  <!-- MODEL 2 (Embracing from right) -->
  <g>
    <!-- Legs Right -->
    <rect x="446" y="575" width="24" height="50" rx="10" fill="#fde68a"/>
    <ellipse cx="458" cy="620" rx="18" ry="7" fill="#6d28d9"/>

    <!-- Dress Right -->
    <path d="M 390,310 Q 420,440 390,580 L 520,580 Q 510,440 490,310 Z" fill="#8b5cf6"/>
    <!-- Belt -->
    <rect x="425" y="360" width="70" height="14" rx="4" fill="#5b21b6"/>

    <!-- Right Torso & Neck -->
    <rect x="435" y="200" width="30" height="30" rx="6" fill="#fde68a"/>
    <!-- Dark Hair Back -->
    <path d="M 440,130 Q 470,260 530,360 Q 500,380 460,360 Q 430,260 440,130 Z" fill="#312e81"/>
    <!-- Right Head (Tilted in) -->
    <g transform="rotate(-18, 440, 150)">
      <ellipse cx="445" cy="145" rx="52" ry="56" fill="#fde68a"/>
      <!-- Closed Blissful Eyes -->
      <path d="M 411,138 Q 423,148 435,138" stroke="#1e1b4b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <!-- Soft Eyelashes -->
      <line x1="423" y1="145" x2="421" y2="152" stroke="#1e1b4b" stroke-width="2.5"/>
      <!-- Deep Pink Blush -->
      <ellipse cx="430" cy="156" rx="14" ry="7" fill="#f43f5e" opacity="0.85"/>
      <!-- Hair front -->
      <path d="M 395,125 Q 440,85 495,125 Q 460,105 425,115 Z" fill="#4338ca"/>
    </g>

    <!-- Right Arm Embracing Partner's Shoulder/Neck -->
    <path d="M 485,310 Q 410,290 350,230" stroke="#fde68a" stroke-width="22" stroke-linecap="round" fill="none"/>
  </g>

  <!-- THE KISS CONTACT POINT (Sweet Lips Touching with Heart Glow) -->
  <g transform="translate(400, 172)">
    <circle cx="0" cy="0" r="16" fill="#fb7185" opacity="0.5" filter="url(#kissGlow)"/>
    <!-- Tender touching lips -->
    <path d="M -6,-2 Q 0,-8 6,-2 Q 0,4 -6,-2 Z" fill="#e11d48"/>
    <!-- Little sparkling kisses -->
    <text x="-25" y="-14" font-size="20">✨</text>
    <text x="18" y="-14" font-size="20">✨</text>
  </g>
</svg>
`;

// 4. FRIENDS IDLE (860x480) - Girlfriend & Friend at desk pretending to work
const friendsIdleSvg = `
<svg width="860" height="480" viewBox="0 0 860 480" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="deskDrop" x="-10%" y="-10%" width="120%" height="130%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feOffset dx="0" dy="6"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <g filter="url(#deskDrop)">
    <!-- FRIEND 1 (GIRLFRIEND - LEFT) -->
    <!-- Chair back -->
    <rect x="200" y="110" width="130" height="150" rx="20" fill="#334155"/>
    <!-- Body / Top -->
    <path d="M 220,180 Q 190,260 210,320 L 320,320 Q 340,260 310,180 Z" fill="#065f46"/>
    <!-- Head -->
    <ellipse cx="265" cy="110" rx="42" ry="48" fill="#fde68a"/>
    <!-- Cute Wavy Hair -->
    <path d="M 210,80 Q 200,160 220,220 Q 265,240 310,220 Q 330,160 320,80 Z" fill="#92400e"/>
    <path d="M 225,80 Q 265,50 305,80 Q 285,65 265,70 Q 245,65 225,80 Z" fill="#b45309"/>
    <!-- Face: focused on screen -->
    <ellipse cx="250" cy="115" rx="6" ry="4.5" fill="#1e293b"/>
    <ellipse cx="280" cy="115" rx="6" ry="4.5" fill="#1e293b"/>
    <path d="M 260,135 Q 265,140 270,135" stroke="#be185d" stroke-width="2.5" fill="none"/>
    <!-- Arm pretending to type -->
    <path d="M 230,220 Q 250,270 290,280" stroke="#fde68a" stroke-width="16" stroke-linecap="round" fill="none"/>

    <!-- FRIEND 2 (BESTIE - RIGHT) -->
    <!-- Chair back -->
    <rect x="530" y="110" width="130" height="150" rx="20" fill="#334155"/>
    <!-- Body / Top -->
    <path d="M 550,180 Q 520,260 540,320 L 650,320 Q 670,260 640,180 Z" fill="#4338ca"/>
    <!-- Head -->
    <ellipse cx="595" cy="110" rx="42" ry="48" fill="#fed7aa"/>
    <!-- Chic Ponytail / Hair -->
    <path d="M 540,80 Q 530,160 550,220 Q 595,240 640,220 Q 660,160 650,80 Z" fill="#1e1b4b"/>
    <path d="M 555,80 Q 595,50 635,80 Q 615,65 595,70 Q 575,65 555,80 Z" fill="#312e81"/>
    <!-- Ponytail puff on side -->
    <circle cx="650" cy="90" r="18" fill="#1e1b4b"/>
    <!-- Face: focused / watching clipboard -->
    <ellipse cx="580" cy="115" rx="6" ry="4.5" fill="#1e293b"/>
    <ellipse cx="610" cy="115" rx="6" ry="4.5" fill="#1e293b"/>
    <path d="M 590,135 Q 595,140 600,135" stroke="#be185d" stroke-width="2.5" fill="none"/>
    <!-- Arm holding coffee mug -->
    <path d="M 630,220 Q 620,270 580,280" stroke="#fed7aa" stroke-width="16" stroke-linecap="round" fill="none"/>


    <!-- THE DESK (Spans the bottom of friends view) -->
    <!-- Tabletop -->
    <rect x="50" y="270" width="760" height="50" rx="10" fill="#b45309" stroke="#78350f" stroke-width="5"/>
    <!-- Front panel -->
    <rect x="70" y="320" width="720" height="140" fill="#92400e"/>
    <!-- Table legs -->
    <rect x="80" y="320" width="30" height="150" fill="#78350f"/>
    <rect x="750" y="320" width="30" height="150" fill="#78350f"/>

    <!-- Desk Props -->
    <!-- Laptop Left -->
    <path d="M 230,280 L 310,280 L 295,220 L 245,220 Z" fill="#94a3b8"/>
    <rect x="220" y="278" width="100" height="8" rx="2" fill="#cbd5e1"/>
    <!-- Screen glow -->
    <polygon points="247,222 293,222 307,276 233,276" fill="#38bdf8" opacity="0.6"/>

    <!-- Papers / Scripts in middle -->
    <rect x="390" y="280" width="80" height="20" rx="3" fill="#f8fafc" transform="rotate(-6, 430, 290)"/>
    <rect x="400" y="282" width="75" height="18" rx="3" fill="#f1f5f9" transform="rotate(4, 430, 290)"/>

    <!-- Cute Coffee Mug Right -->
    <rect x="520" y="255" width="28" height="34" rx="4" fill="#f43f5e"/>
    <path d="M 548,262 C 558,262 558,278 548,278" stroke="#f43f5e" stroke-width="4" fill="none"/>
    <text x="534" y="278" font-size="12" fill="#fff" text-anchor="middle">☕</text>
  </g>
</svg>
`;

// 5. FRIENDS SIGNAL (860x480) - Girlfriend & Friend giving the "OK" / alert thumbs-up signal!
const friendsSignalSvg = `
<svg width="860" height="480" viewBox="0 0 860 480" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="sigDrop" x="-10%" y="-10%" width="120%" height="130%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feOffset dx="0" dy="6"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <filter id="okGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <g filter="url(#sigDrop)">
    <!-- FRIEND 1 (GIRLFRIEND - LEFT) - Smiling & giving big OK gesture -->
    <rect x="200" y="110" width="130" height="150" rx="20" fill="#334155"/>
    <path d="M 220,180 Q 190,260 210,320 L 320,320 Q 340,260 310,180 Z" fill="#065f46"/>
    <!-- Head tilted with conspiratorial wink -->
    <g transform="rotate(8, 265, 110)">
      <ellipse cx="265" cy="110" rx="42" ry="48" fill="#fde68a"/>
      <!-- Hair -->
      <path d="M 210,80 Q 200,160 220,220 Q 265,240 310,220 Q 330,160 320,80 Z" fill="#92400e"/>
      <path d="M 225,80 Q 265,50 305,80 Q 285,65 265,70 Q 245,65 225,80 Z" fill="#b45309"/>
      <!-- Eye 1: Open bright spark -->
      <ellipse cx="250" cy="112" rx="7" ry="5.5" fill="#1e293b"/>
      <circle cx="248" cy="110" r="2.5" fill="#fff"/>
      <!-- Eye 2: Complicit wink -->
      <path d="M 273,114 Q 282,106 291,114" stroke="#1e293b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <!-- Happy Grin -->
      <path d="M 252,132 Q 265,146 278,132" stroke="#be185d" stroke-width="3" fill="#ffe4e6" stroke-linecap="round"/>
      <ellipse cx="242" cy="126" rx="8" ry="4" fill="#fda4af" opacity="0.8"/>
      <ellipse cx="288" cy="126" rx="8" ry="4" fill="#fda4af" opacity="0.8"/>
    </g>

    <!-- Girlfriend Hand: Raised high with "OK" 👌 Sign -->
    <path d="M 220,230 Q 160,200 160,110" stroke="#fde68a" stroke-width="18" stroke-linecap="round" fill="none"/>
    <g transform="translate(160, 100)" filter="url(#okGlow)">
      <!-- OK Hand -->
      <circle cx="0" cy="0" r="22" fill="#22c55e" opacity="0.25"/>
      <text x="0" y="8" font-size="32" text-anchor="middle">👌</text>
    </g>


    <!-- FRIEND 2 (BESTIE - RIGHT) - Smiling & Thumbs up 👍 -->
    <rect x="530" y="110" width="130" height="150" rx="20" fill="#334155"/>
    <path d="M 550,180 Q 520,260 540,320 L 650,320 Q 670,260 640,180 Z" fill="#4338ca"/>
    <!-- Head tilted, watching door & giving signal -->
    <g transform="rotate(-8, 595, 110)">
      <ellipse cx="595" cy="110" rx="42" ry="48" fill="#fed7aa"/>
      <path d="M 540,80 Q 530,160 550,220 Q 595,240 640,220 Q 660,160 650,80 Z" fill="#1e1b4b"/>
      <path d="M 555,80 Q 595,50 635,80 Q 615,65 595,70 Q 575,65 555,80 Z" fill="#312e81"/>
      <circle cx="650" cy="90" r="18" fill="#1e1b4b"/>
      <!-- Eyes looking at models excitedly -->
      <ellipse cx="580" cy="112" rx="7" ry="5.5" fill="#1e293b"/>
      <circle cx="578" cy="110" r="2.5" fill="#fff"/>
      <ellipse cx="610" cy="112" rx="7" ry="5.5" fill="#1e293b"/>
      <circle cx="608" cy="110" r="2.5" fill="#fff"/>
      <!-- Grin -->
      <path d="M 585,132 Q 595,146 605,132" stroke="#be185d" stroke-width="3" fill="#ffe4e6" stroke-linecap="round"/>
      <ellipse cx="572" cy="126" rx="8" ry="4" fill="#fda4af" opacity="0.8"/>
      <ellipse cx="618" cy="126" rx="8" ry="4" fill="#fda4af" opacity="0.8"/>
    </g>

    <!-- Friend 2 Hand: Raised high with Thumbs-up 👍 -->
    <path d="M 640,230 Q 700,200 700,110" stroke="#fed7aa" stroke-width="18" stroke-linecap="round" fill="none"/>
    <g transform="translate(700, 100)" filter="url(#okGlow)">
      <circle cx="0" cy="0" r="22" fill="#22c55e" opacity="0.25"/>
      <text x="0" y="8" font-size="32" text-anchor="middle">👍</text>
    </g>

    <!-- Signal Banner speech badge: "VIA LIBERA!" -->
    <g transform="translate(430, 130)">
      <rect x="-85" y="-24" width="170" height="48" rx="24" fill="#22c55e" stroke="#ffffff" stroke-width="3" filter="url(#okGlow)"/>
      <text x="0" y="6" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="16" fill="#ffffff" letter-spacing="1">VIA LIBERA! 💕</text>
    </g>

    <!-- THE DESK -->
    <rect x="50" y="270" width="760" height="50" rx="10" fill="#b45309" stroke="#78350f" stroke-width="5"/>
    <rect x="70" y="320" width="720" height="140" fill="#92400e"/>
    <rect x="80" y="320" width="30" height="150" fill="#78350f"/>
    <rect x="750" y="320" width="30" height="150" fill="#78350f"/>

    <path d="M 230,280 L 310,280 L 295,220 L 245,220 Z" fill="#94a3b8"/>
    <rect x="220" y="278" width="100" height="8" rx="2" fill="#cbd5e1"/>
    <polygon points="247,222 293,222 307,276 233,276" fill="#38bdf8" opacity="0.6"/>

    <rect x="390" y="280" width="80" height="20" rx="3" fill="#f8fafc" transform="rotate(-6, 430, 290)"/>
    <rect x="520" y="255" width="28" height="34" rx="4" fill="#f43f5e"/>
    <path d="M 548,262 C 558,262 558,278 548,278" stroke="#f43f5e" stroke-width="4" fill="none"/>
    <text x="534" y="278" font-size="12" fill="#fff" text-anchor="middle">☕</text>
  </g>
</svg>
`;

// 6. BOSS HIDDEN (100x100) - Transparent
const bossHiddenSvg = `
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Fully transparent -->
</svg>
`;

// 7. BOSS WARNING (500x600) - Shadow and alert sign at doorway
const bossWarningSvg = `
<svg width="500" height="600" viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="warnGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="14" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Door silhouette / approaching dark shadow -->
  <g opacity="0.85">
    <ellipse cx="250" cy="560" rx="140" ry="24" fill="#000000" opacity="0.5"/>
    <!-- Approaching tall trenchcoat shadow -->
    <path d="M 170,550 Q 140,320 200,210 Q 250,150 300,210 Q 360,320 330,550 Z" fill="#09060e"/>
    <!-- Shadow Head -->
    <ellipse cx="250" cy="180" rx="55" ry="60" fill="#09060e"/>
  </g>

  <!-- Warning Icon Alert Badge (Large vibrant "!" alert) -->
  <g transform="translate(250, 240)" filter="url(#warnGlow)">
    <!-- Yellow warning hexagon / badge -->
    <polygon points="0,-110 95,-55 95,55 0,110 -95,55 -95,-55" fill="#eab308" stroke="#ffffff" stroke-width="8"/>
    <!-- Inner border -->
    <polygon points="0,-95 82,-48 82,48 0,95 -82,48 -82,-48" fill="#ca8a04"/>
    
    <!-- Bold Exclamation Mark -->
    <rect x="-14" y="-70" width="28" height="85" rx="10" fill="#ffffff"/>
    <circle cx="0" cy="52" r="15" fill="#ffffff"/>
  </g>

  <!-- Vibration shockwaves -->
  <g stroke="#facc15" stroke-width="4" stroke-linecap="round" opacity="0.8">
    <path d="M 120,200 Q 100,240 120,280" fill="none"/>
    <path d="M 380,200 Q 400,240 380,280" fill="none"/>
  </g>

  <!-- Ominous Warning Text -->
  <g transform="translate(250, 400)">
    <rect x="-130" y="-18" width="260" height="36" rx="18" fill="#18181b" stroke="#eab308" stroke-width="3"/>
    <text x="0" y="6" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="15" fill="#fef08a" letter-spacing="1">PASSI IN CORRIDOIO... ⚠️</text>
  </g>
</svg>
`;

// 8. BOSS WATCHING (500x650) - Boss leaning in, squinting, checking the room
const bossWatchingSvg = `
<svg width="500" height="650" viewBox="0 0 500 650" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="watchGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Spotlight Cone scanning the room -->
  <polygon points="250,220 80,640 420,640" fill="#fef08a" opacity="0.12"/>

  <!-- Boss Peeking In -->
  <!-- Torso / Dark suit -->
  <path d="M 160,340 Q 130,500 110,640 L 390,640 Q 370,500 340,340 Z" fill="#1e293b"/>
  <!-- Shirt & Red Tie -->
  <polygon points="250,340 220,380 250,520 280,380" fill="#dc2626"/>
  <polygon points="230,340 270,340 250,380" fill="#f8fafc"/>

  <!-- Arms / Clipboard -->
  <rect x="290" y="440" width="130" height="170" rx="10" fill="#78350f" stroke="#451a03" stroke-width="4"/>
  <rect x="305" y="460" width="100" height="135" rx="4" fill="#f8fafc"/>
  <line x1="320" y1="485" x2="385" y2="485" stroke="#94a3b8" stroke-width="3"/>
  <line x1="320" y1="510" x2="375" y2="510" stroke="#94a3b8" stroke-width="3"/>
  <line x1="320" y1="535" x2="390" y2="535" stroke="#94a3b8" stroke-width="3"/>

  <!-- Neck -->
  <rect x="230" y="300" width="40" height="45" rx="6" fill="#fed7aa"/>

  <!-- Head Leaning in with Suspicious Expression -->
  <g transform="rotate(-6, 250, 220)">
    <!-- Face -->
    <ellipse cx="250" cy="220" rx="72" ry="78" fill="#fed7aa"/>
    <!-- Receding Hair / Boss hair -->
    <path d="M 175,200 Q 170,140 250,135 Q 330,140 325,200 Q 300,165 250,165 Q 200,165 175,200 Z" fill="#475569"/>
    
    <!-- Furrowed Angry/Suspicious Brows -->
    <path d="M 195,190 L 235,205" stroke="#1e293b" stroke-width="6" stroke-linecap="round"/>
    <path d="M 305,190 L 265,205" stroke="#1e293b" stroke-width="6" stroke-linecap="round"/>

    <!-- Squinting, Investigating Eyes -->
    <ellipse cx="215" cy="215" rx="16" ry="11" fill="#f8fafc" stroke="#1e293b" stroke-width="3"/>
    <circle cx="220" cy="215" r="5" fill="#dc2626"/>
    <ellipse cx="285" cy="215" rx="16" ry="11" fill="#f8fafc" stroke="#1e293b" stroke-width="3"/>
    <circle cx="280" cy="215" r="5" fill="#dc2626"/>

    <!-- Boss Glasses -->
    <rect x="195" y="202" width="40" height="26" rx="6" fill="none" stroke="#0f172a" stroke-width="4"/>
    <rect x="265" y="202" width="40" height="26" rx="6" fill="none" stroke="#0f172a" stroke-width="4"/>
    <line x1="235" y1="215" x2="265" y2="215" stroke="#0f172a" stroke-width="4"/>

    <!-- Sharp Nose & Mustache -->
    <path d="M 250,215 L 246,242 L 254,242" stroke="#d97706" stroke-width="3" fill="none"/>
    <path d="M 225,250 Q 250,245 275,250 Q 250,265 225,250 Z" fill="#334155"/>

    <!-- Skeptical mouth -->
    <path d="M 235,268 L 265,264" stroke="#881337" stroke-width="4" stroke-linecap="round"/>
  </g>

  <!-- Suspicious radar beacon -->
  <g transform="translate(250, 100)">
    <rect x="-110" y="-18" width="220" height="36" rx="18" fill="#dc2626" stroke="#ffffff" stroke-width="3" filter="url(#watchGlow)"/>
    <text x="0" y="6" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="14" fill="#ffffff" letter-spacing="1">IL CAPO CONTROLLA! 👀</text>
  </g>
</svg>
`;

// 9. BOSS CAUGHT (600x700) - The boss caught them! Angry anime shock & funny speech bubble
const bossCaughtSvg = `
<svg width="600" height="700" viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="caughtGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Big Comic Action Background Burst -->
  <g transform="translate(300, 360)" opacity="0.25">
    ${Array.from({ length: 16 }, (_, i) => `
      <polygon points="0,0 ${Math.cos(i * Math.PI / 8) * 360},${Math.sin(i * Math.PI / 8) * 360} ${Math.cos((i + 0.3) * Math.PI / 8) * 360},${Math.sin((i + 0.3) * Math.PI / 8) * 360}" fill="#ef4444"/>
    `).join('')}
  </g>

  <!-- Steam Puffs coming from ears (Fumetto buffo) -->
  <g filter="url(#caughtGlow)" fill="#ffffff" opacity="0.95">
    <ellipse cx="140" cy="280" rx="35" ry="24"/>
    <ellipse cx="110" cy="260" rx="25" ry="18"/>
    <ellipse cx="90" cy="235" rx="18" ry="14"/>
    <ellipse cx="460" cy="280" rx="35" ry="24"/>
    <ellipse cx="490" cy="260" rx="25" ry="18"/>
    <ellipse cx="510" cy="235" rx="18" ry="14"/>
  </g>

  <!-- Angry Red Vein Symbol (💢) -->
  <g transform="translate(370, 220)" stroke="#dc2626" stroke-width="7" stroke-linecap="round">
    <path d="M -15,-20 L 15,-20"/>
    <path d="M -20,-15 L -20,15"/>
    <path d="M 20,-15 L 20,15"/>
    <path d="M -15,20 L 15,20"/>
  </g>

  <!-- Angry Boss Body -->
  <path d="M 180,420 Q 150,560 130,680 L 470,680 Q 450,560 420,420 Z" fill="#0f172a"/>
  <!-- Neck -->
  <rect x="275" y="370" width="50" height="60" rx="6" fill="#fca5a5"/>

  <!-- Angry Boss Head (Red face!) -->
  <ellipse cx="300" cy="300" rx="88" ry="94" fill="#f87171"/>
  <!-- Hair standing on end -->
  <path d="M 200,280 Q 200,180 300,170 Q 400,180 400,280 Q 370,220 300,220 Q 230,220 200,280 Z" fill="#334155"/>

  <!-- Super Wide Shocked/Enraged Eyes (Popping out) -->
  <circle cx="255" cy="290" r="26" fill="#ffffff" stroke="#000" stroke-width="4"/>
  <circle cx="255" cy="290" r="10" fill="#dc2626"/>
  <circle cx="345" cy="290" r="26" fill="#ffffff" stroke="#000" stroke-width="4"/>
  <circle cx="345" cy="290" r="10" fill="#dc2626"/>

  <!-- Giant Open Screaming Mouth (Buffo) -->
  <path d="M 245,340 Q 300,395 355,340 Q 300,330 245,340 Z" fill="#7f1d1d" stroke="#000" stroke-width="4"/>
  <!-- Tongue -->
  <ellipse cx="300" cy="365" rx="28" ry="12" fill="#f43f5e"/>

  <!-- BIG COMIC SPEECH BUBBLE (Fumetto Buffo in alto) -->
  <g transform="translate(300, 105)" filter="url(#caughtGlow)">
    <!-- Speech bubble body -->
    <path d="M -240,-75 L 240,-75 Q 260,-75 260,-55 L 260,35 Q 260,55 240,55 L 20,55 L -10,88 L -5,55 L -240,55 Q -260,55 -260,35 L -260,-55 Q -260,-75 -240,-75 Z" fill="#ffffff" stroke="#dc2626" stroke-width="6"/>
    <!-- Text inside bubble -->
    <text x="0" y="-20" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="28" fill="#dc2626" letter-spacing="1">BECCATE IN PIENO! 😱💥</text>
    <text x="0" y="22" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="19" fill="#1e293b">«COSA SUCCEDE DIETRO LE QUINTE?!»</text>
  </g>
</svg>
`;

const assets = [
  { name: 'background.png', svg: bgSvg },
  { name: 'models_idle.png', svg: modelsIdleSvg },
  { name: 'models_kissing.png', svg: modelsKissingSvg },
  { name: 'friends_idle.png', svg: friendsIdleSvg },
  { name: 'friends_signal.png', svg: friendsSignalSvg },
  { name: 'boss_hidden.png', svg: bossHiddenSvg },
  { name: 'boss_warning.png', svg: bossWarningSvg },
  { name: 'boss_watching.png', svg: bossWatchingSvg },
  { name: 'boss_caught.png', svg: bossCaughtSvg }
];

assets.forEach(asset => {
  const tmpSvg = path.join(targetDir, `tmp_${asset.name}.svg`);
  const finalPng = path.join(targetDir, asset.name);
  fs.writeFileSync(tmpSvg, asset.svg.trim(), 'utf8');
  try {
    execSync(`convert -background none "${tmpSvg}" "${finalPng}"`);
    console.log(`Generated: ${asset.name}`);
  } catch (err) {
    console.error(`Error converting ${asset.name}:`, err.message);
  } finally {
    if (fs.existsSync(tmpSvg)) fs.unlinkSync(tmpSvg);
  }
});

console.log('All 9 Ora, Ora ! assets generated in public/assets/');
