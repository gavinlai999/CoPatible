import React, { createContext, useContext, useState, ReactNode } from "react";
import { checkIns } from "../mocks/checkIns";

const MoodContext = createContext<ReturnType<typeof useMoodContextHook> | null>(null);

const useMoodContextHook = () => {
  const [history, setHistory] = useState(checkIns);
  const [currentMood, setCurrentMood] = useState("High Energy");
  return { history, setHistory, currentMood, setCurrentMood };
};

export const MoodProvider = ({ children }: { children: ReactNode }) => {
  const value = useMoodContextHook();
  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};

export const useMoodContext = () => {
  const context = useContext(MoodContext);
  if (!context) throw new Error("useMoodContext must be used within MoodProvider");
  return context;
};
