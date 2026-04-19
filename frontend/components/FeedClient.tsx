"use client";

import { useCallback, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ProjectCard from "./ProjectCard";
import { Post } from "@/types/Post";
import SearchBar from "./SearchBar";
import { API_ENTRYPOINT } from "@/constants/constants";
import { Loader } from "@mantine/core";
import { ObjectId } from "bson";

type FeedProps = {
  dataLength: number;
  hasMore: boolean;
  loader?: object; // Something to show while loading
  endMessage?: object; // When you reach the end
};

const defaultProps: FeedProps = {
  dataLength: 20,
  hasMore: true,
  endMessage: (
    <p style={{ textAlign: "center" }}>
      <b>Yay! you have seen it all</b>
    </p>
  ),
};

type Props = {
  initialPosts: Post[];
  disableSearch?: boolean;
};

export default function FeedClient({ initialPosts, disableSearch }: Props) {

  const [items, setItems] = useState<Post[]>(initialPosts || []);
  const [hasMore, setHasMore] = useState(true);

  // Make handleResults stable
  const handleResults = useCallback((posts: Post[]) => {
    const normalized = posts.map((post: any) => ({
      ...post,
      datePosted: new ObjectId(post._id).getTimestamp(),
    }));
    setItems(normalized);
  }, []);
  // Builds off of initialPosts
  const fetchMoreData = useCallback(() => {
    if (!initialPosts || initialPosts.length === 0) return;
    // Would need to fetch more items from api
    // Example: await fetch('api/posts?page=...')
    // put the new items in the existing list
    setItems((prev) => [
      ...prev,
      ...initialPosts.slice(items.length, items.length + defaultProps.dataLength),
    ]);
  }, [initialPosts]);
  return (
    <>
      {!disableSearch && <SearchBar onResults={handleResults} />}
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<></>}
        endMessage={<h4>Ended</h4>}
      >
        {items.map((item, index) => (
          <ProjectCard
            key={index}
            id={item._id}
            title={item.title}
            body={item.body}
            author={item.author_username}
            tags={item.array_tags}
            likes={item.likes}
            datePosted={item.datePosted}
          />
        ))}
      </InfiniteScroll>
    </>
  );
}
