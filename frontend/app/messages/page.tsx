import ConversationCard from "@/components/ConversationCard";

export default function MessagesPage() {
  // Mock data for now
  const conversations = [
    {
      id: "1",
      members: ["John Aedo", "hml786"],
      lastMessage: "Hi, it's me, John Aedo.",
      lastMessageDate: "2 hours ago",
    },
    {
      id: "2",
      members: ["hml786"],
      lastMessage: "Hi, it's me, Haani.",
      lastMessageDate: "3 hours ago",
    },
  ];

  // Messages page will fetch all conversations
  // Create MessageCards with this data
  // If member_users is > 1, then its a group conversation

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "16px" }}>
      <h1>Messages</h1>
      {conversations.map((c) => (
        <ConversationCard key={c.id} {...c} />
      ))}
    </div>
  );
}
