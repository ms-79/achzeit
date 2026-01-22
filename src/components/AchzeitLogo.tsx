import { cn } from '@/lib/utils';

interface AchzeitLogoProps {
  className?: string;
  color?: string;
}

const AchzeitLogo = ({ className, color = 'currentColor' }: AchzeitLogoProps) => {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-48 h-auto', className)}
    >
      {/* Mountain Icon */}
      <path
        d="M40 65 L100 20 L115 35 L130 25 L160 65"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* ACHZEIT Text */}
      <text
        x="100"
        y="100"
        textAnchor="middle"
        fill={color}
        fontFamily="'Inter', sans-serif"
        fontSize="28"
        fontWeight="500"
        letterSpacing="0.15em"
      >
        ACHZEIT
      </text>
    </svg>
  );
};

export default AchzeitLogo;
