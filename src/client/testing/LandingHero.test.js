/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LandingHero from '../components/LandingHero';

describe('LandingHero Component', () => {
  beforeEach(() => {
    render(<LandingHero />);
  });

  it('renders correctly', () => {
    expect(screen.getByRole('heading', { name: /All-New Strategic Online/i })).toBeVisible();
    expect(screen.getByRole('link', { name: /Play Online/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /Play Local/i })).toBeVisible();
  });

  it('navigates to rules page on link click', () => {
    const rulesLink = screen.getByRole('link', { name: /Check out the rules for this variant!/i });
    expect(rulesLink).toHaveAttribute('href', '/rules');
  });

  it('renders the PlayOnlineButton and PlayLocalButton components', () => {
    const onlinePlayButton = screen.getByRole('link', { name: /Play Online/i });
    const localPlayButton = screen.getByRole('button', { name: /Play Local/i });

    expect(onlinePlayButton).toBeVisible();
    expect(localPlayButton).toBeVisible();

    expect(onlinePlayButton).toHaveAttribute('href', '/play/online');
  });
});
