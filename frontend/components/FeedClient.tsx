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
import ScrollToTopButton from "./ScrollToTopButton";

const PAGE_SIZE = 20;

export type Props = {
  initialPosts: Post[];
  disableSearch?: boolean;
};

export default function FeedClient({ initialPosts, disableSearch }: Props) {

  const isFetchingRef = useRef(false); // Prevent concurrent/immediate fetches
  const [items, setItems] = useState<Post[]>(initialPosts);
  const [hasMore, setHasMore] = useState(true);
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());
  const [mountedIds, setMountedIds] = useState<Set<string>>(new Set());
  const searchParamsRef = useRef<URLSearchParams | null>(null);
  const searchOffsetRef = useRef(0);

  // Use a ref to track the current offset so fetchMoreData always sees the latest value
  const offsetRef = useRef(PAGE_SIZE);
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

  const buildFetchUrl = useCallback((): string | null => {
  if (isSearching.current && searchParamsRef.current) {
    // Search mode
    const params = new URLSearchParams(searchParamsRef.current);
    params.set("limit", String(PAGE_SIZE));
    params.set("offset", String(searchOffsetRef.current));
    return `${API_ENTRYPOINT}/posts/search?${params.toString()}`;
  }

  if (disableSearch) {
    // My Bag mode
    const token = getCookie('token');
    if (!token) return null;
    return `${API_ENTRYPOINT}/my-projects/liked?limit=${PAGE_SIZE}&offset=${offsetRef.current}`;
  }

  // Feed mode
  const username = getCookie('username');
  if (!username) return null;
  return `${API_ENTRYPOINT}/posts/for-you/${username}?limit=${PAGE_SIZE}&offset=${offsetRef.current}`;
}, [disableSearch]);

const buildHeaders = useCallback((): HeadersInit => {
  if (disableSearch) {
    const token = getCookie('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {};
}, [disableSearch]);

const advanceOffset = useCallback((count: number) => {
  if (isSearching.current) {
    searchOffsetRef.current += count;
  } else {
    offsetRef.current += count;
  }
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

  const handleSearch = useCallback((params: URLSearchParams | null) => {
    // Clear search
    if (params === null) {
      searchParamsRef.current = null;
      isSearching.current = false;
      setMountedIds(new Set());

      setTimeout(() => {
        setItems(initialPosts);
        setHasMore(true);
        offsetRef.current = PAGE_SIZE;
        searchOffsetRef.current = 0;
        initialPosts.forEach((item, index) => {
          setTimeout(() => {
            setMountedIds(prev => new Set(prev).add(item._id));
          }, 100 + index * 50);
        });
      }, 500);
      return;
    }

  // New search: reset and fetch first page
  isSearching.current = true;
  searchParamsRef.current = params;
  searchOffsetRef.current = 0;
  setMountedIds(new Set()); // Fade out old stuff

  setTimeout(async () => {
    params.set("limit", String(PAGE_SIZE));
    params.set("offset", "0");

    const res = await fetch(`${API_ENTRYPOINT}/posts/search?${params.toString()}`);
    const posts = await res.json();
    const normalized: Post[] = posts.map((post: any) => ({
      ...post,
      datePosted: new ObjectId(post._id).getTimestamp(),
    }));

    setItems(normalized);
    setHasMore(normalized.length === PAGE_SIZE);
    searchOffsetRef.current = normalized.length;

    normalized.forEach((item, index) => {
      setTimeout(() => {
        setMountedIds(prev => new Set(prev).add(item._id));
      }, 100 + index * 50);
    });
  }, 500);
  }, [initialPosts]);

  // Infinite scroll behavior
  const fetchMoreData = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const url = buildFetchUrl();
      if (!url) { setHasMore(false); return; }

      const res = await fetch(
        url, {headers: buildHeaders()}
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
    advanceOffset(nextPosts.length);

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
}, [buildFetchUrl, advanceOffset]);

  return (
    <>
      {!disableSearch && <SearchBar onSearch={handleSearch}/>}
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Loader/>}
        scrollThreshold={0.9}
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
      <ScrollToTopButton/>
    </>
  );
}
