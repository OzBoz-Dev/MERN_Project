"use client";

import NewConversationModal from "@/components/NewConversationModal";
import { API_ENTRYPOINT } from "@/constants/constants";
import { Affix, Alert, Button, Tooltip } from "@mantine/core";
import { IconCheck, IconMessage2Plus, IconX } from "@tabler/icons-react";
import { getCookie } from "cookies-next/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewConversationTrigger() {
  const [isOpen, setIsOpen] = useState(false);
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
    setTimeout(() => {
    if (newConvo === 'true'){
        if (username) setPrefillUser(username);
        setIsOpen(true);
        router.replace('/messages');
    }
    }, 100)
  }, [searchParams]);

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
        setIsOpen(false);

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
            title="Conversation created!"
            color="green"
            withCloseButton
            onClose={() => setSuccess(false)}
            style={{ position: 'fixed', bottom: 80, right: 20, zIndex: 1000, width: 300 }}
          >
            Redirecting you now...
          </Alert>
      )}

      {fail && (
        <Alert
          icon={<IconX size={16} />}
          title="Failed to create conversation"
          color="red"
          withCloseButton
          onClose={() => setFail(false)}
          style={{ position: 'fixed', bottom: 80, right: 20, zIndex: 1000, width: 300 }}
        >
            {errorMessage}
        </Alert>
      )}

      <NewConversationModal
        isOpen={isOpen}
        onClose={() => {
            setIsOpen(false);
            setPrefillUser("");
        }}
        onSave={handleCreateConvo}
        prefillUser={prefillUser}
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