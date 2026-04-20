"use client";

import { useState } from "react";
import {
  Modal,
  TextInput,
  Textarea,
  Text,
  Group,
  Button,
  Box,
  Divider,
  Stack,
} from "@mantine/core";
import ProjectTag from "@/components/ProjectTag";
import TagComboBox from "@/components/TagComboBox";
import { designTokens } from "@/app/GlobalTheme";
import { UserSearchComboBox } from "./UserSearchComboBox";

export default function NewConversationModal({
  isOpen,
  onClose,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [usernames, setUsernames] = useState<string[]>([]);
  
  // Handle form submission
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const updatedData = {
      usernames: usernames
    };

    console.log(usernames);

    await onSave(updatedData);

    onClose();
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
        <Stack>
        <UserSearchComboBox color="#FFFFFF" selectedUsers={usernames} setUsers={setUsernames}/>

        {/* Divider */}
        <Divider my="md" />

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
