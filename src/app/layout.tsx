import '~/styles/globals.css';

import { Toaster } from 'react-hot-toast';
import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';

import { GeistSans } from 'geist/font/sans';
import { PageProgress } from '~/components';
import { LoadingScreen } from '~/screens';
import type { Metadata } from 'next';
import type { Viewport } from 'next';

import { env } from '~/env';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_OG_BASE_URL),
  title: {
    template: '%s | Gymkhana Technical',
    default: 'Gymkhana Technical',
  },
  description:
    'Experience BTC Gymkhana Technical: Register for events, explore clubs, and dive into college life! Join the excitement today!',
  applicationName: 'Gymkhana Technical',
  keywords: [
    'NIT Agartala',
    'College Events',
    'Gymkhana Technical',
    'BTC',
    'IIIT Agartala',
  ],
  creator: 'Vedant Chainani',
  publisher: 'Gymkhana Technical',
  icons: [
    { rel: 'icon', url: '/icon.png' },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
  ],
  manifest: '/manifest.json',
  twitter: {
    card: 'summary_large_image',
    title: 'Gymkhana Technical',
    description:
      'Experience BTC Gymkhana Technical: Register for events, explore clubs, and dive into college life! Join the excitement today!',
    creator: '@Envoy_1084',
    images: [
      {
        url: `/api/og`,
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: `Gymkhana Technical`,
      },
    ],
  },
  openGraph: {
    title: 'Gymkhana Technical',
    description:
      'Experience BTC Gymkhana Technical: Register for events, explore clubs, and dive into college life! Join the excitement today!',
    type: 'website',
    locale: 'en_US',
    url: 'https://btc.gymkhananita.com',
    images: [
      {
        url: `/api/og`,
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: `Gymkhana Technical`,
      },
    ],
  },
  other: {
    'msapplication-tap-highlight': 'no',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Gymkhana Technical',
    'msapplication-TileColor': '#fff',
  },
};

export const viewport: Viewport = {
  themeColor: 'white',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <ClerkProvider>
        <body className={`${GeistSans.className}`}>
          <PageProgress />
          <ClerkLoading>
            <LoadingScreen />
          </ClerkLoading>
          <ClerkLoaded>
            {children}
            <Toaster position='bottom-right' />
          </ClerkLoaded>
        </body>
      </ClerkProvider>
    </html>
  );
}
