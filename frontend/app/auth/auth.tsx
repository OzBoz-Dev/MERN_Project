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
  Collapse,
  Transition
} from "@mantine/core";

import {
  setCookie,
} from 'cookies-next/client';

import { IconMailCheck } from "@tabler/icons-react";
import { IconUserKey } from "@tabler/icons-react";

import { useState } from "react";
import { designTokens } from "../GlobalTheme";
import { PasswordStrength } from "./PasswordStrength";
import { ForgotPasswordInput } from "./ForgotPasswordInput";
import { FloatingLabelInput } from "./FloatingLabelInput";
import { GradientSegmentedControl } from "./GradientSegmentedControl";
import { InputValidation } from "./InputValidation";
import { API_ENTRYPOINT } from "@/constants/constants";
import Image from "next/image";

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
  const [resettingPassword, setResettingPassword] = useState(false);
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

  async function apiResetPassword(email: string) {
    const resp = await fetch(API_ENTRYPOINT + "/auth/recovery/", {
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
        setPassword("");
      } else {
        const data = await apiLogin(email, password);
        // Store token
        setCookie("token", data.token);
        setCookie("userId",  data.user.id);
        setCookie("username", data.user.username);
        setCookie("firstName", data.user.firstName);
        setCookie("lastName", data.user.lastName);
        setSuccess(`Welcome back, ${data.user.username}!`);
        location.assign("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit Function
  const handleResetPassword = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await apiResetPassword(email);
      setSuccess("Check your inbox");
      setSubmittedEmail(email);
      setVerificationSent(true);
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
      w='min(550px, 90vw)'
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
          setFirstName("");
          setLastName("");
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
      <Stack justify="flex-start" gap={0}>
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
        <InputValidation
          label="Email"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          onValidChange={setEmailValid}
        />
        <Collapse in={type === "Sign Up"} transitionDuration={700}>
        <Stack gap={10} pt={10}>
        {/* Username Field */}
          <FloatingLabelInput
            label="Username"
            type="username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />
        {/* First and Last Name Field */}
          <Group grow mt={10}>
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
          </Stack>
        </Collapse>
        {/* Password Field */}
        <div style={{ position: 'relative' }}>
        <Collapse in={type === 'Log In'} transitionDuration={700}>
        <Stack gap={10} pt={10}>
          <ForgotPasswordInput
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            onClick={() => setResettingPassword(true)}
          />
        </Stack>
        </Collapse>
        <Collapse in={type === 'Sign Up'}>
        <Stack gap={10} pt={10}>
          <PasswordStrength
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            onValidChange={setPasswordValid}
          />
        </Stack>
        </Collapse>
        </div>
        <Box mt="md">
          <Button
            aria-label={type === "Log In" ? "Sign In" : "Create Account"}
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
      w='min(550px, 90vw)'
      style={{ backgroundColor: designTokens.colors.glassyBackground }}
    >
      <Stack align='center'>
      <IconMailCheck color="orange" size={100}/>
      <Title
        order={1}
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
          aria-label="Resend Email"
          variant="outline"
          color="orange"
          loading={resendLoading}
          disabled={resendCooldown > 0}
          onClick={handleResendEmail}
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Email"}
        </Button>
        <Button
          aria-label="Return to Log In"
          variant="outline"
          color="orange"
          onClick={() => {
            setType("Log In");
            setEmail("");
            setEmailValid(false);
            setError(null);
            setSuccess(null);
            setVerificationSent(false);
          }}
        >
          Back to Log In
        </Button>
      </Group>
      </Stack>
    </Paper>
  );

  const resetCard = (
    <Paper
      withBorder
      p="xl"
      w='min(550px, 90vw)'
      radius="md"
      className="glass-card"
      shadow="md"
      style={{ backgroundColor: designTokens.colors.glassyBackground }}
    >
      <Stack align="center">
      <IconUserKey color="orange" size={70}/>
      <Title
        order={1}
        mb="xl"
        ff={designTokens.fonts.heading}
        style={{ textAlign: "center" }}
      >
        Reset your password
      </Title>
      <Text size="sm" mb="lg">
        Type your recovery email below to send a reset request
      </Text>
      <Stack w="100%">
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
        { /* Email input */ }
        <InputValidation
            value={email}
            label="Recovery Email"
            type="email"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            onValidChange={setEmailValid}
        />
          <Button
            aria-label="Reset Password"
            variant="filled"
            color="orange"
            fullWidth
            loading={loading}
            onClick={handleResetPassword}
            disabled={!emailValid}
          >
            Reset Password
          </Button>
          <Button
            variant="subtle"
            color="orange"
            fullWidth
            onClick={() => {
              setType("Log In");
              setEmail("");
              setEmailValid(false);
              setError(null);
              setSuccess(null);
              setResettingPassword(false);
            }}
          >
          Back to Log In
        </Button>
        </Stack>
      </Stack>
    </Paper>
  );

return (
  <main>
    <div className="animated-grid">
        <Stack align="center" gap="xl">
          {/* Logo Transition */}
          <Box mt='xl'>
            <Image
              src="/ChipIn.png"
              alt="ChipIn logo"
              width={396}
              height={125}
            />
          </Box>

          {/* Cards Container */}
          <Box 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr', 
              alignItems: 'start',
              gridTemplateRows: '1fr',
              minHeight: '450px'
            }}
          >
            {/* Auth Card */}
            <Transition
              mounted={!resettingPassword && !verificationSent}
              transition="pop"
              duration={400}
            >
              {(styles) => (
                <Box style={{ ...styles, gridArea: '1 / 1 / 2 / 2' }}>
                  {authCard}
                </Box>
              )}
            </Transition>

            {/* Reset Card */}
            <Transition
              mounted={resettingPassword}
              transition="pop"
              duration={400}
            >
              {(styles) => (
                <Box style={{ ...styles, gridArea: '1 / 1 / 2 / 2' }}>
                  {resetCard}
                </Box>
              )}
            </Transition>

            {/* Verify Card */}
            <Transition
              mounted={verificationSent && !resettingPassword}
              transition="pop"
              duration={400}
            >
              {(styles) => (
                <Box style={{ ...styles, gridArea: '1 / 1 / 2 / 2' }}>
                  {verifyCard}
                </Box>
              )}
            </Transition>
          </Box>
        </Stack>
    </div>
  </main>
);
}