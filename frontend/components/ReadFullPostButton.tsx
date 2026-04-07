"use client";

import { Button } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
};

export default function ReadFullPostButton({ id }: Props) {
  const router = useRouter();

  return (
    <Button
      variant="subtle"
      rightSection={<IconArrowRight size={16} />}
      onClick={() => router.push(`/projects/${id}`)}
    >
      Read Full Post
    </Button>
  );
}
