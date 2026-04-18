import { designTokens } from "@/app/GlobalTheme";
import BookmarkButton from "./BookmarkButton";
import { IconUser } from "@tabler/icons-react";
import TagHolder from "./TagHolder";
import MessageButton from "./MessageButton";
import LikeButton from "./LikeButton";
import ReadFullPostButton from "./ReadFullPostButton";
import TimeAgoClient from "./TimeAgoClient";
import { Flex, NavLink } from "@mantine/core";
import { getCookie } from "cookies-next/client";
import Link from "next/link";

type Props = {
  id: string;
  title: string;
  body: string;
  author: string;
  likes: string[];
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
  const plainBody = body
    .replace(/<[^>]*>/g, " ")   // remove HTML tags
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const preview =
    plainBody.length > 70 ? `${plainBody.slice(0, 70).trimEnd()}...` : plainBody;
  return (
    <div
      style={{
        borderLeft: `8px solid ${designTokens.colors.cardBorder}`,
        borderRadius: designTokens.borderRadius.card,
        padding: designTokens.spacing.cardPadding,
        margin: "16px 0",
        boxShadow: designTokens.colors.cardShadow,
        background: designTokens.colors.glassyBackground,
        backdropFilter: "blur(7px)",
        position: "relative"
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
        <LikeButton
          likes={likes.length}
          postId={id}
          likedBy={likes}
        />
      </div>

      <div
        style={{
          fontSize: "14px",
          color: designTokens.colors.textMuted,
          marginBottom: "8px",
        }}
      >
        Posted by <Link href={`/profile/${author}`} style={{color: 'orange'}}>{author}</Link> &middot; {<TimeAgoClient date={datePosted} />}
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
      {tags ? 
      <TagHolder tags={tags} /> : <>No Tags</>
      }

      <p style={{ margin: "0 0 12px", color: "#555" }}>{preview}</p>
      <Flex justify={"flex-end"} align={"flex-start"} gap={"16px"}>
        <ReadFullPostButton id={id} />
        <MessageButton />
      </Flex>
    </div>
  );
}
