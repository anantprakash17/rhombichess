"use client";

import React, { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    fetch("http://localhost:8080/api/home")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      RhombiChess
    </main>
  )
}
