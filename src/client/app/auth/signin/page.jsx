import React from 'react';
import SignInCard from '@/components/SignInCard';
//lg:h-screen

export default async function SignIn() {
  return (
    <div className="flex min-h-screen bg-custom-image bg-cover lg:h-screen md:bg-white sm:bg-white">
      <div className="relative my-auto flex w-full flex-col items-center mb-80 lg:w-1/2">
          <div className="w-full rounded-lg p-6 max-w-[500px]">
            <SignInCard />
          </div>
      </div>
    </div>
  );
}
