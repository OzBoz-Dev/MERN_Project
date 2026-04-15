import { TextInput } from "@mantine/core";
import { HTMLInputTypeAttribute, useState } from "react";
import input from './FloatingLabelInput.module.css'

interface FloatingLabelProps{
  label: string;
  type: HTMLInputTypeAttribute;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FloatingLabelInput({label, type, value, onChange} : FloatingLabelProps) {
  const [focused, setFocused] = useState(false);
  const floating = value.trim().length !== 0 || focused || undefined;

  return (
    <TextInput
      label={label}
      required
      type={type}
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
  );
}