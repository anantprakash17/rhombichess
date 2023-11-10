import React from 'react';
import LandingHero from '../../components/LandingHero';

export default async function Home() {
  return (
    <main className="relative flex justify-center items-center min-h-screen">
      <LandingHero />
    </main>
  );
}