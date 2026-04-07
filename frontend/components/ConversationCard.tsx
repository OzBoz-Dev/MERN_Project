"use client";

import { designTokens } from "@/app/GlobalTheme";
import { Button, Card, Text, Group, Flex } from "@mantine/core";
import { IconMessage, IconUserCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  members: string[];
  lastMessage: string;
  lastMessageDate: string;
};

export default function ConversationCard({
  id,
  members,
  lastMessage,
  lastMessageDate,
}: Props) {
  const router = useRouter();
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
      <Flex direction="row" gap={5} align={"center"} mb={5}>
        <IconUserCircle color="blue" />
        <Text fw={700} size="xl">
          {members.length == 1
            ? members[0]
            : `${members[0]} & ${members.length - 1} more`}
        </Text>
      </Flex>
      <Flex direction="column" gap={2}>
        <Text size="sm" c={designTokens.colors.textMuted}>
          {lastMessage}
        </Text>
        <Text size="xs" c={designTokens.colors.textMuted}>
          {lastMessageDate}
        </Text>
        <Group justify="flex-end">
          <Button
            size="sm"
            leftSection={<IconMessage />}
            onClick={() => router.push(`/messages/${id}`)}
          >
            Message
          </Button>
        </Group>
      </Flex>
    </Card>
  );
}
