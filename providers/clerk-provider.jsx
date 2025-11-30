'use client';

import { ClerkProvider } from '@clerk/nextjs';

export function ClerkClientProvider({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} // ← ajoute cette ligne
    >
      {children}
    </ClerkProvider>
  );
}
