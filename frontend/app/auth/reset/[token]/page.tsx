"use client";

import { designTokens } from "@/app/GlobalTheme";
import { Paper, Title, Stack, Alert, Button, Text, PasswordInput, Container } from "@mantine/core";
import { error } from "console";
import { PasswordStrength } from "../../PasswordStrength";
import { useState } from "react";
import { useParams } from "next/navigation";
import { API_ENTRYPOINT } from "@/constants/constants";
import { getCookie } from "cookies-next/client";



export default function resetPassword(){
const [ password, setPassword ] = useState("");
const [ passwordValid, setPasswordValid ] = useState(false);
const [ loading, setLoading ] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);

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
  }
}

async function apiResetPassword(password: string) {
  const { resetToken } = useParams();
  const resp = await fetch(API_ENTRYPOINT + `/auth/reset-password/${resetToken}`, {
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
              location.reload();
            }}
          >
          Back to Log In
        </Button>
      </Stack>
    </Paper>
  </Container>
);
}