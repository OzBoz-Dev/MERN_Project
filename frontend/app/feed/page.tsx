import CreateProjectButton from "@/components/CreateProjectButton";
import FeedClient from "@/components/FeedClient";
import SearchBar from "@/components/SearchBar";
import { API_SERVER_ENTRYPOINT } from "@/constants/constants";
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
  const result = await fetch(API_SERVER_ENTRYPOINT + '/posts/', {cache: "no-store"});
  const initialPosts = await result.json();

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
