import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import App from '../App.jsx'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
  });

  it('redirects to login when not authenticated', async () => {
    render(<App />);
    expect(await screen.findByRole('button', { name: 'Login' })).toBeInTheDocument();
  });
});
