"use client";

import { designTokens } from "@/app/GlobalTheme";
import { API_ENTRYPOINT } from "@/constants/constants";
import { Button, Flex, Text } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { getCookie } from "cookies-next/client";
import { useEffect, useState } from "react";

type Props = {
  postId?: string;
  commentId?: string;
  likes: number;
  likedBy: string[];
  onUnlike?: (id: string) => void;
};

// Likes a post by id
async function likePostById(id: string) {
  const response = await fetch(API_ENTRYPOINT + `/posts/likes/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    body: JSON.stringify({
      username: getCookie("username"),
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    const error: string = data.error;
    throw new Error(`Error occurred when liking a post: ${error}`);
  }
  return data; // return the post
}

// Likes a comment by id
async function likeCommentById(id: string) {
  const response = await fetch(API_ENTRYPOINT + `/comments/likes/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    body: JSON.stringify({
      username: getCookie("username"),
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    const error: string = data.error;
    throw new Error(`Error occurred when liking a comment: ${error}`);
  }
  return data; // return the comment
}

export default function LikeButton({
  postId,
  commentId,
  likes,
  likedBy,
  onUnlike
}: Props) {
  const [likeCount, setLikeCount] = useState(likes);
  const [clicked, setClicked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Use initial like value
  useEffect(() => {
    const username = getCookie("username")
    setIsLoggedIn(username != undefined);
    if (username && likedBy.includes(username)) {
      setClicked(true);
    }
  }, [likedBy]);

  return (
    <Flex direction={"column"} gap={3} align={"center"}>
      <Button
        disabled={!isLoggedIn} // disable when not logged in
        title={
          // tooltip
          getCookie("username") != undefined
            ? "Like"
            : postId
              ? "Log in to like this post!"
              : "Log in to like this comment!"
        }
        size="md"
        radius="md"
        style={{ width: 40, height: 36, padding: 0 }}
        justify="center"
        color={designTokens.colors.buttonPrimary}
        onClick={async () => {
          setClicked(!clicked)
          // Immediate feedback client side
          setLikeCount((prev) => (clicked ? prev - 1 : prev + 1));
          if (postId) {
            try {
              if (clicked) onUnlike?.(postId);
              await likePostById(postId);
            } catch (e) {
              console.error(e);
              return;
            }
          } else if (commentId) {
            try {
              await likeCommentById(commentId);
            } catch (e) {
              console.error(e);
              return;
            }
          } else {
            return;
          }
          // Todo: Add functoin here to update like count on post/comment
        }}
      >
        {clicked === false ? (
          <>
            <IconHeart style={{ verticalAlign: "center", marginRight: 0 }} />
          </>
        ) : (
          <>
            <IconHeartFilled
              style={{ verticalAlign: "center", marginRight: 0 }}
            />
          </>
        )}
      </Button>
      <Text size="xs" c={designTokens.colors.textMuted}>
        {/* Format 1000 to 1k, 10000 to 1M, etc */}
        {new Intl.NumberFormat("en", {
          notation: "compact",
          compactDisplay: "short",
        }).format(likeCount)}
      </Text>
    </Flex>
  );
}
