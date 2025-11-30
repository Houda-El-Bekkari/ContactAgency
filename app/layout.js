export const dynamic = 'force-dynamic'; // must be at the top

import { Inter } from 'next/font/google';
import { ClerkClientProvider } from '../providers/clerk-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ClerkClientProvider>
          {children}
        </ClerkClientProvider>
      </body>
    </html>
  );
}
