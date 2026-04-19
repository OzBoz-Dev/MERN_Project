"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ProjectCard from "./ProjectCard";
import { Post } from "@/types/Post";
import SearchBar from "./SearchBar";
import { API_ENTRYPOINT } from "@/constants/constants";
import { Divider, Loader, Transition } from "@mantine/core";
import { ObjectId } from "bson";
import { getCookie } from "cookies-next/client";

const PAGE_SIZE = 20;

type Props = {
  initialPosts: Post[];
  disableSearch?: boolean;
};

export default function FeedClient({ initialPosts, disableSearch }: Props) {

  const isFetchingRef = useRef(false); // Prevent concurrent/immediate fetches
  const [items, setItems] = useState<Post[]>(initialPosts);
  const [hasMore, setHasMore] = useState(!disableSearch);
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());
  const [mountedIds, setMountedIds] = useState<Set<string>>(new Set());

  // Use a ref to track the current offset so fetchMoreData always sees the latest value
  const offsetRef = useRef(20);
  // Track whether we're in search mode (searching overrides initialPosts pagination)
  const isSearching = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    initialPosts.forEach((item, index) => {
    setTimeout(() => {
      setMountedIds(prev => new Set(prev).add(item._id));
    }, index * 50);
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
  }, []);

  // Make handleResults stable
  const handleResults = useCallback((posts: Post[]) => {
    isSearching.current = true;
    const normalized = posts.map((post: any) => ({
      ...post,
      datePosted: new ObjectId(post._id).getTimestamp(),
    }));
    setItems(normalized);
    setHasMore(false); // No inf scroll when searching
    setMountedIds(new Set()); // Reset so animation re-triggers

    setTimeout(() => {
      setMountedIds(new Set(normalized.map(p => p._id)));
    }, 10);
  }, []);

  // Infinite scroll behavior
  const fetchMoreData = useCallback(async () => {
    if (isSearching.current) return;
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    const currentUsername = getCookie('username');
    console.log("current username: " + currentUsername)
    if (!currentUsername) {
      isFetchingRef.current = false;
      return;
    }
    
    const currentOffset = offsetRef.current;

    try {
      // Grab the next N posts
      const res = await fetch(
        `${API_ENTRYPOINT}/posts/for-you/${currentUsername}?limit=${PAGE_SIZE}&offset=${currentOffset}`
      )
      const postsData = await res.json();
      const nextPosts: Post[] = postsData.map((post: any) => ({
        ...post,
        datePosted: new ObjectId(post._id).getTimestamp(),
      }));

    if (nextPosts.length === 0) {
      setHasMore(false);
      return;
    }

    setItems((prev) => [...prev, ...nextPosts]);
    setMountedIds(prev => {
      const next = new Set(prev);
      nextPosts.forEach(p => next.add(p._id));
      return next;
    });
    offsetRef.current = currentOffset + nextPosts.length;

    if (nextPosts.length < PAGE_SIZE) {
      setHasMore(false); // Received a partial page, so we're at the end
    }
  }
  catch (err) {
    console.error("Failed to fetch more posts:", err);
  }
  finally {
    isFetchingRef.current = false;
  }
}, []);

  return (
    <>
      {!disableSearch && <SearchBar onResults={handleResults} />}
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Loader/>}
        // scrollThreshold={0.7}
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
