"use client";

import {
  Stack,
  Button,
  Textarea,
  Group,
  Text,
  Center,
  Space,
} from "@mantine/core";
import { IconPencil, IconCircleXFilled } from "@tabler/icons-react";
import CommentCard from "./CommentCard";
import { useState } from "react";
import { getCookie } from "cookies-next/client";
import { ObjectId } from "bson";
import { API_ENTRYPOINT } from "@/constants/constants";
import { designTokens } from "@/app/GlobalTheme";
import { PostComment } from "@/types/PostComment";

type Props = {
  postId: string;
  initialComments: PostComment[];
};

// Creates a new comment
async function createComment(
  author_username: string,
  body: string,
  post_id_belong: string,
) {
  const response = await fetch(API_ENTRYPOINT + `/comments/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    body: JSON.stringify({
      author_username,
      body,
      likes: [],
      post_id_belong,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    const error: string = data.error;
    throw new Error(`Error occurred when creating a comment: ${error}`);
  }
  return data; // return the comment
}

export default function CommentsSection({ postId, initialComments }: Props) {
  const [comments, setComments] = useState<PostComment[]>(initialComments);
  const [writing, setWriting] = useState(false);
  const [draft, setDraft] = useState("");

  const mockComments: PostComment[] = [
    {
      id: "124",
      author_username: "anon",
      body: "asdf",
      likes: [],
      post_id_belong: "123",
    },
    {
      id: "124",
      author_username: "anon",
      body: "asdf",
      likes: [],
      post_id_belong: "123",
    },
    {
      id: "124",
      author_username: "anon",
      body: "asdf",
      likes: [],
      post_id_belong: "123",
    },
    {
      id: "124",
      author_username: "anon",
      body: "asdf",
      likes: [],
      post_id_belong: "123",
    },
    {
      id: "124",
      author_username: "anon",
      body: "asdf",
      likes: [],
      post_id_belong: "123",
    },
    {
      id: "124",
      author_username: "anon",
      body: "asdf",
      likes: [],
      post_id_belong: "123",
    },
  ];

  return (
    <Stack w="100%" gap="md">
      <Text size="xl" fw={700}>
        Comments
      </Text>
      {!writing ? (
        <Button
          aria-label="Post Comment"
          size="lg"
          fullWidth
          onClick={() => setWriting(true)}
          leftSection={<IconPencil />}
        >
          Post Comment
        </Button>
      ) : (
        <Stack gap="sm">
          <Textarea
            placeholder="Write your comment..."
            autosize
            minRows={3}
            value={draft}
            onChange={(e) => setDraft(e.currentTarget.value)}
          />
          <Group justify="flex-end">
            <Button
              aria-label="Cancel"
              variant="subtle"
              c={"red"}
              onClick={() => {
                setWriting(false);
                setDraft("");
              }}
              leftSection={<IconCircleXFilled />}
            >
              Cancel
            </Button>
            <Button
              aria-label="Post Comment"
              onClick={async () => {
                if (!draft.trim()) return;
                let createdComment: PostComment;
                try {
                  createdComment = await createComment(
                    getCookie("username") ?? "Anonymous",
                    draft.trim(),
                    postId,
                  );
                } catch (e) {
                  console.error(e);
                  return;
                }

                setComments((prev) => [createdComment, ...prev]); // newest on top
                setDraft("");
                setWriting(false);
              }}
            >
              Post Comment
            </Button>
          </Group>
        </Stack>
      )}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <CommentCard
            key={`${comment.id}`}
            author={comment.author_username}
            datePosted={new ObjectId(comment.id).getTimestamp()}
            body={comment.body}
            commentId={comment.id}
            likes={comment.likes}
          />
        ))
      ) : (
        <Center pt={50}>
          <Text c={designTokens.colors.textMuted}>
            No comments yet. Start the conversation!
          </Text>
        </Center>
      )}
      <Space h={"md"} />
    </Stack>
  );
}
