"use client";

import { designTokens } from "@/app/GlobalTheme";
import { Paper, Title, Stack, Alert, Button, Text, Container } from "@mantine/core";
import { PasswordStrength } from "../../PasswordStrength";
import { useState } from "react";
import { useParams } from "next/navigation";
import { API_ENTRYPOINT } from "@/constants/constants";

export default function ResetPassword(){
const [ password, setPassword ] = useState("");
const [ passwordValid, setPasswordValid ] = useState(false);
const [ loading, setLoading ] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);
const { token } = useParams();

const handleResetPassword = async () => {
  setError(null);
  setSuccess(null);
  setLoading(true);

  try {
    await apiResetPassword(password);
    setSuccess("Password reset successfully!");
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
    location.assign('/')
  }
}

async function apiResetPassword(password: string) {
  const resp = await fetch(API_ENTRYPOINT + `/auth/recovery/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ password }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error);
  return data;
}

return (
  <Container size="md" my="xl" p="xl">
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
        <PasswordStrength
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          onValidChange={setPasswordValid}
        />
        <Button
          variant="filled"
          color="orange"
          fullWidth
          loading={loading}
          onClick={handleResetPassword}
          disabled={!passwordValid}
        >
          Reset Password
        </Button>
          <Button
            variant="subtle"
            color="orange"
            fullWidth
            onClick={() => {
              location.assign('/')
            }}
          >
          Back to Log In
        </Button>
      </Stack>
    </Paper>
  </Container>
);
}