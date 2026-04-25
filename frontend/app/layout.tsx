import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { theme } from '../theme';

export const metadata = {
  title: 'Vuln Camp',
  description: 'Premium Camping Gear for Outdoor Enthusiasts',
};

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '../components/CartDrawer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <AuthProvider>
            <CartProvider>
              <Header />
              <main style={{ minHeight: 'calc(100vh - 340px)' }}>
                {children}
              </main>
              {/* <Footer /> */}
              <CartDrawer />
            </CartProvider>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
