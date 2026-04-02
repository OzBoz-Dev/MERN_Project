'use client'

import { Container, Box, Title, Paper, Button } from '@mantine/core';
import { useState } from 'react';
import { designTokens } from '../GlobalTheme';
import '../globals.css'
import { PasswordStrength } from './PasswordStrength';
import { ForgotPasswordInput } from './ForgotPasswordInput';
import { FloatingLabelInput } from './FloatingLabelInput';
import { GradientSegmentedControl } from './GradientSegmentedControl';

export default function Auth() {
  const[type, setType] = useState('Log In');
  return (
    <main>
      <div style={{  }} className='animated-grid'>
      <Container size="md" my="xl">
        <Paper withBorder p="lg" radius="md" className='glass-card' shadow="md" style={{backgroundColor: designTokens.colors.glassyBackground}}>
          <GradientSegmentedControl value={type} onChange={setType} data={["Log In", "Sign Up"]}/>
          <br></br>
          <Title order={1} mb="xl" ff={designTokens.fonts.heading} style={{textAlign: 'center'}}>
            {type === 'Log In' ? 'Welcome Back' : 'Create Account'}
          </Title>
          <Box maw={400} mx="auto" pl={100} pr={100}>
            <div style={{ marginBottom: '10px' }}>
              {type === 'Log In' ? (
              <FloatingLabelInput
                label="Email"
                type="email"
              />
              ) : (
              <FloatingLabelInput
                label="Email"
                type="email"
              />
              )}
            </div>
            <div style={{ marginBottom: '20px' }}>
              {type === 'Log In' ? (
              <ForgotPasswordInput/>
              ) : (
              <PasswordStrength/>
              )}
            </div>
            
            <Box mt="md">
              <Button variant="filled" color="orange" fullWidth>
                {type === 'Log In' ? 'Sign In' : 'Create Account'}
              </Button>
            </Box>
            {/* <Anchor href="/signup" pt={2} fw={500} fz="xs">
                Don't have an account? Sign up now!
            </Anchor> */}
          </Box>
        </Paper>
      </Container>
      </div>
    </main>
  );
}
