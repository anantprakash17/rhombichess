/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import '@testing-library/jest-dom';
import {
  render, fireEvent, screen, waitFor,
} from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import PlayOnlineHome from '../components/PlayOnlineHome';

describe('PlayOnlineHome Component', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { href: '', assign: jest.fn(), replace: jest.fn() };

    render(
      <SessionProvider session={{}}>
        <PlayOnlineHome />
      </SessionProvider>,
    );

    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ game_id: '4ZP6A' }),
    }));
  });

  it('renders without crashing', () => {
    const createGameHeader = screen.getByText(/Create a New Game/i);
    const joinGameHeader = screen.getByText(/Join an Existing Game/i);

    const passwordField = screen.getByPlaceholderText('••••••••');
    const gameCodeField = screen.getByRole('textbox', { name: /Game Code/i });

    expect(createGameHeader).toBeVisible();
    expect(joinGameHeader).toBeVisible();
    expect(passwordField).toBeVisible();
    expect(gameCodeField).toBeVisible();
  });

  it('updates game code on input change', () => {
    const gameCodeInput = screen.getByRole('textbox', { name: /Game Code/i });
    fireEvent.change(gameCodeInput, { target: { value: '4ZP6A' } });

    expect(gameCodeInput.value).toBe('4ZP6A');
  });

  it('does not navigate on join game with empty game code', () => {
    const joinGameButton = screen.getByRole('button', { name: /Join Game/i });
    fireEvent.click(joinGameButton);

    expect(window.location.href).toBe('');
  });

  it('navigates on join game with valid game code', async () => {
    const gameCodeInput = screen.getByRole('textbox', { name: /Game Code/i });
    fireEvent.change(gameCodeInput, { target: { value: '4ZP6A' } });

    const joinGameButton = screen.getByRole('button', { name: /Join Game/i });
    fireEvent.click(joinGameButton);

    await waitFor(() => {
      expect(window.location.href).toBe('/game/4ZP6A');
    });
  });
});
