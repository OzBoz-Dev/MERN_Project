"use client";

import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ProjectCard from "./ProjectCard";
import { Post } from "@/types/Post";
import SearchBar from "./SearchBar";
import { API_ENTRYPOINT } from "@/constants/constants";
import { Loader, Transition } from "@mantine/core";
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
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());
  const [mountedIds, setMountedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    items.forEach((item, index) => {
      setTimeout(() => {
        setMountedIds(prev => new Set(prev).add(item._id));
      }, index * 100); // 100ms delay between each card appearance
    });
  }, []);

  // Handle unlike when on the "My Bag" page
  const handleUnlike = useCallback((postId: string) => {
    setExitingIds(prev => new Set(prev).add(postId));
    setTimeout(() => {
      setItems(prev => prev.filter(item => item._id !== postId));
      setExitingIds(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }, 500); // match transition duration
    // setItems(prev => prev.filter(item => item._id !== postId));
  }, []);

  // Make handleResults stable
  const handleResults = useCallback((posts: Post[]) => {
    const normalized = posts.map((post: any) => ({
      ...post,
      datePosted: new ObjectId(post._id).getTimestamp(),
    }));
    setItems(normalized);
    setTimeout(() => {
      setMountedIds(new Set(normalized.map(p => p._id)));
    }, 10);
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
        {items.map((item) => (
        <Transition
          key={item._id}
          mounted={mountedIds.has(item._id) && !exitingIds.has(item._id)}
          transition="pop"
          duration={500}
          timingFunction="ease"
        >
          {(styles) => (<ProjectCard
            style={styles}
            key={item._id}
            id={item._id}
            title={item.title}
            body={item.body}
            author={item.author_username}
            tags={item.array_tags}
            likes={item.likes}
            datePosted={item.datePosted}
            onUnlike={disableSearch ? handleUnlike : undefined} // On bag page, remove when unliked
          />
          )}
        </Transition>
        ))}
      </InfiniteScroll>
    </>
  );
}
