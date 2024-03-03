import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUpCard from '../components/SignUpCard';

const fillSignUpForm = async (userData) => {
  const { name, email, password, confirmPassword } = userData;
  fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: name } });
  fireEvent.change(screen.getByPlaceholderText('name@company.com'), { target: { value: email } });
  fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0], { target: { value: password } });
  fireEvent.change(screen.getAllByPlaceholderText('••••••••')[1], { target: { value: confirmPassword } });
};

describe('SignUpCard Component', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { href: '', assign: jest.fn(), replace: jest.fn() };

    render(<SignUpCard />);

    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  it('renders without crashing', () => {
    const fullNameField = screen.getByPlaceholderText('John Doe');
    const emailField = screen.getByPlaceholderText('name@company.com');
    const passwordField = screen.getAllByPlaceholderText('••••••••')[0];
    const confirmPasswordField = screen.getAllByPlaceholderText('••••••••')[1];
    const signUpButton = screen.getByText('Sign up for RhombiChess');

    expect(fullNameField).toBeVisible();
    expect(emailField).toBeVisible();
    expect(passwordField).toBeVisible();
    expect(confirmPasswordField).toBeVisible();
    expect(signUpButton).toBeVisible();
  });

  it('updates Full Name on input change', () => {
    const fullNameInput = screen.getByRole('textbox', { name: /Full Name/i });
    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });

    expect(fullNameInput.value).toBe('John Doe');
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

  it('updates Confirm Password on input change', () => {
    const confirmPasswordInput = screen.getAllByPlaceholderText('••••••••')[1];
    fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });

    expect(confirmPasswordInput.value).toBe('password');
  });

  it('allows a user to register with valid email and password', async () => {
    await fillSignUpForm({
      name: 'John Doe',
      email: 'name@company.com',
      password: 'password',
      confirmPassword: 'password',
    });
    fireEvent.click(screen.getByRole('button', { name: /Sign up for RhombiChess/i }));

    await waitFor(() => {
      expect(window.location.href).toContain('/auth/signin');
    });
  });

  it('does not allow non matching confirm password field', async () => {
    await fillSignUpForm({
      name: 'John Doe',
      email: 'name@company.com',
      password: 'password',
      confirmPassword: 'differentPassword',
    });
    await screen.findByText('Passwords do not match!');
  });

  it('does not allow empty Full Name field', async () => {
    await fillSignUpForm({
      name: '',
      email: 'name@company.com',
      password: 'password',
      confirmPassword: 'password',
    });
    expect(screen.getByLabelText('Full Name').validity.valid).toBe(false);
    expect(screen.getByLabelText('Full Name').validity.valueMissing).toBe(true);
  });

  it('does not allow empty or malformed Email field', async () => {
    await fillSignUpForm({
      name: 'John Doe',
      email: '',
      password: 'password',
      confirmPassword: 'password',
    });
    expect(screen.getByLabelText('Email').validity.valid).toBe(false);
    expect(screen.getByLabelText('Email').validity.valueMissing).toBe(true);

    await fillSignUpForm({
      name: 'John Doe',
      email: 'name',
      password: 'password',
      confirmPassword: 'password',
    });
    expect(screen.getByLabelText('Email').validity.valid).toBe(false);

    await fillSignUpForm({
      name: 'John Doe',
      email: 'name@',
      password: 'password',
      confirmPassword: 'password',
    });
    expect(screen.getByLabelText('Email').validity.valid).toBe(false);
  });

  it('does not allow empty or malformed Password field', async () => {
    await fillSignUpForm({
      name: 'John Doe',
      email: 'name@company.com',
      password: '',
      confirmPassword: 'password',
    });
    expect(screen.getByLabelText('Password').validity.valid).toBe(false);
    expect(screen.getByLabelText('Password').validity.valueMissing).toBe(true);
  });
});
