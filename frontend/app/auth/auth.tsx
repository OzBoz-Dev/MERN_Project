"use client";

import {
  Container,
  Box,
  Title,
  Paper,
  Button,
  Alert,
  Text,
  Group,
  Stack,
} from "@mantine/core";
import { useState } from "react";
import { designTokens } from "../GlobalTheme";
import { PasswordStrength } from "./PasswordStrength";
import { ForgotPasswordInput } from "./ForgotPasswordInput";
import { FloatingLabelInput } from "./FloatingLabelInput";
import { GradientSegmentedControl } from "./GradientSegmentedControl";
import { InputValidation } from "./InputValidation";
import { API_ENTRYPOINT } from "@/constants/constants";
import { Metadata } from "next";

export default function Auth() {
  const [type, setType] = useState("Log In");

  // Forms
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Validation states
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const canSubmit =
    type === "Log In"
      ? emailValid && password.trim().length > 0
      : emailValid &&
        passwordValid &&
        username.trim().length > 0 &&
        lastName.trim().length > 0 &&
        firstName.trim().length > 0;

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // API Helpers
  async function apiSignup(
    email: string,
    password: string,
    username: string,
    firstName: string,
    lastName: string,
  ) {
    const resp = await fetch(API_ENTRYPOINT + "/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, firstName, lastName }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error);
    return data;
  }

  async function apiLogin(email: string, password: string) {
    const resp = await fetch(API_ENTRYPOINT + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error);
    return data;
  }

  async function apiResendVerification(email: string) {
    const resp = await fetch(API_ENTRYPOINT + "/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error);
    return data;
  }

  // Submit Function
  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (type === "Sign Up") {
        await apiSignup(email, password, username, firstName, lastName);
        setSuccess("Signup Submitted!");
        setSubmittedEmail(email);
        setVerificationSent(true);
      } else {
        const data = await apiLogin(email, password);
        // Store token
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("firstName", data.user.firstName);
        localStorage.setItem("lastName", data.user.lastName);
        setSuccess(`Welcome back, ${data.user.username}!`);
        location.assign("/feed");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Resend Verification Email Handler
  const handleResendEmail = async () => {
    setError(null);
    setSuccess(null);
    setResendLoading(true);

    try {
      await apiResendVerification(submittedEmail);
      setSuccess("Verification email sent!");
      setResendCooldown(30);

      // Start cooldown countdown
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  const authCard = (
    <Paper
      withBorder
      p="xl"
      w="40vw"
      radius="md"
      className="glass-card"
      shadow="md"
      style={{ backgroundColor: designTokens.colors.glassyBackground }}
    >
      <GradientSegmentedControl
        value={type}
        onChange={(val) => {
          setType(val);
          setEmail("");
          setPassword("");
          setUsername("");
          setEmailValid(false);
          setPasswordValid(false);
          setError(null);
          setSuccess(null);
        }}
        data={["Log In", "Sign Up"]}
      />
      <br></br>
      <Title
        order={1}
        mb="xl"
        ff={designTokens.fonts.heading}
        style={{ textAlign: "center" }}
      >
        {type === "Log In" ? "Welcome Back" : "Create Account"}
      </Title>
      <Stack justify="flex-start">
        {/* Success message */}
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
        {/* Email Field */}
        {type === "Log In" ? (
          <InputValidation
            label="Email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            onValidChange={setEmailValid}
          />
        ) : (
          <InputValidation
            value={email}
            label="Email"
            type="email"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            onValidChange={setEmailValid}
          />
        )}
        {/* Username Field */}
        {type !== "Log In" ? (
          <FloatingLabelInput
            label="Username"
            type="username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />
        ) : (
          <></>
        )}
        {/* First and Last Name Field */}
        {type !== "Log In" ? (
          <Group grow>
            <FloatingLabelInput
              label="First Name"
              type="firstName"
              value={firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFirstName(e.target.value)
              }
            />
            <FloatingLabelInput
              label="Last Name"
              type="lastName"
              value={lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLastName(e.target.value)
              }
            />
          </Group>
        ) : (
          <></>
        )}
        {/* Password Field */}
        {type === "Log In" ? (
          <ForgotPasswordInput
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        ) : (
          <PasswordStrength
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            onValidChange={setPasswordValid}
          />
        )}
        <Box mt="md">
          <Button
            variant="filled"
            color="orange"
            fullWidth
            loading={loading}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {type === "Log In" ? "Sign In" : "Create Account"}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );

  const verifyCard = (
    <Paper
      withBorder
      p="lg"
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
        Check your inbox
      </Title>
      <Text size="sm" c="dimmed" mb="lg">
        We sent a verification link to{" "}
        <Text component="span" fw={600} c="orange">
          {submittedEmail}
        </Text>
        . Click the link in the email to activate your account.
      </Text>
      <Group justify="space-between">
        <Button
          variant="subtle"
          color="orange"
          fullWidth
          loading={resendLoading}
          disabled={resendCooldown > 0}
          onClick={handleResendEmail}
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Email"}
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
      </Group>
    </Paper>
  );

  return (
    <main>
      <div style={{}} className="animated-grid">
        <Container size="md" my="xl" p="xl">
          {verificationSent ? verifyCard : authCard}
        </Container>
      </div>
    </main>
  );
}