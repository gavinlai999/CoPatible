import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Using a simplified type for now based on what the API currently returns
interface MatchRecord {
  id: string;
  profileId: string;
  experienceId?: string;
  circleId?: string;
  match_reason?: string;
  status: string;
  experience?: any; // The experience object from the nested join
}

interface MatchingContextType {
  matches: MatchRecord[];
  setMatches: React.Dispatch<React.SetStateAction<MatchRecord[]>>;
}

const MatchingContext = createContext<MatchingContextType | undefined>(undefined);

export function MatchingProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<MatchRecord[]>([]);

  // We need a profile ID to get matches. In a real app, this comes from an Auth Context.
  // For now, we will just use a hardcoded dev ID or skip fetching if null.
  const DEV_PROFILE_ID = "123"; 

  useEffect(() => {
    async function loadMatches() {
      try {
        const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/matches/${DEV_PROFILE_ID}`);
        if (response.ok) {
          const data = await response.json();
          setMatches(data as MatchRecord[]);
        }
      } catch (e) {
        console.error("API error loading matches:", e);
      }
    }
    loadMatches();
  }, []);

  return (
    <MatchingContext.Provider value={{ matches, setMatches }}>
      {children}
    </MatchingContext.Provider>
  );
}

export function useMatchingContext() {
  const context = useContext(MatchingContext);
  if (context === undefined) {
    throw new Error('useMatchingContext must be used within a MatchingProvider');
  }
  return context;
}
