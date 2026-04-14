import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import FeedClient from '../components/FeedClient';
import { Post } from '@/types/Post';

// Mock fetch globally
global.fetch = jest.fn();

// Mock the child components
jest.mock('../components/ProjectCard', () => {
  return function MockProjectCard({ title, author }: { title: string; author: string }) {
    return <div data-testid={`post-card-${title}`}>{title} by {author}</div>;
  };
});

jest.mock('react-infinite-scroll-component', () => {
  return function MockInfiniteScroll({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  };
});

jest.mock('../constants/constants', () => ({
  API_ENTRYPOINT: 'http://localhost:5001',
}));

jest.mock('../components/AdvancedSettings', () => {
  return function MockAdvancedSettings() {
    return <div>Advanced Settings</div>;
  };
});

describe('FeedClient - Search Functionality', () => {
  const mockApiPost = {
    _id: '1',
    title: 'lol this is funny',
    body: 'This post contains lol in the body',
    author: 'Jane Smith',
    likes: ['user1', 'user2'],
    tags: ['humor', 'funny'],
    attachments: '',
    datePosted: new Date('2026-04-11').toISOString(),
  };

  const initialPosts: Post[] = [
    {
      id: '0',
      title: 'Initial Post',
      body: 'Some initial content',
      attachments: '',
      likes: ['user3'],
      array_tags_id: ['general'],
      author_username: 'John Doe',
      datePosted: new Date('2026-04-10'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should search for "lol" and display matching post', async () => {
    const user = userEvent.setup();

    // Mock the API responses for title and body search
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/posts/title?q=lol')) {
        return Promise.resolve({
          json: () => Promise.resolve([mockApiPost]),
        });
      }
      if (url.includes('/posts/body?q=lol')) {
        return Promise.resolve({
          json: () => Promise.resolve([]),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(
      <MantineProvider>
        <FeedClient initialPosts={initialPosts} />
      </MantineProvider>
    );

    // Get the search input
    const searchInput = screen.getByPlaceholderText('ML, DevOps');
    
    // Type "lol" into the search input
    await user.type(searchInput, 'lol');

    // Press Enter to trigger the search
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    // Wait for the post to appear
    await waitFor(() => {
      expect(screen.getByTestId('post-card-lol this is funny')).toBeInTheDocument();
    });

    // Verify the post content is displayed
    expect(screen.getByText(/lol this is funny by Jane Smith/)).toBeInTheDocument();

    // Verify API was called correctly
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/posts/title?q=lol')
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/posts/body?q=lol')
    );
  });
});
