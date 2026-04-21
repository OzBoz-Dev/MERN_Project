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

  return (
    <div className="static-grid-blurry">
    <Flex
      direction={"column"}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "1000px",
        padding: "0 16px",
        margin: "0 auto",
        alignContent: "center",
        zIndex: 1,
      }}
    >
      {/* Use FeedClient, giving it the fetched initial posts */}
      <FeedClient disableSearch={false} displayUser={null} bagMode={false}/>
      <Flex justify={"flex-end"}>
        <CreateProjectButton />
      </Flex>
    </Flex>
    </div>
  );
}
