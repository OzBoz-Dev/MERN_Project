import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeedClient from '../components/FeedClient';
import { Post } from '@/types/Post';

// Mock the child components
jest.mock('../components/ProjectCard', () => {
  return function MockProjectCard({ title, author }: { title: string; author: string }) {
    return <div data-testid={`post-card-${title}`}>{title} by {author}</div>;
  };
});

jest.mock('../components/SearchBar', () => {
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
    _id: '1',
    title: 'Example Post',
    body: 'This is an example post body',
    attachments: '',
    likes: ['user1', 'user2'],
    array_tags: ['react', 'testing'],
    author_username: 'John Doe',
    datePosted: new Date('2026-04-11'),
  };

  it('should render an example post from initialPosts', () => {
    render(<FeedClient initialPosts={[mockPost]} />);

    // Assert the post is rendered
    expect(screen.getByTestId('post-card-Example Post')).toBeInTheDocument();
    expect(screen.getByText(/Example Post by John Doe/)).toBeInTheDocument();
  });
});
