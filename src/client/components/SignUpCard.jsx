'use client';

import React, { useState } from 'react';
import { ClosedEye, OpenEye } from './icons/EyeIcons';
import Spinner from './Spinner';
import Logo from './icons/Logo';

export default function SignUpCard() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleNameChange = (event) => setName(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value.trim());
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleConfirmPasswordChange = (event) => {
    setPasswordsMatch(password === event.target.value);
  };

  function capitalizeName(string) {
    return string
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      return;
    }

    setLoading(true);

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: capitalizeName(name.trim()),
        email: email.toLowerCase().trim(),
        password,
      }),
    });

    if (response.ok) {
      window.location.href = '/auth/signin';
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.error);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" action="#">
      <div className="flex justify-center">
        <Logo />
      </div>
      <h1 className="font-jockeyOne text-5xl text-center text-gray-700">
        RhombiChess
      </h1>
      {errorMessage && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}
      <div>
        <label htmlFor="name" className="mb-2 block font-medium">
          Full Name
        </label>
        <input
          className="block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
          id="name"
          name="name"
          onChange={handleNameChange}
          placeholder="John Doe"
          required
          type="name"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block font-medium">
          Email
        </label>
        <input
          className="block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
          id="email"
          name="email"
          onChange={handleEmailChange}
          placeholder="name@company.com"
          required
          type="email"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block font-medium">
          Password
        </label>
        <div className="relative">
          <input
            className="block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 pr-12 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder={showPassword ? 'password' : '••••••••'}
            required
            type={showPassword ? 'text' : 'password'}
          />
          <button
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 my-auto ml-2 mr-2.5 flex h-fit items-center p-1"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
          >
            {showPassword ? (
              <OpenEye />
            ) : (
              <ClosedEye />
            )}
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="mb-2 block font-medium">
          Confirm Password
        </label>
        <div className="relative">
          <input
            className={`${!passwordsMatch ? 'border-red-400 border-2 focus:border-red-400 focus:ring-red-400 focus:outline-none' : 'focus:ring-blue-500 focus:border-blue-500'} block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 pr-12 placeholder:text-slate-400`}
            id="confirmPassword"
            name="confirmPassword"
            onChange={handleConfirmPasswordChange}
            placeholder={showPassword ? 'password' : '••••••••'}
            required
            type={showPassword ? 'text' : 'password'}
          />
          <button
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 my-auto ml-2 mr-2.5 flex h-fit items-center p-1"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
          >
            {showPassword ? (
              <OpenEye />
            ) : (
              <ClosedEye />
            )}
          </button>
          <span className={`${passwordsMatch ? 'hidden' : 'absolute'} mt-1 text-sm text-red-500`}>
            Passwords do not match!
          </span>
        </div>
      </div>
      <div />
      <button disabled={loading} type="submit" className="w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed">
        {loading ? (
          <div className="flex items-center justify-center">
            <Spinner />
            Signing up...
          </div>
        ) : (
          'Sign up for RhombiChess'
        )}
      </button>
    </form>
  );
}
