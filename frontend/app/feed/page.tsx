import CreateProjectButton from "@/components/CreateProjectButton";
import FeedClient from "@/components/FeedClient";
import SearchBar from "@/components/SearchBar";
import { API_SERVER_ENTRYPOINT } from "@/constants/constants";
import { Post } from "@/types/Post";
import { Flex } from "@mantine/core";
import { ObjectId } from "bson";
import { Metadata } from "next";
import { cookies } from "next/headers";

// Metadata
export const metadata: Metadata = {
  title: "Home",
};



export default async function Feed() {
  // Fetch posts here via endpoint
  const cookieStore = await cookies();
  const currentUsername = cookieStore.get('username')?.value;
  const result = await fetch(API_SERVER_ENTRYPOINT + `/posts/for-you/${currentUsername}`, {cache: "no-store"}
  );
  const postsData = await result.json();
  const initialPosts: Post[] = postsData.map((post: any) => ({
    _id: post._id,
    title: post.title,
    body: post.body,
    attachments: post.attachments,
    likes: post.likes,
    array_tags: post.array_tags,
    author_username: post.author_username,
    datePosted: new ObjectId(post._id).getTimestamp(),
  }));

  return (
    <div className="static-grid">
    <Flex
      direction={"column"}
      style={{
        width: "100%",
        maxWidth: "1000px",
        padding: "0 16px",
        margin: "0 auto",
        alignContent: "center",
      }}
    >
      {/* Use FeedClient, giving it the fetched initial posts */}
      <FeedClient initialPosts={initialPosts} />
      <Flex justify={"flex-end"}>
        <CreateProjectButton />
      </Flex>
    </Flex>
    </div>
  );
}
