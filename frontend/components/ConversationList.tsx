"use client";

import ConversationCard from "@/components/ConversationCard";
import { Stack, Transition } from "@mantine/core";
import { useEffect, useState } from "react";

export default function ConversationList({ conversations }: { conversations: any[] }) {
  const [mounted, setMounted] = useState(false);

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
                lastMessage={message.messages[message.messages.length - 1].author_username
                  + " · " + message.messages[message.messages.length - 1].content}
                lastMessageDate={new Date(message.messages[message.messages.length - 1].createdAt)}
              />
            </div>
          )}
        </Transition>
      ))}
    </Stack>
  );
}