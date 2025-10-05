'use client';

import { ModalProvider } from './ModalContext';

export default function ContextWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ModalProvider>{children}</ModalProvider>;
}
