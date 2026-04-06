'use client'

import { Container, Box, Title, Paper, Button, Alert, Text } from '@mantine/core';
import { useState } from 'react';
import { designTokens } from '../GlobalTheme';
import { PasswordStrength } from './PasswordStrength';
import { ForgotPasswordInput } from './ForgotPasswordInput';
import { FloatingLabelInput } from './FloatingLabelInput';
import { GradientSegmentedControl } from './GradientSegmentedControl';
import { InputValidation } from './InputValidation';
import { API_ENTRYPOINT } from '../page';

export default function Auth() {
  const[type, setType] = useState('Log In');

  // Forms
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[username, setUsername] = useState('');

  // Validation states
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const canSubmit =
  type === 'Log In'
    ? emailValid && password.trim().length > 0
    : emailValid && passwordValid && username.trim().length > 0;

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  // API Helpers
  async function apiSignup(email: string, password: string, username: string) {
    const resp = await fetch(API_ENTRYPOINT+'/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error);
  return data;
  }

  async function apiLogin(email: string, password: string) {
      const resp = await fetch(API_ENTRYPOINT+'/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
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
      if (type === 'Sign Up') {
        await apiSignup(email, password, username);
        setSuccess('Signup Submitted!');
        setSubmittedEmail(email);
        setVerificationSent(true);
      } else {
        const data = await apiLogin(email, password);
        // Store token
        localStorage.setItem('token', data.token);
        setSuccess(`Welcome back, ${data.user.username}!`);
        location.assign('/feed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const authCard = (
    <Paper withBorder p="lg" radius="md" className='glass-card' shadow="md" style={{backgroundColor: designTokens.colors.glassyBackground}}>
      <GradientSegmentedControl 
        value={type} 
        onChange={(val) => {
          setType(val);
          setEmail('');
          setPassword('');
          setUsername('');
          setEmailValid(false);
          setPasswordValid(false);
          setError(null);
          setSuccess(null);
        }} 
        data={["Log In", "Sign Up"]}  
      />
      <br></br>
      <Title order={1} mb="xl" ff={designTokens.fonts.heading} style={{textAlign: 'center'}}>
        {type === 'Log In' ? 'Welcome Back' : 'Create Account'}
      </Title>
      <Box maw={400} mx="auto" pl={100} pr={100}>
        {/* Success message */}
          {success && (
            <Alert color="green" mb="md" radius="md" withCloseButton onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}
          {/* Error message */}
          {error && (
            <Alert color="red" mb="md" radius="md" withCloseButton onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
        {/* Email Field */}
        <div style={{ marginBottom: '10px' }}>
          {type === 'Log In'? (
            <InputValidation
              label="Email"
              type="email"
              value = {email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              onValidChange={setEmailValid}
              />
          ) : (
            <InputValidation
              value = {email}
              label='Email'
              type="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              onValidChange={setEmailValid}
            />
          )}
        </div>
        {/* Username Field */}
        <div style={{ marginTop: '32px' }}>
          {type !== 'Log In' ? (
          <FloatingLabelInput
            label="Username"
            type="username"
            value = {username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            />
          ) : (<></>)}
        </div>
        {/* Password Field */}
        <div style={{ marginBottom: '20px' }}>
          {type === 'Log In' ? (
          <ForgotPasswordInput
            value = {password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
          ) : (
          <PasswordStrength
            value = {password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            onValidChange={setPasswordValid}
          />
          )}
        </div>
        
        <Box mt="md">
          <Button 
            variant="filled"
            color="orange" 
            fullWidth 
            loading={loading} 
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {type === 'Log In' ? 'Sign In' : 'Create Account'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );

  const verifyCard = (
      <Paper withBorder p="lg" radius="md" className='glass-card' shadow="md" style={{backgroundColor: designTokens.colors.glassyBackground}}>
      <Title order={1} mb="xl" ff={designTokens.fonts.heading} style={{textAlign: 'center'}}>
        Check your inbox
      </Title>
      <Text size="sm" c="dimmed" mb="lg">
          We sent a verification link to{' '}
          <Text component="span" fw={600} c="orange">
            {submittedEmail}
          </Text>
          . Click the link in the email to activate your account.
      </Text>
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
    </Paper>
  );

  return (
    <main>
      <div style={{  }} className='animated-grid'>
      <Container size="md" my="xl">
        {verificationSent ? verifyCard : authCard}
      </Container>
      </div>
    </main>
  );
}

