"use client";

import { designTokens } from "@/app/GlobalTheme";
import { Button } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

export default function LikeButton() {
  const [clicked, toggle] = useToggle([false, true])
  return(
    <Button
    size='md'
    radius='md'
    style={{width: 40, height: 36, padding: 0}}
    justify='center'
    color={designTokens.colors.buttonPrimary}
    onClick={() => toggle()}>
      {clicked === false ? (
        <>
        <IconHeart style = {{verticalAlign: 'center', marginRight: 0}}/>
        </>
      ) : (
      <>
        <IconHeartFilled style = {{verticalAlign: 'center', marginRight: 0}}/>
      </>
    )}
    </Button>
  );
}