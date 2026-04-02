import { Group, PasswordInput, Anchor } from "@mantine/core";
import { useState } from "react";
import input from './FloatingLabelInput.module.css'

export function ForgotPasswordInput() {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const floating = value.trim().length !== 0 || focused || undefined;
  return (
    <>
      <PasswordInput
          label="Password" 
          id="password"
          required
          classNames={input}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          mt="xl"
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