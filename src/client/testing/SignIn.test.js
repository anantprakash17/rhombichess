/* eslint-disable global-require */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import SignInCard from '../components/SignInCard';

export const validUsername = 'mbazinagrolinger@gmail.com';
export const validPassword = 'password';

export const wrongUsername = 'wrong@gmail.com';
export const wrongPassword = 'wrong';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

useRouter.mockImplementation(() => ({
  refresh: jest.fn(),
}));

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({}),
}));

describe('Sign In', () => {
  it('Sign In - Successful sign in', async () => {
    render(<SignInCard />);

    const emailInput = screen.getByPlaceholderText('name@company.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('Sign in to your account');

    fireEvent.change(emailInput, { target: { value: validUsername } });
    fireEvent.change(passwordInput, { target: { value: validPassword } });

    const signIn = jest.fn().mockResolvedValue({ error: null });
    require('next-auth/react').signIn = signIn;

    fireEvent.click(submitButton);

    await screen.findByText('Signing in...');

    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: validUsername,
      password: validPassword,
      redirect: false,
      callbackUrl: '/',
    });
  });

  it('Sign in - Wrong username and wrong password', async () => {
    render(<SignInCard />);

    const emailInput = screen.getByPlaceholderText('name@company.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('Sign in to your account');

    fireEvent.change(emailInput, { target: { value: wrongUsername } });
    fireEvent.change(passwordInput, { target: { value: wrongPassword } });

    const signIn = jest.fn().mockResolvedValue({ error: 'Incorrect email or password. Please try again.' });
    require('next-auth/react').signIn = signIn;

    require('next-auth/react').signIn = signIn;

    fireEvent.click(submitButton);

    await screen.findByText('Signing in...');

    await screen.findByText('Incorrect email or password. Please try again.');

    expect(screen.getByText('Incorrect email or password. Please try again.')).toBeInTheDocument();

    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: wrongUsername,
      password: wrongPassword,
      redirect: false,
      callbackUrl: '/',
    });
  });

  it('Sign in - Right username and wrong password', async () => {
    render(<SignInCard />);

    const emailInput = screen.getByPlaceholderText('name@company.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('Sign in to your account');

    fireEvent.change(emailInput, { target: { value: validUsername } });
    fireEvent.change(passwordInput, { target: { value: wrongPassword } });

    const signIn = jest.fn().mockResolvedValue({ error: 'Incorrect email or password. Please try again.' });
    require('next-auth/react').signIn = signIn;

    fireEvent.click(submitButton);

    await screen.findByText('Signing in...');

    await screen.findByText('Incorrect email or password. Please try again.');

    expect(screen.getByText('Incorrect email or password. Please try again.')).toBeInTheDocument();

    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: validUsername,
      password: wrongPassword,
      redirect: false,
      callbackUrl: '/',
    });
  });

  it('Sign in - Wrong username and right password', async () => {
    render(<SignInCard />);

    const emailInput = screen.getByPlaceholderText('name@company.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('Sign in to your account');

    fireEvent.change(emailInput, { target: { value: wrongUsername } });
    fireEvent.change(passwordInput, { target: { value: validPassword } });

    const signIn = jest.fn().mockResolvedValue({ error: 'Incorrect email or password. Please try again.' });
    require('next-auth/react').signIn = signIn;

    fireEvent.click(submitButton);

    await screen.findByText('Signing in...');

    await screen.findByText('Incorrect email or password. Please try again.');

    expect(screen.getByText('Incorrect email or password. Please try again.')).toBeInTheDocument();

    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: wrongUsername,
      password: validPassword,
      redirect: false,
      callbackUrl: '/',
    });
  });
});
