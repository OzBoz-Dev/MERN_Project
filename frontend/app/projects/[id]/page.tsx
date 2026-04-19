import { API_SERVER_ENTRYPOINT } from "@/constants/constants";
import { ObjectId } from "bson";
import { Post } from "@/types/Post";
import ProjectPageClient from "@/components/ProjectPageClient";
import { PostComment } from "@/types/PostComment";
import { Metadata } from "next";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params } : PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const postJson = await fetchPostById(id);
    return { 
      title: postJson.title,
      description: `Read ${postJson.author_username}'s post on ChipIn!`
    };
  } 
  catch {
    return { title: "Post not found" };
  }
}

// Fetch post by id
async function fetchPostById(id: string) {
  console.log(`ID to fetch: ${id}`);
  const response = await fetch(API_SERVER_ENTRYPOINT + `/posts/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    const error: string = data.error;
    throw new Error(`Error occurred when fetching a post: ${error}`);
  }
  return data; // return the post
}

// Get all comments for this post
async function fetchComments(id: string) {
  console.log(`Post ID to fetch comments for: ${id}`);
  const response = await fetch(API_SERVER_ENTRYPOINT + `/comments/post/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    const error: string = data.error;
    throw new Error(`Error occurred when fetching comments: ${error}`);
  }
  return data; // return the comments
}

export default async function ProjectPage({ params }: PageProps) {
  // Get the post id from props
  const { id } = await params;
  let postJson;
  let post: Post | null = null;

  // Fetch and format the post by id
  try {
    postJson = await fetchPostById(id);
    post = {
      _id: postJson._id,
      title: postJson.title,
      body: postJson.body,
      attachments: postJson.attachments,
      likes: postJson.likes,
      author_username: postJson.author_username,
      array_tags: postJson.array_tags,
      datePosted: new ObjectId(postJson._id).getTimestamp(),
    };
  } catch (e) {
    console.error(e);
  }

  let commentsJson;
  let comments: PostComment[] = [];
  try {
    commentsJson = await fetchComments(id);
    comments = commentsJson.map((comment: any) => ({
      id: comment._id,
      author_username: comment.author_username,
      body: comment.body,
      likes: comment.likes,
      post_id_belong: comment.post_id_belong,
    }));
  } catch (e) {
    console.error(e);
  }

  console.log(`Comments JSON: ${commentsJson}`);
  console.log(`Comments: ${comments}`);

  return <ProjectPageClient post={post} comments={comments} />;
}
