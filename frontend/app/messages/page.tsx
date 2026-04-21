import ConversationCard from "@/components/ConversationCard";
import ConversationList from "@/components/ConversationList";
import NewConversationModal from "@/components/NewConversationModal";
import NewConversationTrigger from "@/components/ConversationTriggers";
import { API_SERVER_ENTRYPOINT } from "@/constants/constants";
import { Affix, Button, Container, Stack, Tooltip, Transition } from "@mantine/core";
import { IconMessage2Plus, IconPlus } from "@tabler/icons-react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import ConversationTriggers from "@/components/ConversationTriggers";

// Metadata
export const metadata: Metadata = {
  title: 'Messages',
};

export default async function MessagesPage() {
  // Mock data for now
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const result = await 
    fetch(API_SERVER_ENTRYPOINT + `/conversations/`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      cache: "no-store"
    }
  );

  const conversations = await result.json();

  // Messages page will fetch all conversations
  // Create MessageCards with this data
  // If member_users is > 1, then its a group conversation

  return (
    <div className="static-grid-blurry">
    <Container style={{ maxWidth: "800px", margin: "0 auto", padding: "16px" }}>
      <h1>Messages</h1>
      <Stack>
      <ConversationList conversations={conversations}/>
      </Stack>
    </Container>
    <ConversationTriggers/>
    </div>
  );
}
