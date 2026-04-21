"use client";

import { designTokens } from "@/app/GlobalTheme";
import { Button, Card, Text, Group, Flex, Tooltip } from "@mantine/core";
import { IconDoorExit, IconMessage, IconPencilCog, IconUserCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import TimeAgoClient from "./TimeAgoClient";
import { getCookie } from "cookies-next/client";

type Props = {
  id: string;
  members: string[];
  lastMessage: string;
  lastMessageDate: Date;
  owner: string
};

export default function ConversationCard({
  id,
  members,
  lastMessage,
  lastMessageDate,
  owner,
}: Props) {
  const router = useRouter();
  const myUser = getCookie("username");
  const notMe = members.find(user => user !== myUser)
  const isOwner = owner===myUser;

  return (
    <Card
      style={{
        borderLeft: `8px solid ${designTokens.colors.cardBorder}`,
        borderRadius: designTokens.borderRadius.card,
        padding: designTokens.spacing.cardPadding,
        boxShadow: designTokens.colors.cardShadow,
        background: designTokens.colors.glassyBackground,
        backdropFilter: "blur(7px)",
        textAlign: "left",
      }}
    >
      <Flex direction="row" gap={5} mb={5} align="center" style={{ width: '100%' }}>
        <Group gap='sm'>
          <IconUserCircle color="red" />
          <Text fw={700} size="xl">
            {members.length == 2
              ? notMe
              : `${notMe} & ${members.length - 1} more`}
          </Text>
        </Group>
        <Group justify="flex-end" style={{ marginLeft: 'auto' }}>
          <Tooltip label={isOwner ? "Can't leave your own conversation" : "Leave Conversation"}>
          <Button
            aria-label="Leave Conversation"
            radius='md'
            variant="outline"
            color="red"
            onClick={() => router.push(`/messages?leaveConvo=${id}`)}
            disabled={isOwner}
            >
            <IconDoorExit/>
          </Button>
          </Tooltip>
          <Tooltip label={isOwner ? "Edit Conversation" : "You don't own this conversation"}>
          <Button
            aria-label="Edit Conversation"
            radius='md'
            variant="outline"
            onClick={() => router.push(`/messages?editConvo=${id}`)}
            disabled={!isOwner}
            >
            <IconPencilCog/>
          </Button>
          </Tooltip>
        </Group>
      </Flex>
      <Flex direction="column" gap={2}>
        <Text size="sm" c={designTokens.colors.textMuted}>
          {lastMessage}
        </Text>
        <Text size="xs" c={designTokens.colors.textMuted}>
          <TimeAgoClient date={lastMessageDate}/>
        </Text>
        <Group justify="flex-end">
          <Button
            aria-label="Message"
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
