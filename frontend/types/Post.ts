export type Post = {
  id: string;
  title: string;
  body: string;
  attachments: string;
  likes: string[];
  array_tags_id: string[];
  author_username: string;
  datePosted: Date;
};