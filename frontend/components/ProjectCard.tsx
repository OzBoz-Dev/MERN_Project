import { designTokens } from "@/app/GlobalTheme";
import BookmarkButton from "./BookmarkButton";
import { IconUser } from "@tabler/icons-react";
import TagHolder from "./TagHolder";
import MessageButton from "./MessageButton";
import LikeButton from "./LikeButton";
import ReadFullPostButton from "./ReadFullPostButton";
import TimeAgoClient from "./TimeAgoClient";
import { Flex } from "@mantine/core";

type Props = {
  id: string;
  title: string;
  body: string;
  author: string;
  likes: number;
  tags: string[];
  datePosted: Date;
};


export default function ProjectCard({
  id,
  title,
  body,
  author,
  likes,
  tags,
  datePosted,
}: Props) {
  return (
    <div
      style={{
        borderLeft: `8px solid ${designTokens.colors.cardBorder}`,
        borderRadius: designTokens.borderRadius.card,
        padding: designTokens.spacing.cardPadding,
        margin: "16px 0",
        boxShadow: designTokens.colors.cardShadow,
        background: designTokens.colors.glassyBackground,
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>{title}</h2>
        <BookmarkButton />
      </div>

      <div
        style={{
          fontSize: "14px",
          color: designTokens.colors.textMuted,
          marginBottom: "8px",
        }}
      >
        Posted by {author} &middot; {<TimeAgoClient date={datePosted} />}
      </div>

      <div
        style={{
          fontSize: "14px",
          color: designTokens.colors.textMuted,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <IconUser size="20px" /> Looking for:
      </div>
      <TagHolder tags={tags} />
      <p style={{ margin: "0 0 12px", color: "#555" }}>{body}</p>
      <Flex justify={"flex-end"} align={"flex-start"} gap={"16px"}>
        <ReadFullPostButton id={id} />
        <MessageButton />
        <LikeButton likes={likes} />
      </Flex>
    </div>
  );
}
