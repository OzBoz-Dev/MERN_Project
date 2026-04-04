"use client";

import { useState } from "react";
import { Button, Textarea, Stack, Group, Text } from "@mantine/core";
import CommentCard from "./CommentCard";

type Comment = {
  author: string;
  datePosted: Date;
  body: string;
};

// Fake, hardcoded data for now
// TODO: Use fetch() later to fetch actual comments
const initialComments: Comment[] = [
  {
    author: "user_1",
    datePosted: new Date(),
    body: "Comment body",
  },
  {
    author: "user_2",
    datePosted: new Date(),
    body: "Comment body **bold**",
  },
  {
    author: "user_3",
    datePosted: new Date(),
    body: "Comment body *italics*",
  },
];

export default function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [writing, setWriting] = useState(false);
  const [draft, setDraft] = useState("");

  const handlePost = () => {
    if (!draft.trim()) return;
    const newComment: Comment = {
      author: "you", // placeholder until auth is wired up
      datePosted: new Date(),
      body: draft.trim(),
    };
    setComments((prev) => [newComment, ...prev]); // newest on top
    setDraft("");
    setWriting(false);
  };

  return (
    <Stack w="100%" gap="md">
      <Text size="xl" fw={700}>
        Comments
      </Text>
      {!writing ? (
        <Button size="lg" fullWidth onClick={() => setWriting(true)}>
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
              variant="subtle"
              onClick={() => {
                setWriting(false);
                setDraft("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handlePost}>Post Comment</Button>
          </Group>
        </Stack>
      )}

      {comments.map((c, i) => (
        <CommentCard
          key={`${c.author}-${c.datePosted.getTime()}-${i}`}
          author={c.author}
          datePosted={c.datePosted}
          body={c.body}
        />
      ))}
    </Stack>
  );
}
