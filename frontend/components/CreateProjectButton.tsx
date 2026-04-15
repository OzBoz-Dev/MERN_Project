"use client";

import { designTokens } from "@/app/GlobalTheme";
import { Button, Container } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function CreateProjectButton() {
  const router = useRouter();

  return (
    <Button
      size="lg"
      radius="md"
      style={{
        padding: 0,
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1000,
      }}
      justify="center"
      color={designTokens.colors.buttonPrimary}
      onClick={() => router.push("/projects/create")}
    >
        <Container px={12}>
            <IconPencil style={{ verticalAlign: "center" }} />
        </Container>
    </Button>
  );
}
