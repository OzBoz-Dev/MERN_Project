'use client';
import {
  CopyButton,
  Button,
  Avatar
} from '@mantine/core'
import { useToggle } from '@mantine/hooks';

import {
  IconBookmark,
  IconBookmarkFilled,
  IconFileCheck,
  IconFileCheckFilled,
  IconHeart,
  IconHeartFilled,
  IconSend,
  IconSendFilled,
  IconUser
} from '@tabler/icons-react'

export const designTokens = {
  colors: {
    cardBackground: "#FFFEFB",
    cardBorder: "#ffe082", // yellow border highlight
    cardShadow: "0 2px 8px rgba(0,0,0,0.05)",
    tagBackground: "#f0f0ff", // light purple/blue for tags
    tagText: "#4b4be6",       // blue for tag text
    tagBackgroundAlt: "#eee", // fallback neutral tag background
    tagTextAlt: "#555",       // fallback neutral tag text
    textPrimary: "#2d3748",   // main text
    textSecondary: "#666",    // secondary text
    textMuted: "#999",        // muted/metadata
    buttonPrimary: "#ffa500", // orange for "Express Interest"
    buttonPrimaryText: "#fff",
    buttonSecondary: "#b9b9b9", // for "Message"
    buttonSecondaryText: "#2d3748",
    buttonTertiary: "#e3e8f0",
    buttonTertiaryPress: "#606265",
    badgeBackground: "#f0f0ff",
    badgeText: "#4b4be6",
  },
  fonts: {
    heading: "'Montserrat', 'Arial', sans-serif",
    body: "'Inter', 'Arial', sans-serif",
    fontWeightHeading: 700,
    fontWeightBody: 400,
    fontStyleHeading: "italic", // for the card title
    fontSizeTag: "12px",
    fontSizeBody: "16px",
    fontSizeMeta: "14px",
  },
  borderRadius: {
    card: "12px",
    tag: "8px",
    button: "6px",
  },
  spacing: {
    cardPadding: "24px",
    tagPadding: "4px 12px",
    tagMarginRight: "8px",
  }
};
function BookmarkButton() {
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
function MessageButton() {
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
function LikeButton() {
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
function TagComponent({tag}: {tag: string}) {
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
function TagHolder({tags}: {tags: string[]}) {
  return (
    <div style={{ display: "flex", alignItems: "left" }}>
      {tags.map((tag, idx) => (
        <TagComponent tag={tag} key={idx}/>
      ))}
    </div>
  );

}
function PostComponent({postTitle, user, postTags, description, timeAgo}: 
  {
    postTitle: string, 
    user: string, 
    postTags: string[],
    description: string,
    timeAgo: string
  }
) {
  return (
    <div style={{
      borderLeft: `8px solid ${designTokens.colors.cardBorder}`,
      borderRadius: designTokens.borderRadius.card,
      padding: designTokens.spacing.cardPadding,
      margin: "16px 0",
      boxShadow: designTokens.colors.cardShadow,
      background: designTokens.colors.cardBackground,
      position: 'relative'
    }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>{postTitle}</h2>
        <BookmarkButton />
      </div>

      <div style={{ fontSize: "14px", color: designTokens.colors.textMuted, marginBottom: "8px" }}>
        Posted by {user} &middot; {timeAgo}
      </div>

      <div style={{ fontSize: "14px", color: designTokens.colors.textMuted, display: "flex", alignItems:"center", gap: "8px"}}>
        <IconUser size="20px"/> Looking for:
      </div>
      <TagHolder tags={postTags}/>
      <p style={{ margin: "0 0 12px", color: "#555" }}>
        {description}
      </p>
      <div style={{ display: "flex", justifyContent:"right", alignItems: "right", gap:"16px"}}>
        <MessageButton/>
        <LikeButton/>
      </div>
    </div>
    );
}

export default function Home() {
  return (
    <main style={{
      display: "flex",
      flexDirection:"column",
      alignItems: "center"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "900px",
        padding: "0 16px"
      }}>
        <PostComponent 
        postTitle='title' 
        user='del0m_' 
        postTags={['ML developer', 'DevOps']}
        description='the quick brown fox jumped over the lazy dog'
        timeAgo='2 hours ago'/>
        <PostComponent 
        postTitle='title' 
        user='del0m_' 
        postTags={['ML developer', 'DevOps']}
        description='the quick brown fox jumped over the lazy dog'
        timeAgo='2 hours ago'/>
        
      </div>
      Hello World.
    </main>
  );
}
