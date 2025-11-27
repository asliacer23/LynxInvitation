import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientService } from '@/services/clientService';
import type { Client } from '@/types';

interface ClientLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout wrapper for client-specific pages
 * Provides client context and data to child components
 */
export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const { clientSlug } = useParams<{ clientSlug: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientSlug) {
      setError('Client not found');
      setLoading(false);
      return;
    }

    const fetchClient = async () => {
      try {
        setLoading(true);
        const fetchedClient = await clientService.getClientBySlug(clientSlug);

        if (!fetchedClient) {
          setError('Client not found');
          setTimeout(() => navigate('/'), 3000);
        } else {
          setClient(fetchedClient);
          setError(null);
        }
      } catch (err) {
        setError('Failed to load client');
        console.error('Error fetching client:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientSlug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
          <p className="text-gray-600 mb-4">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="client-layout">
      <ClientContext.Provider value={{ client: client! }}>
        {children}
      </ClientContext.Provider>
    </div>
  );
};

// Create context for client data
interface ClientContextValue {
  client: Client;
}

export const ClientContext = React.createContext<ClientContextValue | undefined>(undefined);

// Hook to use client context
export const useClient = (): Client => {
  const context = React.useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within ClientLayout');
  }
  return context.client;
};
