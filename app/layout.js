import { ClerkClientProvider } from '../providers/clerk-provider';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ContactAgency - Gestion des Agences et Contacts',
  description: 'Plateforme de gestion des agences partenaires et de leurs contacts. Outils puissants pour optimiser votre workflow.',
  keywords: 'agences, contacts, gestion, dashboard, professionnel',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ClerkClientProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          {children}
        </ClerkClientProvider>
      </body>
    </html>
  );
}
