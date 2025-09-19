import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex justify-center p-3 h-screen">
      <SignIn />
    </div>
  );
}
