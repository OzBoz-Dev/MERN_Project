import UserAvatar from "@/components/UserAvatar";
import { Avatar, Text, Group, Box, Divider, Flex } from "@mantine/core";

// Hardcoded tag list for now
const AVAILABLE_TAGS = [
  "react",
  "python",
  "javascript",
  "typescript",
  "node",
  "mongodb",
  "css",
  "html",
];

export default function ProfileInfoCard({
  username,
  firstName,
  lastName,
  bio,
  profilePicture,
  tags,
}: {
  username?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePicture?: string;
  tags?: string[];
}) {
  return (
    <Box p="md">
      {/* User Avatar - Colored Circle */}
      <UserAvatar 
        username={username as string} 
        firstName={firstName as string} 
        lastName={lastName as string} 
        radius='lg' 
        size='xl'
      />

      {/* User Name */}
      <Text
        fz='h2'
        ta="center"
        fw={700}
        size="xl"
        mt="md"
        c="black"
        style={{ textTransform: "capitalize" }}
      >
        {firstName && lastName
          ? `${firstName} ${lastName}`
          : "User Name"}
      </Text>

      <Text
        ta = 'center'
        fs={"italic"}
      >
        {username}
      </Text>

      {/* Bio */}
      {bio ? (
        <Flex justify='center' w='100%'>
          <Text
            ta="center" 
            c="dimmed" 
            mt="sm" 
            maw={350}
            style={{ 
              overflowWrap: 'break-word', 
              wordBreak: 'break-word',
              whiteSpace: 'normal' 
            }}
          >
            {bio}
          </Text>
        </Flex>
      ) : (
        <Text ta="center" c="dimmed" mt="sm">
          No bio yet
        </Text>
      )}

      {/* Tags */}
      {tags && tags.length > 0 ? (
        <Group wrap="wrap" mt="md" gap="xs">
          {tags.map((tag) => (
            <Box
              key={tag}
              style={{
                background: "#e5e7eb",
                color: "#374151",
                padding: "4px 12px",
                borderRadius: "16px",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              #{tag}
            </Box>
          ))}
        </Group>
      ) : (
        <Text ta="center" c="dimmed" mt="md">
          No tags yet
        </Text>
      )}

      {/* Divider */}
      <Divider my="md" />
    </Box>
  );
}
