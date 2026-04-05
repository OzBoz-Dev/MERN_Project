"use client"

import CommentCard from "@/components/CommentCard";
import ProjectCard, { defaultProps } from "@/components/ProjectCard";
import { useCallback, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  const [items, setItems] = useState(Array.from({ length: defaultProps.dataLength }));
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = useCallback(() => {
    // Would need to fetch more items from api
    // Example: await fetch('api/posts?page=...')

    // put the new items in the existing list
    setItems(prev => [...prev, ...Array.from({ length: defaultProps.dataLength })])
  }, [])
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1000px",
        padding: "0 16px",
        margin: "0 auto",
        alignContent: "center"
      }}
    >
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
          id="69b07c3d754d16127d7fc4e7"
          postTitle="title"
          user="del0m_"
          postTags={["ML developer", "DevOps"]}
          description="the quick brown fox jumped over the lazy dog"
          timeAgo="2 hours ago"
        />
        ))}
      </InfiniteScroll>
    </div>
  );
}
