/* eslint-disable global-require */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
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


describe('SignInCard Component', () => {
  beforeEach(() => {
    render(
      <SessionProvider session={{}}>
        <SignInCard />
      </SessionProvider>,
    );
  });

  it('renders without crashing', () => {
    const emailField = screen.getByPlaceholderText('name@company.com');
    const passwordField = screen.getByPlaceholderText('••••••••');
    const signInButton = screen.getByText('Sign in to your account');

    expect(emailField).toBeVisible();
    expect(passwordField).toBeVisible();
    expect(signInButton).toBeVisible();
  });

  it('updates Email on input change', () => {
    const emailInput = screen.getByRole('textbox', { name: /Email/i });
    fireEvent.change(emailInput, { target: { value: 'name@company.com' } });

    expect(emailInput.value).toBe('name@company.com');
  });

  it('updates Password on input change', () => {
    const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    expect(passwordInput.value).toBe('password');
  });

  it('successful sign in', async () => {
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

  it('unsuccessful sign in with wrong username and wrong password', async () => {
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

  it('unsuccessful sign in with right username and wrong password', async () => {
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

  it('unsuccessful sign in with wrong username and right password', async () => {
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
