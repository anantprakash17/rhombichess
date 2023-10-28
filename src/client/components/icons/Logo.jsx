import React from 'react';

export default function Logo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="100">
      <path d="M 50 10 L 73.1 50 L 50 90 L 26.9 50 Z" fill="#44403C" />
      <path d="M 50 10 L 73.1 50 L 50 90 L 26.9 50 Z" fill="#67E8F9" transform="rotate(60,50 90)" />
      <path d="M 50 10 L 73.1 50 L 50 90 L 26.9 50 Z" fill="#EF4444" transform="rotate(-60,50 90)" />
    </svg>
  );
}
