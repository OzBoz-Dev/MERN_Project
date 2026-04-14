"use client";

import { Card, Text, Group } from "@mantine/core";
import { designTokens } from "@/app/GlobalTheme";
import { formatText } from "@/lib/formatText";
import LikeButton from "./LikeButton";
import { getCookie } from "cookies-next/client";

type Props = {
  author: string;
  datePosted: Date;
  body: string;
  commentId: string;
  likes: string[];
};

export default function CommentCard({
  author,
  datePosted,
  body,
  commentId,
  likes,
}: Props) {
  const formattedDate = datePosted.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Card
      style={{
        borderLeft: `8px solid ${designTokens.colors.cardBorder}`,
        borderRadius: designTokens.borderRadius.card,
        padding: designTokens.spacing.cardPadding,
        boxShadow: designTokens.colors.cardShadow,
        background: designTokens.colors.glassyBackground,
        textAlign: "left",
      }}
    >
      <Text fw={700}>{author}</Text>
      <Text size="xs" c={designTokens.colors.textMuted} mb="sm">
        {formattedDate}
      </Text>
      <Text mb="md" style={{ whiteSpace: "pre-wrap" }}>
        {/* Format text for bold or italics */}
        {formatText(body)}
      </Text>
      <Group justify="flex-end">
        <LikeButton
          commentId={commentId}
          likes={likes.length}
          initiallyLiked={likes.includes(getCookie("username")!)}
        />
      </Group>
    </Card>
  );
}
