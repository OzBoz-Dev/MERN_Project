import { designTokens } from "@/app/GlobalTheme";
import BookmarkButton from "@/components/BookmarkButton";
import TagHolder from "@/components/TagHolder";
import MessageButton from "@/components/MessageButton";
import LikeButton from "@/components/LikeButton";
import { IconUser } from "@tabler/icons-react";
import { Container, Stack, Group, Title, Text, Divider } from "@mantine/core";
import CommentsSection from "@/components/CommentsSection";

type PageProps = {
  params: { id: string };
};

export default async function ProjectPage({ params }: PageProps) {
  const { id } = params;

  const post = {
    postTitle: "title",
    user: "del0m_",
    postTags: ["ML developer", "DevOps"],
    description: "the quick brown fox jumped over the lazy dog",
    timeAgo: "2 hours ago",
  };

  return (
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
          <Title order={1}>{post.postTitle}</Title>
          <BookmarkButton />
        </Group>

        <Text size="sm" c={designTokens.colors.textMuted}>
          Posted by {post.user} &middot; {post.timeAgo}
        </Text>

        <Group gap="8px" align="center">
          <IconUser size="20px" />
          <Text size="sm" c={designTokens.colors.textMuted}>
            Looking for:
          </Text>
        </Group>
        <TagHolder tags={post.postTags} />

        <Text c="#555">{post.description}</Text>

        <Group justify="flex-end" gap="16px">
          <MessageButton />
          <LikeButton />
        </Group>
      </Stack>
      <Divider my="xl" w={"100%"} />
      <CommentsSection />
    </Container>
  );
}
