import ConversationCard from "@/components/ConversationCard";
import NewConversationModal from "@/components/NewConversationModal";
import NewConversationTrigger from "@/components/NewConversationTrigger";
import { API_SERVER_ENTRYPOINT } from "@/constants/constants";
import { Affix, Button, Container, Stack, Tooltip } from "@mantine/core";
import { IconMessage2Plus, IconPlus } from "@tabler/icons-react";
import { Metadata } from "next";
import { cookies } from "next/headers";

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
      {conversations.map((message: any) => (
        <ConversationCard 
          key={message._id} 
          id={message._id} 
          members={message.member_usernames} 
          lastMessage={message.messages[message.messages.length-1].author_username 
            + " · " + message.messages[message.messages.length-1].content} 
          lastMessageDate={new Date(message.messages[message.messages.length-1].createdAt)}/>
      ))}
      </Stack>
    </Container>
    <NewConversationTrigger/>
    </div>
  );
}
