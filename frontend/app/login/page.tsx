'use client'

import { IconAlertTriangle } from '@tabler/icons-react';
import { TextInput, Container, Box, Title, Paper, Button } from '@mantine/core';
import input from './FloatingLabelInput.module.css';
import { HTMLInputTypeAttribute, useState } from 'react';

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

export default function Login() {
  return (
    <main>
      <Container size="sm" my="xl">
        <Paper withBorder p="lg" radius="md">
          <Title order={2} mb="md">
            Login
          </Title>
          
          <Box maw={400} mx="auto">
            <FloatingLabelInput 
              label="Email"
              placeholder="projectseeker@email.com"
              type="email"
            />
            
            <FloatingLabelInput
              label="Password"
              type="password"
              placeholder="Enter your password"
            />
            
            <Box mt="md">
              <Button variant="filled" color="blue" fullWidth>
                Sign In
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </main>
  );
}
