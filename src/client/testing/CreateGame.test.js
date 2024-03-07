import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateGame from '../components/CreateGame';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react');

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({ game_id: '4ZP6A' }),
}));

describe('CreateGame Component', () => {
  
  beforeEach(() => {
    delete window.location;
    window.location = { href: '', assign: jest.fn(), replace: jest.fn() };

    fetch.mockClear();
    useSession.mockReturnValue({ data: { user: { name: 'Test User' } }, status: 'authenticated' });
    render(<CreateGame />);
  });

  it('create game with no password and random color (selected by default)', async () => {
    const createGameButton = screen.getByRole('button', { name: /Create Game/i });
    fireEvent.click(createGameButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      const fetchCallArgs = fetch.mock.calls[0][1];
      const requestBody = JSON.parse(fetchCallArgs.body);
      expect(requestBody.color).toMatch(/^(white|black)$/);
    });

    await waitFor(() => {
      expect(window.location.href).toBe('/game/4ZP6A');
    });
  });

  it('create game with password and selected color white', async () => {
    const whiteOption = screen.getByLabelText('White');
    fireEvent.click(whiteOption);
    const passwordField = screen.getByPlaceholderText('••••••••');
    fireEvent.change(passwordField, { target: { value: 'password' } });
    const createGameButton = screen.getByRole('button', { name: /Create Game/i });
    fireEvent.click(createGameButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: { name: 'Test User' },
            password: 'password',
            color: 'white',
          }),
        })
      );
    });

    await waitFor(() => {
      expect(window.location.href).toBe('/game/4ZP6A');
    });
  });

  it('create game with password and selected color black', async () => {
    const whiteOption = screen.getByLabelText('Black');
    fireEvent.click(whiteOption);
    const passwordField = screen.getByPlaceholderText('••••••••');
    fireEvent.change(passwordField, { target: { value: 'password' } });
    const createGameButton = screen.getByRole('button', { name: /Create Game/i });
    fireEvent.click(createGameButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: { name: 'Test User' },
            password: 'password',
            color: 'black',
          }),
        })
      );
    });

    await waitFor(() => {
      expect(window.location.href).toBe('/game/4ZP6A');
    });
  });
});