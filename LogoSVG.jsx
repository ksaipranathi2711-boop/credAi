export default function LogoSVG({ size = 36, id = 'main' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" className="logo-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`lg1-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id={`lg2-${id}`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#00D4FF" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="15" fill="none" stroke={`url(#lg1-${id})`} strokeWidth="1.5" strokeDasharray="60 35" className="logo-ring-outer" />
      <circle cx="18" cy="18" r="10" fill="none" stroke={`url(#lg2-${id})`} strokeWidth="1"   strokeDasharray="40 23" className="logo-ring-inner" />
      <polygon points="18,8 26,18 18,28 10,18" fill="none" stroke={`url(#lg1-${id})`} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="18" cy="18" r="3"   fill={`url(#lg1-${id})`} />
      <circle cx="18" cy="8"  r="1.5" fill="#00D4FF" opacity="0.8" />
      <circle cx="26" cy="18" r="1.5" fill="#8B5CF6" opacity="0.8" />
      <circle cx="18" cy="28" r="1.5" fill="#2DD4BF" opacity="0.8" />
      <circle cx="10" cy="18" r="1.5" fill="#00D4FF" opacity="0.8" />
    </svg>
  );
}
