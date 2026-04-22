"use client";

import { API_ENTRYPOINT } from "@/constants/constants";
import { useEffect, useState } from "react";
import {
  Modal,
  Group,
  Button,
  Stack,
  LoadingOverlay,
  Text
} from "@mantine/core";
import { designTokens } from "@/app/GlobalTheme";
import { UserSearchComboBox } from "./UserSearchComboBox";
import { getCookie } from "cookies-next/client";

export default function DeletePostModal({
  isOpen,
  postId,
  onClose,
  onFail,
  onSuccess
}: {
  isOpen: boolean;
  postId: string | null;
  onClose: () => void;
  onFail: (message: string) => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const token = getCookie('token');
    setLoading(true); 
    try {
      const res = await fetch(`${API_ENTRYPOINT}/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok){
        const data = await res.json();
        onFail(data.error);
        return;
      }
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      onFail('Failed to delete post:' + err);
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      zIndex={3000}
      radius='lg'
      title="Delete Post"
      styles={{
        title: { fontWeight: 700 },
        content: { backgroundColor: designTokens.colors.cardBackground },
        header: { backgroundColor: designTokens.colors.cardBackground },
        inner: { paddingTop: '10px' }
      }}
      size="lg"
      centered
    >
      <form style={{ display: "contents" }} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}>
        <Stack>
          <Text>Are you sure you want to delete this post?</Text>
          <Group justify="space-between" gap="md">
            <Button aria-label="Cancel" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Group>
            <Button loading={loading} aria-label="Delete" variant="filled" color="red" onClick={handleDelete}>
              Delete
            </Button>
            </Group>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}