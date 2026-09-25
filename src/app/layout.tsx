import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import './components.css';
import { ShopProvider } from '@/context/ShopContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OwnerRibbon from '@/components/OwnerRibbon';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'SMARTECH COMPUTERS Hindupur | Refurbished Laptops, PARADOX Accessories & Repairs',
  description: 'Smartech Computers, Near Shilpa Hospital, RPGT Road, Hindupur. Consistent PARADOX gaming keyboards, certified refurbished laptops, gaming PCs, and in-shop expert repairs & upgrades.',
  keywords: 'Smartech Computers Hindupur, RPGT Road Shilpa Hospital, Paradox gaming keyboard, refurbished laptops Hindupur, laptop repair Hindupur, Consistent SSD, shop computer repair Hindupur, workbench repair',
  authors: [{ name: 'SMARTECH COMPUTERS' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ShopProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <OwnerRibbon />
            <Suspense fallback={<div style={{ minHeight: '110px' }} />}>
              <Header />
            </Suspense>
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
          </div>
        </ShopProvider>
      </body>
    </html>
  );
}
