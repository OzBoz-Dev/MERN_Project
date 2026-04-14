import { API_SERVER_ENTRYPOINT } from "@/constants/constants";
import { ObjectId } from "bson";
import { Post } from "@/types/Post";
import ProjectPageClient from "@/components/ProjectPageClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

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

export default async function ProjectPage({ params }: PageProps) {
  // Get the post id from props
  const { id } = await params;
  let postJson;
  let post: Post | null = null;

  // Fetch and format the post by id
  try {
    postJson = await fetchPostById(id);
    post = {
      id: postJson._id,
      title: postJson.title,
      body: postJson.body,
      attachments: postJson.attachments,
      likes: postJson.likes,
      author_username: postJson.author_username,
      array_tags_id: postJson.array_tags_id,
      datePosted: new ObjectId(postJson._id).getTimestamp(),
    };
  } catch (e) {
    console.error(e);
  }

  return <ProjectPageClient post={post} />;
}
