import { COLORS } from '../constants/colors';

const DeerLogo = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    <path d="M30 35 Q15 25 10 15 M30 35 Q20 30 22 20" fill="none" stroke={COLORS.primary} strokeWidth="6" strokeLinecap="round" />
    <path d="M70 35 Q85 25 90 15 M70 35 Q80 30 78 20" fill="none" stroke={COLORS.primary} strokeWidth="6" strokeLinecap="round" />
    <rect x="25" y="35" width="50" height="45" rx="20" fill="#FAF3E0" stroke={COLORS.text} strokeWidth="3" />
    <path d="M25 45 Q15 40 20 55" fill="#FAF3E0" stroke={COLORS.text} strokeWidth="3" />
    <path d="M75 45 Q85 40 80 55" fill="#FAF3E0" stroke={COLORS.text} strokeWidth="3" />
    <circle cx="40" cy="55" r="3" fill={COLORS.text} />
    <circle cx="60" cy="55" r="3" fill={COLORS.text} />
    <circle cx="35" cy="62" r="4" fill="#F8C4B4" opacity="0.6" />
    <circle cx="65" cy="62" r="4" fill="#F8C4B4" opacity="0.6" />
    <path d="M47 65 L50 68 L53 65" fill="none" stroke={COLORS.text} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default DeerLogo;
