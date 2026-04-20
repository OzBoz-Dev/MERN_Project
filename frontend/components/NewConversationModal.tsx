"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Group,
  Button,
  Divider,
  Stack,
} from "@mantine/core";
import { designTokens } from "@/app/GlobalTheme";
import { UserSearchComboBox } from "./UserSearchComboBox";

export default function NewConversationModal({
  isOpen,
  onClose,
  onSave,
  prefillUser
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  prefillUser: string
}) {
  const [usernames, setUsernames] = useState<string[]>(
    prefillUser ? [prefillUser]: []);
  
  useEffect(() => {
  if (isOpen) {
    setUsernames(prefillUser ? [prefillUser] : []);
  }
}, [isOpen, prefillUser]);

  // Handle form submission
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const updatedData = {
      member_usernames: usernames
    };

    console.log(usernames);

    await onSave(updatedData);
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      zIndex={3000}
      radius='lg'
      title="New Conversation"
      styles={{
        title: {fontWeight: 700},
        content: {
          backgroundColor: designTokens.colors.cardBackground
        },
        header: {
          backgroundColor: designTokens.colors.cardBackground
        },
        inner: {
          paddingTop: '10px'
        }
      }}
      size="lg"
      centered
    >
      <form onSubmit={handleSubmit} style={{ display: "contents" }} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault();}}>
        <Stack mih={100} justify="space-between">
        <UserSearchComboBox color="#FFFFFF" selectedUsers={usernames} setUsers={setUsernames}/>

        {/* Action Buttons */}
        <Group justify="space-between" gap="md">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="filled" color="orange">
            Create Conversation
          </Button>
        </Group>
        </Stack>
      </form>
    </Modal>
  );
}
