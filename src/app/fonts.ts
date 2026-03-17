import localFont from 'next/font/local';
import { Montserrat } from 'next/font/google';

export const phosphate = localFont({
  src: [
    {
      path: '../../public/fonts/PhosphateSolid.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/phosphatesolid-webfont.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-phosphate',
  display: 'swap',
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

import { Space_Grotesk } from 'next/font/google';

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});
