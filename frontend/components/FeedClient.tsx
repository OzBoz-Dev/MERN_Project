"use client";

import { useCallback, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ProjectCard from "./ProjectCard";
import { Post } from "@/types/Post";
import SearchBar from "./SearchBar";

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
};

export default function FeedClient({ initialPosts }: Props) {
  const [items, setItems] = useState<Post[]>(initialPosts || []);
  const [hasMore, setHasMore] = useState(true);

  // Make handleResults stable
  const handleResults = useCallback((posts: Post[]) => {
    setItems(posts);
  }, [])
  // Builds off of initialPosts
  const fetchMoreData = useCallback(() => {
    if(!initialPosts || initialPosts.length === 0) return
    // Would need to fetch more items from api
    // Example: await fetch('api/posts?page=...')

    // put the new items in the existing list
    setItems((prev) => [
      ...prev,
      ...Array.from({ length: defaultProps.dataLength }, () => initialPosts[0]),
    ]);
  }, [initialPosts]);
  return (
    <>
      <SearchBar onResults={handleResults}/>
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading!</h4>}
        endMessage={<h4>Ended</h4>}
      >
        {items.map((item, index) => (
          <ProjectCard
            key={index}
            id={item.id}
            title={item.title}
            body={item.body}
            author={item.author_username}
            tags={item.array_tags_id}
            likes={item.likes.length}
            datePosted={item.datePosted}
          />
        ))}
      </InfiniteScroll>
    </>
    );

    <InfiniteScroll
      dataLength={items.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4>Loading!</h4>}
      endMessage={<h4>Ended</h4>}
    >
      {items.map((item, index) => (
        <ProjectCard
          key={index}
          id={item.id}
          title={item.title}
          body={item.body}
          author={item.author_username}
          tags={item.array_tags_id}
          likes={item.likes.length}
          datePosted={item.datePosted}
        />
      ))}
    </InfiniteScroll>
  );
}
