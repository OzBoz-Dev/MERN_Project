import CreateProjectButton from "@/components/CreateProjectButton";
import FeedClient from "@/components/FeedClient";
import SearchBar from "@/components/SearchBar";
import { Post } from "@/types/Post";
import { Flex } from "@mantine/core";
import { ObjectId } from "bson";
import { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: "Home",
};

export default async function Feed() {
  // Fetch posts here via endpoint
  // Todo: Fetch initial posts
  // Mock data for now (just one initial post)
  const mockPost: Post = {
    id: "69b07c3d754d16127d7fc4e7",
    title: "title",
    body: "the quick brown fox jumped over the lazy dog",
    attachments: "",
    likes: ["del0m_"],
    author_username: "del0m_",
    array_tags_id: ["ML dev", "devops"],
    datePosted: new ObjectId("69b07c3d754d16127d7fc4e7").getTimestamp(), // Extract timestamp
  };
  const searchBar = <SearchBar onResults={() => void}/>;
  // 20 of mockPost
  const initialPosts: Post[] = Array.from({ length: 20 }, () => ({
    ...mockPost,
  }));
  return (
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
  );
}
