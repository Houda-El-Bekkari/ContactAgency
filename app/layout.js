export const dynamic = 'force-dynamic'; // ← désactive le prerendering statique

import { Inter } from 'next/font/google';
import { ClerkProvider } from './providers/ClerkProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ContactAgency - Gestion des Agences et Contacts',
  description: 'Plateforme de gestion des agences partenaires et de leurs contacts.',
  keywords: 'agences, contacts, gestion, dashboard, professionnel',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
