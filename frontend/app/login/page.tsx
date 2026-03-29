'use client'

import { IconAlertTriangle } from '@tabler/icons-react';
import { TextInput, Container, Box, Title, Paper, Button, Anchor, Group, PasswordInput, Text, rgba } from '@mantine/core';
import input from './FloatingLabelInput.module.css';
import { HTMLInputTypeAttribute, useState } from 'react';
import { designTokens } from '../GlobalTheme';
import '../globals.css'

interface FloatingLabelProps{
  label: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
}

function FloatingLabelInput({label, placeholder, type} : FloatingLabelProps) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const floating = value.trim().length !== 0 || focused || undefined;

  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      required
      type={type}
      classNames={input}
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      mt="md"
      autoComplete="nope"
      data-floating={floating}
      labelProps={{ 'data-floating': floating }}
    />
  );
}

function ForgotPasswordInput() {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const floating = value.trim().length !== 0 || focused || undefined;
  return (
    <>
      <Group justify="space-between" mb={5}>
        {/* <Text component="label" htmlFor="your-password" size="sm" fw={500}>
          Your password
        </Text> */}

      </Group>
      <PasswordInput
          label="Password" 
          id="password"
          required
          classNames={input}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          mt="md"
          autoComplete="nope"
          data-floating={floating}
          labelProps={{ 'data-floating': floating }}
      />
      <Anchor href="#" onClick={(event) => event.preventDefault()} pt={2} fw={500} fz="xs">
        Forgot your password?
      </Anchor>
    </>
  );
}

export default function Login() {
  return (
    <main>
      <div style={{  }} className='animated-grid'>
      <Container size="md" my="xl">
        <Paper withBorder p="lg" radius="md" className='glass-card' shadow="md" style={{backgroundColor: designTokens.colors.glassyBackground}}>
          <Title order={2} mb="md" ff={designTokens.fonts.heading}>
            Login
          </Title>
          
          <Box maw={400} mx="auto" pl={100} pr={100}>
            <div style={{ marginBottom: '10px' }}>
              <FloatingLabelInput
                label="Email"
                placeholder="projectseeker@email.com"
                type="email"
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <ForgotPasswordInput
              />
            </div>
            
            <Box mt="md">
              <Button variant="filled" color="orange" fullWidth>
                Sign In
              </Button>
            </Box>
            <Anchor href="/signup" pt={2} fw={500} fz="xs">
                Don't have an account? Sign up now!
            </Anchor>
          </Box>
        </Paper>
      </Container>
      </div>
    </main>
  );
}
