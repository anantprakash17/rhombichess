
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignInCard from '../components/SignInCard';
import { useRouter } from 'next/navigation';
import * as sic from './configs/SignIn_configs';

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

useRouter.mockImplementation(() => ({
  refresh: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

describe('Sign In', () => {

  it('Sign In - Successful sign in', async () => {
    render(<SignInCard />);

    const emailInput = screen.getByPlaceholderText('name@company.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('Sign in to your account');

    fireEvent.change(emailInput, { target: { value: sic.U1username } });
    fireEvent.change(passwordInput, { target: { value: sic.U1password } });


    const signIn = jest.fn().mockResolvedValue({ error: null });
    require('next-auth/react').signIn = signIn;

    fireEvent.click(submitButton);

    await screen.findByText('Signing in...');

    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: sic.U1username,
      password: sic.U1password,
      redirect: false,
      callbackUrl: '/',
    });
  })

  it('Sign in - Wrong username and wrong password', async () => {
    render(<SignInCard />);

    const emailInput = screen.getByPlaceholderText('name@company.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('Sign in to your account');

    fireEvent.change(emailInput, { target: { value: sic.wrongUsername } });
    fireEvent.change(passwordInput, { target: { value: sic.wrongPassword } });

    const signIn = jest.fn().mockResolvedValue({ error: 'Incorrect email or password. Please try again.' });
    require('next-auth/react').signIn = signIn;
    
    require('next-auth/react').signIn = signIn;

    fireEvent.click(submitButton);

    await screen.findByText('Signing in...');

    await screen.findByText('Incorrect email or password. Please try again.');

    expect(screen.getByText('Incorrect email or password. Please try again.')).toBeInTheDocument();
    
    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: sic.wrongUsername,
      password: sic.wrongPassword,
      redirect: false,
      callbackUrl: '/',
    });
  })

  it('Sign in - Right username and wrong password', async () => {
    render(<SignInCard />);

    const emailInput = screen.getByPlaceholderText('name@company.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('Sign in to your account');

    fireEvent.change(emailInput, { target: { value: sic.U1username } });
    fireEvent.change(passwordInput, { target: { value: sic.wrongPassword } });

    const signIn = jest.fn().mockResolvedValue({ error: 'Incorrect email or password. Please try again.' });
    require('next-auth/react').signIn = signIn;

    fireEvent.click(submitButton);

    await screen.findByText('Signing in...');

    await screen.findByText('Incorrect email or password. Please try again.');

    expect(screen.getByText('Incorrect email or password. Please try again.')).toBeInTheDocument();
    
    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: sic.U1username,
      password: sic.wrongPassword,
      redirect: false,
      callbackUrl: '/',
    });
  })

  it('Sign in - Wrong username and right password', async () => {
    render(<SignInCard />);

    const emailInput = screen.getByPlaceholderText('name@company.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('Sign in to your account');

    fireEvent.change(emailInput, { target: { value: sic.wrongUsername } });
    fireEvent.change(passwordInput, { target: { value: sic.U1password } });

    const signIn = jest.fn().mockResolvedValue({ error: 'Incorrect email or password. Please try again.' });
    require('next-auth/react').signIn = signIn;

    fireEvent.click(submitButton);

    await screen.findByText('Signing in...');

    await screen.findByText('Incorrect email or password. Please try again.');

    expect(screen.getByText('Incorrect email or password. Please try again.')).toBeInTheDocument();
    
    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: sic.wrongUsername,
      password: sic.U1password,
      redirect: false,
      callbackUrl: '/',
    });
  })

})
