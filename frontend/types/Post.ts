export type Post = {
  id: string;
  title: string;
  body: string;
  author: string;
  likes: number;
  tags: string[];
  datePosted: Date;
};