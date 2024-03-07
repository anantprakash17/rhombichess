/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionProvider, useSession } from 'next-auth/react';
import PlayOnlineHome from '../components/PlayOnlineHome';

global.fetch = jest.fn();

describe('PlayOnlineHome Component', () => {

  jest.mock('next-auth/react', () => ({
    useSession: jest.fn(),
  }));

  beforeEach(() => {
    delete window.location;
    window.location = { href: '', assign: jest.fn(), replace: jest.fn() };

    render(
      <SessionProvider session={{}}>
        <PlayOnlineHome />
      </SessionProvider>,
    );
  });

  //CreateGame specific tests
  it('create game section renders without crashing', () => {
    const createGameHeader = screen.getByText(/Create a New Game/i);

    const randomOption = screen.getByLabelText('Random');
    const blackOption = screen.getByLabelText('Black');
    const whiteOption = screen.getByLabelText('White');

    const passwordField = screen.getByPlaceholderText('••••••••');

    expect(createGameHeader).toBeVisible();
    expect(randomOption).toBeVisible();
    expect(blackOption).toBeVisible();
    expect(whiteOption).toBeVisible();
    expect(passwordField).toBeVisible();
  });

  it('toggles password visibility', () => {
    const passwordField = screen.getByPlaceholderText('••••••••');
    const toggleButton = screen.getByRole('button', { name: /Show password/i });

    expect(passwordField).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);

    expect(passwordField).toHaveAttribute('type', 'text');
  });

  //JoinGame specific tests
  it('join game section renders without crashing', () => {
    const joinGameHeader = screen.getByText(/Join an Existing Game/i);

    const gameCodeField = screen.getByRole('textbox', { name: /Game Code/i });

    expect(joinGameHeader).toBeVisible();
    expect(gameCodeField).toBeVisible();
  });

  it('updates game code on input change', () => {
    const gameCodeInput = screen.getByRole('textbox', { name: /Game Code/i });
    fireEvent.change(gameCodeInput, { target: { value: '4ZP6A' } });

    expect(gameCodeInput.value).toBe('4ZP6A');
  });
});
