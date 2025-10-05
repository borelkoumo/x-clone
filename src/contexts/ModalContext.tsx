'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  postId: string | null;
  setPostId: (postId: string | null) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen, postId, setPostId }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

export default ModalContext;
