import { Button, Group, Text, Box, ActionIcon, Tooltip } from "@mantine/core";
import { IconLogout, IconPencil } from "@tabler/icons-react";

export default function ProfileActions({
  onLogout,
  onEditProfile
}: {
  onLogout: () => void;
  onEditProfile: () => void;
}) {
  return (
    <Group justify="flex-end" gap="md">
      {/* Edit Profile Button */}
      <Tooltip label="Edit Profile">
        <ActionIcon
          variant="filled"
          size='xl'
          radius='md'
          color="orange"
          onClick={onEditProfile}
        >
          <IconPencil/>
        </ActionIcon>
      </Tooltip>

      {/* Logout Button */}
      <Tooltip label="Log Out">
        <ActionIcon
          variant="filled"
          size='xl'
          radius='md'
          color="red"
          onClick={onLogout}
        >
          <IconLogout/>
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
