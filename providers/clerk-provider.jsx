'use client';

import { ClerkProvider as BaseClerkProvider } from '@clerk/nextjs';

export function ClerkClientProvider({ children }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
  }

  return (
    <BaseClerkProvider
      publishableKey={publishableKey}
      localization={frFR}
    >
      {children}
    </BaseClerkProvider>
  );
}
