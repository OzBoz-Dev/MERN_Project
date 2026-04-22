"use client";

import { API_ENTRYPOINT } from "@/constants/constants";
import { useEffect, useState } from "react";
import {
  Modal,
  Group,
  Button,
  Stack,
  LoadingOverlay,
} from "@mantine/core";
import { designTokens } from "@/app/GlobalTheme";
import { UserSearchComboBox } from "./UserSearchComboBox";
import { getCookie } from "cookies-next/client";

export default function EditConversationModal({
  isOpen,
  conversationId,
  onClose,
  onFail,
  onSuccess
}: {
  isOpen: boolean;
  conversationId: string | null;
  onClose: () => void;
  onFail: (message: string) => void;
  onSuccess: () => void;
}) {
  const [usernames, setUsernames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !conversationId) return;

    const fetchConversation = async () => {
      setLoading(true);
      try {
        const token = getCookie('token');
        const response = await fetch(`${API_ENTRYPOINT}/conversations/${conversationId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUsernames(data.member_usernames);
        }
      } catch (err) {
        onFail('Failed to fetch conversation:' + err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [isOpen, conversationId]);

  const handleUpdate = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const token = getCookie('token');
    try {
      const res = await fetch(`${API_ENTRYPOINT}/conversations/${conversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ member_usernames: usernames })
      });
      if (!res.ok){
        const data = await res.json();
        onFail(data.error);
        return;
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to update conversation:' + err);
    }
  };

  const handleDelete = async () => {
    const token = getCookie('token');
    try {
      const res = await fetch(`${API_ENTRYPOINT}/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok){
        const data = await res.json();
        onFail(data.error);
        return;
      }
      onSuccess();
      onClose();
    } catch (err) {
      onFail('Failed to delete conversation:' + err);
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      zIndex={3000}
      radius='lg'
      title="Edit Conversation"
      styles={{
        title: { fontWeight: 700 },
        content: { backgroundColor: designTokens.colors.cardBackground },
        header: { backgroundColor: designTokens.colors.cardBackground },
        inner: { paddingTop: '10px' }
      }}
      size="lg"
      centered
    >
      <LoadingOverlay visible={loading} />
      <form onSubmit={handleUpdate} style={{ display: "contents" }} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}>
        <Stack>
          <UserSearchComboBox
            color="#FFFFFF"
            selectedUsers={usernames}
            setUsers={setUsernames}
          />
          <Group justify="space-between" gap="md">
            <Button aria-label="Cancel" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Group>
              <Button aria-label="Update" type="submit" variant="filled" color="orange">
                Update
              </Button>
              <Button aria-label="Delete" variant="filled" color="red" onClick={handleDelete}>
                Delete
              </Button>
            </Group>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}