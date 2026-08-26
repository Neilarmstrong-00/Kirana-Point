import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '@/styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { AuthModal } from '@/components/auth/AuthModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#2D7A3A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://kirana-point.vercel.app'),
  title: {
    default: 'Kirana Point — Your Local Grocery Store, Now Online',
    template: '%s | Kirana Point',
  },
  description:
    'Order fresh daily groceries, staples, atta, dals, dairy, oils, snacks and household essentials from your trusted neighbourhood store in Khamgaon, Buldhana. ₹0 gateway fees, direct UPI payments & fast same-day delivery.',
  applicationName: 'Kirana Point',
  authors: [{ name: 'Pratham Tarde', url: 'https://kirana-point.vercel.app' }],
  creator: 'Kirana Point',
  publisher: 'Kirana Point',
  keywords: [
    'Kirana Point',
    'Khamgaon grocery store',
    'online grocery delivery Buldhana',
    'grocery shopping Maharashtra',
    'fresh vegetables Khamgaon',
    'atta rice dal delivery',
    'Pratham Tarde',
    'UPI grocery shopping',
    'same day grocery delivery',
  ],
  category: 'shopping',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://kirana-point.vercel.app',
    title: 'Kirana Point — Fresh Groceries Delivered to Your Doorstep',
    description:
      'Order fresh daily essentials, staples, dairy & snacks online in Khamgaon, Dist Buldhana. ₹0 gateway fees, direct UPI payments & fast same-day delivery.',
    siteName: 'Kirana Point',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'Kirana Point Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kirana Point — Fresh Groceries Delivered in Khamgaon',
    description:
      'Order fresh groceries, staples, atta, rice, and dairy online. Direct UPI payments to store owner with fast same-day doorstep delivery.',
    images: ['/favicon.png'],
    creator: '@kiranapoint',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-gray-900 selection:bg-primary-100 selection:text-primary-900">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6 pb-24 sm:pb-10">
          {children}
        </main>
        <Footer />
        <MobileNav />
        <AuthModal />
      </body>
    </html>
  );
}
