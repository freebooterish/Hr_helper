import { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  names: string[];
  setNames: (names: string[]) => void;
  addNames: (newNames: string[]) => void;
  removeName: (index: number) => void;
  clearNames: () => void;
  removeDuplicates: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [names, setNames] = useState<string[]>([]);

  const addNames = (newNames: string[]) => {
    setNames((prev) => {
      const combined = [...prev, ...newNames];
      // Do not remove duplicates automatically anymore, just trim and filter empty
      return combined.map(n => n.trim()).filter(n => n !== '');
    });
  };

  const removeName = (indexToRemove: number) => {
    setNames((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearNames = () => {
    setNames([]);
  };

  const removeDuplicates = () => {
    setNames((prev) => Array.from(new Set(prev)));
  };

  return (
    <AppContext.Provider value={{ names, setNames, addNames, removeName, clearNames, removeDuplicates }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
