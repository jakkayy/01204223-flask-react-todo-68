import { vi } from 'vitest';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { render, screen } from '@testing-library/react'
import { useAuth } from '../context/AuthContext';
import TodoList from '../TodoList.jsx';

const mockResponse = (body, ok = true) =>
  Promise.resolve({
    ok,
    json: () => Promise.resolve(body),
  });

describe('TodoList', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    useAuth.mockReturnValue({
      username: 'testuser',
      accessToken: 'fake-token',
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders correctly', async () => {
    global.fetch.mockImplementationOnce(() =>
      mockResponse([
        { id: 1, title: 'First todo', done: false, comments: [] },
        { id: 2, title: 'Second todo', done: false, comments: [
          { id: 1, message: 'First comment' },
          { id: 2, message: 'Second comment' },
        ] },
      ]),
    );

    render(<TodoList apiUrl="http://localhost:5000/api/todos/" />);

    expect(await screen.findByText('First todo')).toBeInTheDocument();
    expect(await screen.findByText('Second todo')).toBeInTheDocument();
    expect(await screen.findByText('First comment')).toBeInTheDocument();
    expect(await screen.findByText('Second comment')).toBeInTheDocument();
  });
});
