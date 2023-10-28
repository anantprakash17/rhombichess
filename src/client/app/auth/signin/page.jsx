import React from 'react';
import SignInCard from '@/components/SignInCard';
//lg:h-screen

export default async function SignIn() {
  return (
    <div className="flex min-h-screen bg-white lg:bg-custom-image bg-center lg:h-screen">
      <div className="relative my-auto flex w-full flex-col items-center justify-center lg:w-1/2">
          <div className="w-full rounded-lg p-6 max-w-[500px] mb-28">
            <SignInCard />
          </div>
      </div>
    </div>
  );
}
