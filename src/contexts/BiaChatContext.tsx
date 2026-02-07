import { createContext, useContext, useState, ReactNode } from 'react';

interface BiaChatContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const BiaChatContext = createContext<BiaChatContextType | undefined>(undefined);

export function BiaChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BiaChatContext.Provider value={{
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen(prev => !prev),
    }}>
      {children}
    </BiaChatContext.Provider>
  );
}

export function useBiaChat() {
  const context = useContext(BiaChatContext);
  if (!context) {
    throw new Error('useBiaChat must be used within BiaChatProvider');
  }
  return context;
}
