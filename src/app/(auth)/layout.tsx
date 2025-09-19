import '@/app/globals.css';
import Loader from '@/components/Loader';
import { ClerkProvider, ClerkLoading, ClerkLoaded } from '@clerk/nextjs';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ClerkLoading>
            <Loader />
          </ClerkLoading>
          <ClerkLoaded>{children}</ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
