import React, { HTMLInputTypeAttribute } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { TextInput } from '@mantine/core';
import validation from './InputValidation.module.css';
import floatstyle from './FloatingLabelInput.module.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FloatingLabelProps{
  label: string;
  type: HTMLInputTypeAttribute;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onValidChange?: (valid: boolean) => void;
}

export function InputValidation({value, onChange, onValidChange}: FloatingLabelProps) {
  const [isValid, setIsValid] = React.useState(true);
  const [focused, setFocused] = React.useState(false);
  const floating = (value as string).trim().length !== 0 || focused || undefined;

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  onChange(e);
  onValidChange?.(EMAIL_REGEX.test(e.target.value));
};

const handleBlur = () => {
    setFocused(false);
    if (value.trim().length > 0) {
      const valid = EMAIL_REGEX.test(value)
      setIsValid(valid); // only validate once they leave the field
      onValidChange?.(valid);
    } else {
      setIsValid(true); // reset if they leave it empty
      onValidChange?.(false);
    }
  };

  return (
    <TextInput
      label="Email"
      value={value}
      required
      onChange={handleChange}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
      error={!isValid ? 'Invalid email' : undefined}
      classNames={floatstyle}
      rightSection={!isValid ? <IconAlertTriangle stroke={1.5} size={18} className={validation.icon} /> : undefined}
      data-floating={floating}
      labelProps={{ 'data-floating': floating }}
    />
  );
}