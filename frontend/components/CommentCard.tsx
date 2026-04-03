"use client";

import { Card, Text } from "@mantine/core";

type Props = {
  author: String; // i.e., username
  datePosted: Date;
  body: String;
};

export default function CommentCard({ author, datePosted, body }: Props) {
  return (
    <Card>
      <Text>Comment Card</Text>
    </Card>
  );
}
