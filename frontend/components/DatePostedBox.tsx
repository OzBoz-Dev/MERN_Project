import { SetStateAction, useState } from 'react';
import { DatePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';

export default function DatePostedBox() {
  const [value, setValue] = useState<[string | null, string | null]>([null, null]);

  const updateValue = (newValue: SetStateAction<[string | null, string | null]>) => {
    console.log("new value: ", newValue);
    setValue(newValue);
  }
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