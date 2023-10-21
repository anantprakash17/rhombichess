import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { SignOutButton } from "@/components/Buttons";

export default async function Home() {
  const session = await getServerSession(authOptions);

  console.log(session.user);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignOutButton />
      RhombiChess
    </main>
  )
}
