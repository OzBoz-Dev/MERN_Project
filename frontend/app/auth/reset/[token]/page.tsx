import { designTokens } from "@/app/GlobalTheme";
import { Paper, Title, Stack, Alert, Button, Text, PasswordInput } from "@mantine/core";
import { error } from "console";
import { useFormState } from "react-dom";

export default function resetPassword(){
  
return (
    <Paper
      withBorder
      p="xl"
      radius="md"
      className="glass-card"
      shadow="md"
      style={{ backgroundColor: designTokens.colors.glassyBackground }}
    >
      <Title
        order={1}
        mb="xl"
        ff={designTokens.fonts.heading}
        style={{ textAlign: "center" }}
      >
        Reset your password
      </Title>
      <Text size="sm" mb="lg">
        Type your new password below
      </Text>
      <Stack justify="flex-start">
        {success && (
          <Alert
            color="green"
            mb="md"
            radius="md"
            withCloseButton
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}
        {/* Error message */}
        {error && (
          <Alert
            color="red"
            mb="md"
            radius="md"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}
        { /* Password Input */ }
        <PasswordInput
            required
            label="New Password"
        />
        <PasswordInput
            required
            label="Confirm New Password"
        />
        <Button
          variant="filled"
          color="orange"
          fullWidth
          loading={loading}
          onClick={handleResetPassword}
          disabled={!canSubmit}
        >
          Reset Password
        </Button>
          <Button
            variant="subtle"
            color="orange"
            fullWidth
            onClick={() => {
              location.reload();
            }}
          >
          Back to Log In
        </Button>
      </Stack>
    </Paper>
);
}