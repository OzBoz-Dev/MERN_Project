"use client";

import NewConversationModal from "@/components/NewConversationModal";
import { API_ENTRYPOINT } from "@/constants/constants";
import { Affix, Alert, Button, Tooltip } from "@mantine/core";
import { IconCheck, IconMessage2Plus, IconX } from "@tabler/icons-react";
import { getCookie } from "cookies-next/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import EditConversationModal from "./EditConversationModal";

export default function ConversationTriggers() {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingConvoId, setEditingConvoId] = useState<string|null>(null)
  const [createdConvo, setCreatedConvo] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [prefillUser, setPrefillUser] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const newConvo = searchParams.get('newConvo');
    const username = searchParams.get('username');
    const editConvo = searchParams.get('editConvo');
    const leaveConvo = searchParams.get('leaveConvo');

    setTimeout(() => {
    if (newConvo === 'true'){
        if (username) setPrefillUser(username);
        setIsCreating(true);
        router.replace('/messages');
    }
    if (editConvo) {
      setEditingConvoId(editConvo);
      setIsEditing(true);
      router.replace('/messages');
    }
    if (leaveConvo) {
      handleLeaveConvo(leaveConvo);
      router.replace('/messages');
    }
    }, 100)
  }, [searchParams]);

  const handleLeaveConvo = async (convoId: string) => {
    const token = getCookie('token');

    try {
      // Leave the conversation
      const res = await fetch(`${API_ENTRYPOINT}/conversations/leave/${convoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const err = await res.json();
        setErrorMessage(err.error);
        setFail(true);
        return;
      }

      setSuccess(true);
      router.refresh();

    } catch (err) {
      setErrorMessage('Failed to leave conversation: ' + err);
      setFail(true);
    }
  };

  const handleCreateConvo = async (data: any) => {
    const token = getCookie('token');
    const currentUsername = getCookie('username')

    const member_usernames = data.member_usernames.includes(currentUsername)
    ? data.member_usernames
    : [...data.member_usernames, currentUsername];

    try {
        const response = await fetch(`${API_ENTRYPOINT}/conversations/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({member_usernames})
        });

        if (!response.ok) {
            const err = await response.json();
            setErrorMessage(err.error);
            throw new Error(err.error || `Server error: ${err.error}`);
        }

        const newConvo = await response.json();
        setCreatedConvo(newConvo);
        setSuccess(true);
        setIsCreating(false);

        setTimeout(() => {
            router.push(`/messages/${newConvo._id}`);
        }, 1500); // brief delay so the success alert is visible
    }
    catch (error) {
        setFail(true);
    }
  }

  return (
    <>
      {success && (
          <Alert
            icon={<IconCheck size={16} />}
            title="Success!"
            color="green"
            withCloseButton
            onClose={() => setSuccess(false)}
            style={{ position: 'fixed', bottom: 80, right: 20, zIndex: 1000, width: 300 }}
          >
          </Alert>
      )}

      {fail && (
        <Alert
          icon={<IconX size={16} />}
          title="Operation Failed"
          color="red"
          withCloseButton
          onClose={() => setFail(false)}
          style={{ position: 'fixed', bottom: 80, right: 20, zIndex: 1000, width: 300 }}
        >
            {errorMessage}
        </Alert>
      )}

      <NewConversationModal
        isOpen={isCreating}
        onClose={() => {
            setIsCreating(false);
            setPrefillUser("");
        }}
        onSave={handleCreateConvo}
        prefillUser={prefillUser}
      />

      <EditConversationModal
        isOpen={isEditing}
        conversationId={editingConvoId}
        onClose={() => {
          setIsEditing(false);
          setEditingConvoId(null);
        }}
        onFail={(message) => {
          setErrorMessage(message);
          setFail(true);
        }}
        onSuccess={() => {
          setSuccess(true);
          router.refresh();
        }}
      />

      <Affix position={{ bottom: 20, right: 20 }}>
        <Tooltip label="New Conversation">
          <Button
            radius="xl"
            size="lg"
            color="orange"
            onClick={() => setIsCreating(true)}
          >
            <IconMessage2Plus />
          </Button>
        </Tooltip>
      </Affix>
    </>
  );
}