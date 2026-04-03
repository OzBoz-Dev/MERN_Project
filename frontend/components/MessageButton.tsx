"use client";

import { designTokens } from "@/app/GlobalTheme";
import { Button } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconSend, IconSendFilled } from "@tabler/icons-react";

export default function MessageButton() {
  const [clicked, toggle] = useToggle([false, true])
  return(
    <Button
    size='md'
    radius='md'
    style={{width: 200, height: 36, padding: 0}}
    justify='center'
    color={designTokens.colors.buttonSecondary} onClick={() => toggle()}>
      {clicked === false ? (
        <>
        <IconSend style = {{verticalAlign: 'middle', marginRight: 6}}/>
        Message
        </>
      ) : (
      <>
        <IconSendFilled style = {{verticalAlign: 'middle', marginRight: 6}}/>
        Messaged
      </>
    )}
    </Button>
  );
}