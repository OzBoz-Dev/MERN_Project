import { Avatar, Text, Group, Box, Divider } from "@mantine/core";

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

// 8 solid colors for profile picture
const COLOR_OPTIONS = [
  "#3b82f6",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#f59e0b",
  "#ec4899",
  "#6b7280",
  "#e9da3d",
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
      <Avatar
        radius="lg"
        size="xl"
        style={{
          background: COLOR_OPTIONS[username ? username?.length % 8 : 0],
          width: 80,
          height: 80,
          margin: "0 auto",
        }}
        color="white"
      >JD</Avatar>

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
        <Text ta="center" c="dimmed" mt="sm">
          {bio}
        </Text>
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
