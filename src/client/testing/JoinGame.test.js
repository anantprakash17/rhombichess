/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import JoinGame from '../components/JoinGame';

jest.mock('next-auth/react');

global.fetch = jest.fn();

describe('JoinGame Component', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { href: '', assign: jest.fn(), replace: jest.fn() };

    fetch.mockClear();

    useSession.mockReturnValue({ data: { user: { name: 'Test User' } }, status: 'authenticated' });
    render(<JoinGame />);
  });

  it('does not navigate on join game with empty game code', () => {
    const joinGameButton = screen.getByRole('button', { name: /Join Game/i });
    fireEvent.click(joinGameButton);

    expect(window.location.href).toBe('');
  });

  it('navigates on join game with valid game code for game without a password', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ game_id: '4ZP6A' }), 
    }));

    const gameCodeInput = screen.getByRole('textbox', { name: /Game Code/i });
    fireEvent.change(gameCodeInput, { target: { value: '4ZP6A' } });

    const joinGameButton = screen.getByRole('button', { name: /Join Game/i });
    fireEvent.click(joinGameButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenNthCalledWith(1, expect.stringContaining('/api/game/4ZP6A'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      expect(fetch).toHaveBeenNthCalledWith(2, expect.stringContaining('/api/join_game/4ZP6A'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { name: 'Test User' },
        })
      });
    });

    await waitFor(() => {
      expect(window.location.href).toBe('/game/4ZP6A');
    });
  });

  it('displays the password field for a game with a password', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ password: 'password' }), 
    }));

    const gameCodeInput = screen.getByRole('textbox', { name: /Game Code/i });
    fireEvent.change(gameCodeInput, { target: { value: '4ZP6A' } });

    const joinGameButton = screen.getByRole('button', { name: /Join Game/i });
    fireEvent.click(joinGameButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/game/4ZP6A'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    await waitFor(() => {
      const requiresPasswordError = screen.getByText(/This game requires a password./i);
      const gamePasswordField = screen.getByRole('textbox', { name: /Game Password/i });

      expect(gamePasswordField).toBeVisible();
      expect(requiresPasswordError).toBeVisible();
    });
  });

  it('navigates on join game with valid game code and game password', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ game_id: '4ZP6A', password: 'password' }), 
    }));

    const gameCodeField = screen.getByRole('textbox', { name: /Game Code/i });
    fireEvent.change(gameCodeField, { target: { value: '4ZP6A' } });

    const joinGameButton = screen.getByRole('button', { name: /Join Game/i });
    fireEvent.click(joinGameButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenNthCalledWith(1, expect.stringContaining('/api/game/4ZP6A'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    await waitFor(() => { screen.getByPlaceholderText('••••••••'); });
    const passwordField = screen.getByPlaceholderText('••••••••');
    fireEvent.change(passwordField, { target: { value: 'password' } });

    fireEvent.click(joinGameButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenNthCalledWith(2, expect.stringContaining('/api/game/4ZP6A'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      expect(fetch).toHaveBeenNthCalledWith(3, expect.stringContaining('/api/join_game/4ZP6A'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { name: 'Test User' },
          password: 'password',
        })
      });
    });

    await waitFor(() => {
      expect(window.location.href).toContain('/game/4ZP6A');
    });
  });

  it('navigates on join game with valid game code and incorrect game password', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ error_message: 'Game not found' }),
    }));

    const gameCodeField = screen.getByRole('textbox', { name: /Game Code/i });
    fireEvent.change(gameCodeField, { target: { value: '4ZP6' } });

    const joinGameButton = screen.getByRole('button', { name: /Join Game/i });
    fireEvent.click(joinGameButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/game/4ZP6'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    await screen.findByText('Game not found');
  });

  it('navigates on join game with valid game code and incorrect game password', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ game_id: '4ZP6A', password: 'password' }),
    }));

    const gameCodeField = screen.getByRole('textbox', { name: /Game Code/i });
    fireEvent.change(gameCodeField, { target: { value: '4ZP6A' } });

    const joinGameButton = screen.getByRole('button', { name: /Join Game/i });
    fireEvent.click(joinGameButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenNthCalledWith(1, expect.stringContaining('/api/game/4ZP6A'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    await waitFor(() => { screen.getByPlaceholderText('••••••••'); });
    const passwordField = screen.getByPlaceholderText('••••••••');
    fireEvent.change(passwordField, { target: { value: 'differentPassword' } });

    fireEvent.click(joinGameButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenNthCalledWith(2, expect.stringContaining('/api/game/4ZP6A'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    await screen.findByText('Incorrect code or password. Please try again.');
  });
});
