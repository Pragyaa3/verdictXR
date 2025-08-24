//frontend/src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';

export function useInternetIdentity() {
  const [client, setClient] = useState<AuthClient | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    AuthClient.create().then((c) => {
      setClient(c);
      c.isAuthenticated().then((auth) => {
        if (auth) {
          setPrincipal(c.getIdentity().getPrincipal().toText());
          setIsAuthenticated(true);
        }
      });
    });
  }, []);

  const login = () => client?.login({
    identityProvider: "https://identity.ic0.app/#authorize",
    onSuccess: () => {
      setPrincipal(client.getIdentity().getPrincipal().toText());
      setIsAuthenticated(true);
    }
  });

  const logout = () => {
    client?.logout();
    setPrincipal(null);
    setIsAuthenticated(false);
  };

  return { principal, isAuthenticated, login, logout };
} 