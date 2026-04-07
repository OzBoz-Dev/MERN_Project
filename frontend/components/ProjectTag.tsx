import { designTokens } from "@/app/GlobalTheme";
import { ActionIcon, Badge, Button, Chip } from "@mantine/core";
import { IconX } from "@tabler/icons-react";


type ProjectTagProp = {
  tag: string,
  isRemovable?: boolean
  onRemove?: () => void
}
export default function ProjectTag({tag, isRemovable, onRemove}: ProjectTagProp) {
  return (
    <Button 
    variant="light"
    size='s'
      style={{
        background: designTokens.colors.tagBackground,
        color: designTokens.colors.tagText,
        padding: designTokens.spacing.tagPadding,
        borderRadius: designTokens.borderRadius.tag,
        fontSize: designTokens.fonts.fontSizeTag,
        marginRight: designTokens.spacing.tagMarginRight,
        cursor:"pointer",
        display:"inline-flex",
        alignItems: "center",
      }}
      onClick={isRemovable ? (e => {
          e.stopPropagation(); // prevents parent on click
          onRemove && onRemove();
        }
      ) : undefined}
      
    >
      {tag}
    </Button>
  );
}