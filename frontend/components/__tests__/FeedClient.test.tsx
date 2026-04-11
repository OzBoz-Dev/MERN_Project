import { render, screen } from '@testing-library/react';
import FeedClient from '../FeedClient';
import { Post } from '@/types/Post';

// Mock the child components
jest.mock('../ProjectCard', () => {
  return function MockProjectCard({ title, author }: { title: string; author: string }) {
    return <div data-testid={`post-card-${title}`}>{title} by {author}</div>;
  };
});

jest.mock('../SearchBar', () => {
  return function MockSearchBar() {
    return <div>Search Bar</div>;
  };
});

jest.mock('react-infinite-scroll-component', () => {
  return function MockInfiniteScroll({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  };
});

describe('FeedClient', () => {
  const mockPost: Post = {
    id: '1',
    title: 'Example Post',
    body: 'This is an example post body',
    author: 'John Doe',
    likes: 42,
    tags: ['react', 'testing'],
    datePosted: new Date('2026-04-11'),
  };

  it('should render an example post from initialPosts', () => {
    render(<FeedClient initialPosts={[mockPost]} />);

    // Assert the post is rendered
    expect(screen.getByTestId('post-card-Example Post')).toBeInTheDocument();
    expect(screen.getByText(/Example Post by John Doe/)).toBeInTheDocument();
  });
});
