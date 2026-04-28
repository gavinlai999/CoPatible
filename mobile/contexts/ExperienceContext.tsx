import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// Define the Experience type from our API schema
export interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  capacity: number;
  container_type: string;
}

interface ExperienceContextType {
  experiences: Experience[];
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
}

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    async function loadExperiences() {
      try {
        const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/experiences`);
        if (response.ok) {
          const data = await response.json();
          setExperiences(data as Experience[]);
        } else {
          console.error("Failed to load experiences from API");
        }
      } catch (e) {
        console.error("API error loading experiences:", e);
      }
    }
    loadExperiences();
  }, []);

  return (
    <ExperienceContext.Provider value={{ experiences, setExperiences }}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperienceContext() {
  const context = useContext(ExperienceContext);
  if (context === undefined) {
    throw new Error('useExperienceContext must be used within an ExperienceProvider');
  }
  return context;
};
