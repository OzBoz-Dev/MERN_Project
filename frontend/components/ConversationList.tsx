"use client";

import ConversationCard from "@/components/ConversationCard";
import { Stack, Transition } from "@mantine/core";
import { getCookie } from "cookies-next/client";
import { useEffect, useState } from "react";

export default function ConversationList({ conversations }: { conversations: any[] }) {
  const [mounted, setMounted] = useState(false);
  const me = getCookie('username');

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Stack>
      {conversations.map((message: any, index: number) => (
        <Transition
          key={message._id}
          mounted={mounted}
          transition="fade-up"
          duration={400}
          timingFunction="ease"
          enterDelay={index * 75} // stagger each card
        >
          {(styles) => (
            <div style={styles}>
              <ConversationCard
                id={message._id}
                members={message.member_usernames}
                lastMessage={
                  message.messages.length > 0
                    ? (message.messages[message.messages.length - 1].author_username === me
                      ? "You"
                      : message.messages[message.messages.length - 1].author_username)
                    + " · " + message.messages[message.messages.length - 1].content
                  : "No messages yet"
                }
                lastMessageDate={
                  message.messages.length > 0
                    ? new Date(message.messages[message.messages.length - 1].createdAt)
                    : new Date(message.createdAt)
                }
                owner={message.owner_username}
              />
            </div>
          )}
        </Transition>
      ))}
    </Stack>
  );
}