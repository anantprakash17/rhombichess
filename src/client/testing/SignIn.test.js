

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignInCard from '../components/SignInCard';
import { useRouter } from 'next/navigation';
import * as sic from './configs/SignIn_configs';

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

useRouter.mockImplementation(() => ({
  refresh: jest.fn(),
}));

describe('Sign In', () => {
  it('Successful sign in', async () => {
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

})
