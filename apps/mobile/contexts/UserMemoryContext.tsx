import React, { createContext, useContext, useState, ReactNode } from "react";

const UserMemoryContext = createContext<ReturnType<typeof useUserMemoryContextHook> | null>(null);

const useUserMemoryContextHook = () => {
  const [memories, setMemories] = useState(["want to meet people at the seed stage"]);
  return { memories, setMemories };
};

export const UserMemoryProvider = ({ children }: { children: ReactNode }) => {
  const value = useUserMemoryContextHook();
  return <UserMemoryContext.Provider value={value}>{children}</UserMemoryContext.Provider>;
};

export const useUserMemoryContext = () => {
  const context = useContext(UserMemoryContext);
  if (!context) throw new Error("useUserMemoryContext must be used within UserMemoryProvider");
  return context;
};
