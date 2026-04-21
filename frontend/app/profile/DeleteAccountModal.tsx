import { Modal, Alert, TextInput, Group, Button, Text } from "@mantine/core";

interface DeleteAccountModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  passwordValue: string;
  onPasswordChange: (val: string) => void;
  error: string | null;
  onErrorClose: () => void;
  success: string | null;
  onSuccessClose: () => void;
}

export default function DeleteAccountModal({
  opened,
  onClose,
  onConfirm,
  loading,
  passwordValue,
  onPasswordChange,
  error,
  onErrorClose,
  success,
  onSuccessClose,
}: DeleteAccountModalProps) {
  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="Delete Account" 
      size="sm" 
      centered
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onConfirm();
        }}
      >
        {success && (
          <Alert color="green" mb="md" radius="md" withCloseButton onClose={onSuccessClose}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert
            color="red"
            mb="md"
            radius="md"
            withCloseButton
            onClose={onErrorClose}
          >
            {error}
          </Alert>
        )}

        <Text size="sm" mb="sm">
          To confirm deletion, please enter your password. This action is permanent.
        </Text>

        <TextInput
          label="Password"
          type="password"
          value={passwordValue}
          onChange={(e) => onPasswordChange(e.currentTarget.value)}
          placeholder="Enter your password"
          required
          autoFocus
        />

        <Group mt="md" justify="flex-end">
          <Button aria-label="Cancel" variant="subtle" color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button
            aria-label="Delete Account"
            variant="filled"
            color="red"
            loading={loading}
            type="submit"
          >
            Delete Account
          </Button>
        </Group>
      </form>
    </Modal>
  );
}