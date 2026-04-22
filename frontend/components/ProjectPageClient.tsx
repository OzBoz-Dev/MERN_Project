"use client";

import { designTokens } from "@/app/GlobalTheme";
import { Stack, Group, Title, Divider, Text, Paper, Transition, Button } from "@mantine/core";
import { IconTrash, IconUser } from "@tabler/icons-react";
import TimeAgo from "react-timeago";
import CommentsSection from "./CommentsSection";
import LikeButton from "./LikeButton";
import MessageButton from "./MessageButton";
import TagHolder from "./TagHolder";
import { Post } from "@/types/Post";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { PostComment } from "@/types/PostComment";
import { useEffect, useState } from "react";
import EditButton from "./EditPostButton";
import PostEditor from "./PostEditor";
import { getCookie } from "cookies-next/client";
import DeletePostModal from "./DeletePostModal";

type Props = {
  post: Post | null;
  comments: PostComment[];
};

export default function ProjectPageClient({ post, comments }: Props) {
  const [edit, setEdit] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  });

  return post == null ? (
    notFound()
  ) : (
    edit ? <PostEditor originalPost={post} edit={edit} setEdit={setEdit}/> :
    <div className="animated-grid">
      <DeletePostModal
        isOpen={deleting}
        postId={post._id}
        onClose={() => setDeleting(false)}
        onFail={(msg) => console.error(msg)}
        onSuccess={() => router.push('/feed')}
      />
      <Transition mounted={mounted} transition='pop' duration={500}>
        {(styles) => (
          <div style={styles}>
      <Paper
        withBorder
        p="xl"
        radius="md"
        className="glass-card"
        shadow="md"
        style={{ backgroundColor: designTokens.colors.glassyBackground }}
      >
      <Stack w="100%" gap="md">
        <Group justify="space-between" align="center">
          <Title order={1}>{post.title}</Title>
            {getCookie("username") === post.author_username && 
              <Group gap='sm'>
                <EditButton edit={edit} setEdit={setEdit}/>
                <Button color="red" radius='md' style={{ width: 40, height: 36, padding: 0 }} onClick={() => setDeleting(true)}>
                  <IconTrash/>
                </Button>
              </Group>
            }
        </Group>

        <Text size="sm" c={designTokens.colors.textMuted}>
          Posted by <Link href={`/profile/${post.author_username}`} style={{color: 'orange'}}>{post.author_username}</Link> &middot; {<TimeAgo date={post.datePosted} />}
        </Text>

        <Group gap="8px" align="center">
          <IconUser size="20px" />
          <Text size="sm" c={designTokens.colors.textMuted}>
            Looking for:
          </Text>
        </Group>
        <TagHolder tags={post.array_tags} />

        <Text c="#555" dangerouslySetInnerHTML={{ __html: post.body }} />

        <Group justify="flex-end" align="flex-start" gap="16px">
          <MessageButton author_username={post.author_username}/>
          <LikeButton
            likes={post.likes.length}
            postId={post._id}
            likedBy={post.likes}
          />
        </Group>
      </Stack>
      <Divider mt="lg" mb="xl" w={"100%"} />
      <CommentsSection postId={post._id} initialComments={comments} />
      </Paper>
      </div>
        )}
      </Transition>
    </div>
  );
}
