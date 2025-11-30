'use client';

import { useState } from 'react';

export function SyncUserButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSync = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/sync-user');
      const data = await response.json();

      if (data.success) {
        setMessage('Synchronisation réussie ! Rafraîchissez la page.');
      } else {
        setMessage('Erreur lors de la synchronisation: ' + data.error);
      }
    } catch (error) {
      setMessage('Erreur: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSync}
        disabled={isLoading}
        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Synchronisation...' : 'Synchroniser'}
      </button>
      {message && (
        <p className={`mt-2 text-sm ${message.includes('réussie') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}