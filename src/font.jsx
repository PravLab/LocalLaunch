import { Poppins } from 'next/font/google';
import { Baloo_2 } from 'next/font/google';

import { Rubik } from 'next/font/google';

export const rubik = Rubik({
  subsets: ['latin'],
  weight: ['500', '700'], 
  display: 'swap',
});

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

export const baloo = Baloo_2({
  subsets: ['latin', 'devanagari'],
  weight: ['400', '600'],
  display: 'swap',
});


