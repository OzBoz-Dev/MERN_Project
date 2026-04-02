import { TextInput } from "@mantine/core";
import { HTMLInputTypeAttribute, useState } from "react";
import input from './FloatingLabelInput.module.css'

interface FloatingLabelProps{
  label: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
}

export function FloatingLabelInput({label, placeholder, type} : FloatingLabelProps) {
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