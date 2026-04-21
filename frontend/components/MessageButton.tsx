"use client";

import { designTokens } from "@/app/GlobalTheme";
import { Button, Tooltip } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconSend, IconSendFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface Props{
  author_username: string
}

export default function MessageButton({author_username}: Props) {
  const [clicked, toggle] = useToggle([false, true])
  const router = useRouter();

  return(
    <Tooltip label="Send Message">
    <Button
    aria-label="Send Message"
    variant="outline"
    size='sm'
    radius='md'
    justify='center'
    color={designTokens.colors.buttonSecondary} 
    onClick={() => router.push(`/messages?newConvo=true&username=${encodeURIComponent(author_username)}`)}>
        <IconSend/>
    </Button>
    </Tooltip>
  );
}