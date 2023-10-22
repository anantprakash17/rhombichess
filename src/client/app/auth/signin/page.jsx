import React from 'react';
import SignInCard from '@/components/SignInCard';

export default async function SignIn() {
  return (
    <div className="flex min-h-screen bg-white-800 p-6">
      <div className="relative my-auto flex w-full flex-col items-center">
        <div className="w-full max-w-[500px] rounded-lg bg-white p-6">
          <SignInCard />
        </div>
      </div>
    </div>
  );
}
