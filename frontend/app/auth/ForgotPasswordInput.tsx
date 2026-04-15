import { Group, PasswordInput, Anchor, PasswordInputProps } from "@mantine/core";
import { MouseEventHandler, useState } from "react";
import input from './FloatingLabelInput.module.css'

interface ForgotPasswordInputProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onClick: MouseEventHandler<HTMLAnchorElement>;
}

export function ForgotPasswordInput( { value, onChange, onClick } : ForgotPasswordInputProps ) {
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
      <Anchor onClick={onClick} pt={2} fw={500} fz="xs">
        Forgot your password?
      </Anchor>
    </>
  );
}