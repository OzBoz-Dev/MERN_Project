import { designTokens } from "@/app/GlobalTheme";
import { Button } from "@mantine/core";

export default function ProjectTag({tag}: {tag: string}) {
  return (
    <Button 
    variant="light"
    size='xs'
      style={{
        background: designTokens.colors.tagBackground,
        color: designTokens.colors.tagText,
        padding: designTokens.spacing.tagPadding,
        borderRadius: designTokens.borderRadius.tag,
        fontSize: designTokens.fonts.fontSizeTag,
        marginRight: designTokens.spacing.tagMarginRight,
        cursor:"pointer"
      }}
      onClick={() => console.log(`tag pressed ${tag}`)}
    >
      {tag}
    </Button>
  );
}