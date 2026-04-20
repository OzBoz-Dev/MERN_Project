"use client";

import NewConversationModal from "@/components/NewConversationModal";
import { Affix, Button, Tooltip } from "@mantine/core";
import { IconMessage2Plus } from "@tabler/icons-react";
import { useState } from "react";

export default function NewConversationTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <NewConversationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={(data) => {
          // handle save
          setIsOpen(false);
        }}
      />
      <Affix position={{ bottom: 20, right: 20 }}>
        <Tooltip label="New Conversation">
          <Button
            radius="xl"
            size="lg"
            color="orange"
            onClick={() => setIsOpen(true)}
          >
            <IconMessage2Plus />
          </Button>
        </Tooltip>
      </Affix>
    </>
  );
}