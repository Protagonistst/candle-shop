import { Citrus, Cookie, Flame, Flower2, TreePine, Wind, type LucideIcon } from 'lucide-react';
import type { ScentFamily } from '../../shared/types';

// eslint-disable-next-line react-refresh/only-export-components
export const familyIcons: Record<ScentFamily, LucideIcon> = {
  floral: Flower2,
  woody: TreePine,
  citrus: Citrus,
  spicy: Flame,
  fresh: Wind,
  gourmand: Cookie,
};

type SvgProps = { className?: string };

export const InstagramIcon = ({ className = 'h-5 w-5' }: SvgProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export const PinterestIcon = ({ className = 'h-5 w-5' }: SvgProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-3.64 19.31c-.09-.79-.17-2 .04-2.86l1.17-4.97s-.3-.6-.3-1.48c0-1.39.8-2.42 1.81-2.42.85 0 1.26.64 1.26 1.4 0 .86-.55 2.14-.83 3.33-.24 1 .5 1.81 1.48 1.81 1.78 0 3.15-1.88 3.15-4.58 0-2.39-1.72-4.07-4.18-4.07-2.85 0-4.52 2.14-4.52 4.35 0 .86.33 1.78.74 2.28a.3.3 0 0 1 .07.29l-.28 1.13c-.04.18-.15.22-.33.13-1.25-.58-2.03-2.4-2.03-3.87 0-3.15 2.29-6.04 6.6-6.04 3.46 0 6.16 2.47 6.16 5.77 0 3.44-2.17 6.21-5.18 6.21-1.01 0-1.96-.53-2.29-1.15l-.62 2.37c-.23.87-.84 1.96-1.25 2.62A10 10 0 1 0 12 2Z" />
  </svg>
);

export const TikTokIcon = ({ className = 'h-5 w-5' }: SvgProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 3.37-2.48V9.66a5.73 5.73 0 0 0-.77-.05A5.68 5.68 0 0 0 4.18 15.3 5.68 5.68 0 0 0 9.86 21a5.68 5.68 0 0 0 5.68-5.68V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.24-1.48Z" />
  </svg>
);

/** Small brand mark: a flame inside a jar outline. */
export const LogoMark = ({ className = 'h-7 w-7' }: SvgProps) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M9 12h14v13a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4V12Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 12h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path
      d="M16 3.5c1.9 2.2 3 3.8 3 5.3a3 3 0 0 1-6 0c0-1.5 1.1-3.1 3-5.3Z"
      fill="#D99A3E"
      className="origin-bottom animate-flicker"
    />
    <path d="M16 9.5v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
