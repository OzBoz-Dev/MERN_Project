"use client";

import { designTokens } from "@/app/GlobalTheme";
import { Button } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";

export default function BookmarkButton() {
  const [color, toggle] = useToggle([designTokens.colors.buttonTertiary, designTokens.colors.buttonTertiaryPress])
  return (
        <Button 
        size='sm'
        radius='md'
        style={{width: 36, height: 36, padding: 0}}
        justify='center'
        color={color} onClick={() => toggle()}>
          {color === designTokens.colors.buttonTertiaryPress ? <IconBookmarkFilled /> : <IconBookmark />}
        </Button>
  );
}