import { Group, PasswordInput, Anchor, PasswordInputProps } from "@mantine/core";
import { useState } from "react";
import input from './FloatingLabelInput.module.css'

export function ForgotPasswordInput( { value, onChange } : PasswordInputProps ) {
  const [focused, setFocused] = useState(false);
  const floating = (value as string).trim().length !== 0 || focused || undefined;
  return (
    <>
      <PasswordInput
          label="Password" 
          id="password"
          required
          classNames={input}
          value={value}
          onChange={onChange}
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