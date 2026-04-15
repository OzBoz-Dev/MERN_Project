import { useState } from 'react';
import { DatePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';

export default function DatePostedBox() {
  const [value, setValue] = useState<[string | null, string | null]>([null, null]);
  return (
    <div>
      <DatePicker 
      type="range" 
      value={value} 
      onChange={setValue}
    />  
    </div>
  );
}