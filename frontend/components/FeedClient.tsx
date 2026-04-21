"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProjectCard from "./ProjectCard";
import { Post } from "@/types/Post";
import SearchBar from "./SearchBar";
import { API_ENTRYPOINT } from "@/constants/constants";
import { Loader, Transition } from "@mantine/core";
import { ObjectId } from "bson";
import { getCookie } from "cookies-next/client";
import ScrollToTopButton from "./ScrollToTopButton";

const PAGE_SIZE = 20;

type Props = {
  disableSearch?: boolean;
  bagMode?: boolean;
  displayUser: string | null;
};

export default function FeedClient({ disableSearch, bagMode, displayUser }: Props) {
  const isFetchingRef = useRef(false);
  const [items, setItems] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const isAnimatingRef = useRef(false);
  const searchParamsRef = useRef<URLSearchParams | null>(null);
  const searchOffsetRef = useRef(0);
  const offsetRef = useRef(0);
  const isSearching = useRef(false);

  // Sentinel ref for IntersectionObserver. Replacement for infinite scroll component
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const buildFetchUrl = useCallback((offsetOverride?: number): string | null => {
    const offset = offsetOverride ?? offsetRef.current;
    if (isSearching.current && searchParamsRef.current) {
      const params = new URLSearchParams(searchParamsRef.current);
      params.set("limit", String(PAGE_SIZE));
      params.set("offset", String(searchOffsetRef.current));
      return `${API_ENTRYPOINT}/posts/search?${params.toString()}`;
    }
    if (bagMode) {
      const token = getCookie("token");
      if (!token) return null;
      return `${API_ENTRYPOINT}/my-projects/liked?limit=${PAGE_SIZE}&offset=${offset}`;
    }
    if (displayUser) {
      return `${API_ENTRYPOINT}/posts/by-user/${displayUser}?limit=${PAGE_SIZE}&offset=${offset}`;
    }
    const username = getCookie("username");
    if (!username) return null;
    return `${API_ENTRYPOINT}/posts/for-you/${username}?limit=${PAGE_SIZE}&offset=${offset}`;
  }, [disableSearch, displayUser, bagMode]);

  const buildHeaders = useCallback((): HeadersInit => {
    if (disableSearch) {
      const token = getCookie("token");
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

  const handleUnlike = useCallback((postId: string) => {
    setExitingIds((prev) => new Set(prev).add(postId));
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item._id !== postId));
      setExitingIds((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }, 500);
  }, []);

  const fetchFirstPage = useCallback(async () => {
    const url = buildFetchUrl(0);
    if (!url) return;
    const res = await fetch(url, { headers: buildHeaders() });
    const postsData = await res.json();
    const posts: Post[] = postsData.map((post: any) => ({
      ...post,
      datePosted: new ObjectId(post._id).getTimestamp(),
    }));
    setItems(posts);
    offsetRef.current = posts.length;
    setHasMore(posts.length === PAGE_SIZE);
    isAnimatingRef.current = true;
    setIsVisible(false);
    setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => { isAnimatingRef.current = false; }, 800);
    }, 50);
  }, [buildFetchUrl, buildHeaders]);

  const fetchMoreData = useCallback(async () => {
    if (isFetchingRef.current || isAnimatingRef.current) return;
    isFetchingRef.current = true;
    setIsFetching(true);
    try {
      const url = buildFetchUrl();
      if (!url) { setHasMore(false); return; }
      const res = await fetch(url, { headers: buildHeaders() });
      const postsData = await res.json();
      const nextPosts: Post[] = postsData.map((post: any) => ({
        ...post,
        datePosted: new ObjectId(post._id).getTimestamp(),
      }));
      if (nextPosts.length === 0) { setHasMore(false); return; }
      setItems((prev) => [...prev, ...nextPosts]);
      advanceOffset(nextPosts.length);
      if (nextPosts.length < PAGE_SIZE) setHasMore(false);
    } catch (err) {
      console.error("Failed to fetch more posts:", err);
    } finally {
      isFetchingRef.current = false;
      setIsFetching(false);
    }
  }, [buildFetchUrl, advanceOffset, buildHeaders]);

  // IntersectionObserver replaces react-infinite-scroll-component
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreData();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, fetchMoreData]); // re-subscribe when hasMore or fetchMoreData changes

  const handleSearch = useCallback((params: URLSearchParams | null) => {
    if (params === null) {
      setIsVisible(false);
      searchParamsRef.current = null;
      isSearching.current = false;
      setTimeout(() => {
        setItems([]);
        setHasMore(false);
        offsetRef.current = PAGE_SIZE;
        searchOffsetRef.current = 0;
        fetchFirstPage();
      }, 500);
      return;
    }
    setIsVisible(false);
    isSearching.current = true;
    searchParamsRef.current = params;
    searchOffsetRef.current = 0;
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
      isAnimatingRef.current = true;
      setTimeout(() => {
        setIsVisible(true);
        setTimeout(() => { isAnimatingRef.current = false; }, 800);
      }, 50);
    }, 500);
  }, [fetchFirstPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchFirstPage();
  }, []);

  return (
    <>
      {!disableSearch && <SearchBar onSearch={handleSearch} />}

      {items.map((item, index) => (
        <Transition
          key={item._id}
          mounted={isVisible && !exitingIds.has(item._id)}
          transition="pop"
          duration={500}
          timingFunction="ease"
          enterDelay={index * 50}
        >
          {(styles) => (
            <ProjectCard
              style={styles}
              key={item._id}
              id={item._id}
              title={item.title}
              body={item.body}
              author={item.author_username}
              tags={item.array_tags}
              likes={item.likes}
              datePosted={item.datePosted}
              onUnlike={disableSearch ? handleUnlike : undefined}
            />
          )}
        </Transition>
      ))}

      {/* Sentinel triggers fetch when it scrolls into view */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {isFetching && <Loader type="dots" />}

      <ScrollToTopButton />
    </>
  );
}