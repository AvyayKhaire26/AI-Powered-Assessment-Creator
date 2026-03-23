import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center pb-20 md:pb-0">
      
      {/* ── ILLUSTRATION (STRICT FIGMA COORDINATES) ── */}
      <div className="relative" style={{ width: '310px', height: '310px', marginBottom: '16px' }}>
        <svg viewBox="0 0 310 310" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          
          {/* Outer Circle: width 240, height 240, top 29, left 30 */}
          <defs>
            <linearGradient id="circleGrad" x1="150" y1="29" x2="150" y2="269" gradientUnits="userSpaceOnUse">
              <stop offset="-0.159" stopColor="#F2F2F2" />
              <stop offset="1.5868" stopColor="#EFEFEF" />
            </linearGradient>
          </defs>
          <circle cx="150" cy="149" r="120" fill="url(#circleGrad)" />

          {/* Ribbon Logo: width 82, height 73.66, top 60.57, left 7 */}
          <path 
            d="M 12 118 C 35 108 65 115 65 88 C 65 63 40 63 35 83 C 30 103 45 108 89 60.57" 
            stroke="#1A2233" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            fill="none" 
          />

          {/* Document Sheet (Sits underneath the glass) */}
          <rect x="105" y="75" width="85" height="120" rx="8" fill="white" />
          <rect x="120" y="90" width="30" height="7" rx="3.5" fill="#0A1526" />
          <rect x="120" y="110" width="60" height="5" rx="2.5" fill="#E2E8F0" />
          <rect x="120" y="125" width="60" height="5" rx="2.5" fill="#E2E8F0" />
          <rect x="120" y="140" width="60" height="5" rx="2.5" fill="#E2E8F0" />
          <rect x="120" y="155" width="45" height="5" rx="2.5" fill="#E2E8F0" />

          {/* Top Right Intersecting Rectangle: width 70.2, height 40.3, top 46.42, left 223 */}
          <rect x="223" y="46.42" width="70.2" height="40.38" rx="6" fill="white" />
          <circle cx="236" cy="66.6" r="4.5" fill="#C4B5FD" />
          <rect x="246" y="62.6" width="22" height="8" rx="4" fill="#E2E8F0" />

          {/* Magnifying Glass Outer Ring: width 125, height 125, top 100.56, left 122.61 */}
          {/* Center = cx: 185.11, cy: 163.06 */}
          <circle cx="185.11" cy="163.06" r="56.5" fill="none" stroke="#E1DCEB" strokeWidth="12" />
          
          {/* Magnifying Glass Inner Frosted Glass (Applies Blur to Document Lines) */}
          <circle 
            cx="185.11" 
            cy="163.06" 
            r="50.5" 
            fill="rgba(255, 255, 255, 0.65)" 
            style={{ backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }} 
          />

          {/* Handle (Rotated from center of glass) */}
          <line 
            x1="225" y1="203" 
            x2="252" y2="230" 
            stroke="#E1DCEB" 
            strokeWidth="16" 
            strokeLinecap="round" 
          />

          {/* Red Cross: width 50, height 50, top 138, left 160 */}
          {/* Centered perfectly over the glass center (185, 163) */}
          <path d="M 165 143 L 205 183" stroke="#FF4B4B" strokeWidth="9" strokeLinecap="round" />
          <path d="M 205 143 L 165 183" stroke="#FF4B4B" strokeWidth="9" strokeLinecap="round" />

          {/* Blue Dot (Bottom Right - Outside the 240px circle) */}
          <circle cx="260" cy="170" r="5" fill="#4A7DA5" />

          {/* Blue Star (Bottom Left - Laying on the inside border) */}
          <path 
            d="M 85 185 Q 85 195 95 195 Q 85 195 85 205 Q 85 195 75 195 Q 85 195 85 185 Z" 
            fill="#4A7DA5" 
          />
        </svg>
      </div>

      {/* ── TEXT CONTENT ── */}
      <h2 
        className="font-bold font-['Bricolage_Grotesque'] tracking-[-0.04em]"
        style={{ fontSize: '22px', color: '#1A1A1A', marginBottom: '12px' }}
      >
        No assignments yet
      </h2>
      
      {/* The space issue is fixed here! 
        Hardcoding marginBottom to 56px ensures the gap exactly matches Figma. 
      */}
      <p 
        className="font-medium font-['Bricolage_Grotesque'] tracking-[-0.04em]"
        style={{ 
          fontSize: '15px', 
          color: '#808080', 
          maxWidth: '460px', 
          lineHeight: '140%', 
          marginBottom: '56px' /* Forced Space between Text and Button */
        }}
      >
        Create your first assignment to start collecting and grading student submissions. 
        You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>

      {/* ── PREMIUM BUTTON ── */}
      <Link 
        href="/assignments/create" 
        style={{
          position: 'relative',
          width: '277px',
          height: '46px',
          background: '#181818',
          borderRadius: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          padding: '12px 24px',
          textDecoration: 'none',
          boxSizing: 'border-box',
        }}
      >
        {/* 1.5px Linear Gradient Border Mask */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '100px',
            padding: '1.5px', 
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(102, 102, 102, 0) 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none', /* Ensures the border doesn't block clicks */
          }}
        />

        {/* Plus Icon: 20x20 */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* Text Specs */}
        <span style={{
          fontFamily: 'Bricolage Grotesque',
          fontWeight: 500,
          fontSize: '16px',
          lineHeight: '140%',
          letterSpacing: '-0.04em',
          color: 'white',
          textAlign: 'center',
          zIndex: 1, /* Keeps text above the border mask */
        }}>
          Create Your First Assignment
        </span>
      </Link>
    </div>
  );
}