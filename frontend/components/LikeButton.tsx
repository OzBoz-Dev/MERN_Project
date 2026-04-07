"use client";

import { designTokens } from "@/app/GlobalTheme";
import { Button, Flex, Text } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useState } from "react";

type Props = {
  postId?: string;
  commentId?: string;
  likes: number;
};

export default function LikeButton({ postId, commentId, likes }: Props) {
  const [likeCount, setLikeCount] = useState(likes);
  const [clicked, toggle] = useToggle([false, true]);
  return (
    <Flex direction={"column"} gap={3} align={"center"}>
      <Button
        size="md"
        radius="md"
        style={{ width: 40, height: 36, padding: 0 }}
        justify="center"
        color={designTokens.colors.buttonPrimary}
        onClick={() => {
          toggle();
          // Set the like count on the client side
          clicked === false
            ? setLikeCount(likeCount + 1)
            : setLikeCount(likeCount - 1);

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
        {likeCount}
      </Text>
    </Flex>
  );
}
