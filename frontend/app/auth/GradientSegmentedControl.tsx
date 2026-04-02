import { SegmentedControlProps, SegmentedControl } from "@mantine/core";
import control from './GradientSegmentedControl.module.css'

export function GradientSegmentedControl({value, onChange, data}: SegmentedControlProps) {
  return (
    <SegmentedControl
      radius="xl"
      size="md"
      data={data}
      value={value}
      classNames={control}
      onChange={onChange}
      fullWidth
    />
  );
}