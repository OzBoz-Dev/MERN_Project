"use client";

import { designTokens } from "@/app/GlobalTheme";
import { Container, Stack, Group, Title, Divider, Text } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import TimeAgo from "react-timeago";
import BookmarkButton from "./BookmarkButton";
import CommentsSection from "./CommentsSection";
import LikeButton from "./LikeButton";
import MessageButton from "./MessageButton";
import TagHolder from "./TagHolder";
import { Post } from "@/types/Post";
import { notFound } from "next/navigation";

type Props = {
  post: Post | null;
  comments: PostComment[];
};

export default function ProjectPageClient({ post, comments }: Props) {
  return post == null ? (
    notFound()
  ) : (
    <Container
      size="md"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "32px",
      }}
    >
      <Stack w="100%" gap="md">
        <Group justify="space-between" align="center">
          <Title order={1}>{post.title}</Title>
          <BookmarkButton />
        </Group>

        <Text size="sm" c={designTokens.colors.textMuted}>
          Posted by {post.author_username} &middot;{" "}
          {<TimeAgo date={post.datePosted} />}
        </Text>

        <Group gap="8px" align="center">
          <IconUser size="20px" />
          <Text size="sm" c={designTokens.colors.textMuted}>
            Looking for:
          </Text>
        </Group>
        {/* <TagHolder tags={post.array_tags_id} /> */}

        <Text c="#555" dangerouslySetInnerHTML={{ __html: post.body }} />

        <Group justify="flex-end" align="flex-start" gap="16px">
          <MessageButton />
          <LikeButton likes={post.likes.length} />
        </Group>
      </Stack>
      <Divider mt="lg" mb="xl" w={"100%"} />
      <CommentsSection postId={post.id} initialComments={comments} />
    </Container>
  );
}
