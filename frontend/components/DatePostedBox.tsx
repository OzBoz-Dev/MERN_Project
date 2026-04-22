import { SetStateAction, useState } from 'react';
import { DatePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';

type Props = {
  value: [string | null, string | null];
  onChange: (value: [string | null, string | null]) => void;
};

export default function DatePostedBox({value, onChange}: Props) {

  return (
    <div>
      <DatePicker 
      type="range" 
      value={value} 
      onChange={onChange}
    />  
    </div>
  );
}