'use client'

import { Center, Box, Progress, Text, Group, PasswordInput, PasswordInputProps } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconX } from "@tabler/icons-react";
import input from './FloatingLabelInput.module.css'
import { useState } from "react";


export function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text component="div" c={meets ? 'teal' : 'red'} mt={5} size="sm">
      <Center inline>
        {meets ? <IconCheck size={14} stroke={1.5} /> : <IconX size={14} stroke={1.5} />}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

interface PasswordStrengthProps extends PasswordInputProps {
  onValidChange?: (valid: boolean) => void;
}

export function PasswordStrength( { value, onChange, onValidChange } : PasswordStrengthProps ) {
  const [focused, setFocused] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const floating = (value as string).trim().length !== 0 || focused || undefined;
  const strength = getStrength(value as string);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    const newStrength = getStrength(e.target.value);
    const passwordsMatch = e.target.value === confirmPassword;
    onValidChange?.(newStrength === 100 && passwordsMatch);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    const newStrength = getStrength(value as string);
    const passwordsMatch = (value as string) === e.target.value;
    onValidChange?.(newStrength === 100 && passwordsMatch);
  };

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value as string)} />
  ));
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ section: { transitionDuration: '0ms' } }}
        value={
          (value as string).length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0
        }
        color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
        key={index}
        size={4}
        aria-label={`Password strength segment ${index + 1}`}
      />
    ));
  function setValue(newval: string): void {
    value = newval;
  }

  const form = useForm({
    mode: 'uncontrolled',
    validate: {
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
    },
  })

   return (
    <>
      <PasswordInput
        value={value}
        onChange={handleChange}
        label="Password"
        key={form.key('password')}
        required
        classNames={input}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        mt="md"
        autoComplete="nope"
        data-floating={floating}
        labelProps={{ 'data-floating': floating }}
      />

      <PasswordInput
        label="Confirm Password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        error={confirmPassword && (value as string) !== confirmPassword ? 'Passwords do not match' : false}
        key={form.key('confirmPassword')}
        required
        classNames={input}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        mt="md"
        autoComplete="nope"
        data-floating={floating}
        labelProps={{ 'data-floating': floating }}
      />

      <Group gap={5} grow mt="xs" mb="md">
        {bars}
      </Group>

      <PasswordRequirement label="Has at least 6 characters" meets={(value as string).length > 5} />
      {checks}
    </>
  );
  }