import { useState } from 'react';
import { DatePicker } from '@mantine/dates';

export default function DatePostedBox() {
  const [value, setValue] = useState<[string | null, string | null]>([null, null]);
  return <DatePicker type="range" value={value} onChange={setValue} />;
}