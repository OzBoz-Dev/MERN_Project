import { designTokens } from "@/app/GlobalTheme";
import BookmarkButton from "./BookmarkButton";
import { IconUser } from "@tabler/icons-react";
import TagHolder from "./TagHolder";
import MessageButton from "./MessageButton";
import LikeButton from "./LikeButton";
import ReadFullPostButton from "./ReadFullPostButton";

type Props = {
  id: string;
  postTitle: string;
  user: string;
  postTags: string[];
  description: string;
  timeAgo: string;
};
type FeedProps = {
  dataLength: number;
  hasMore: boolean;
  loader?: object;
  endMessage?: object;
};

export default function ProjectCard({
  id,
  postTitle,
  user,
  postTags,
  description,
  timeAgo,
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
        <h2>{postTitle}</h2>
        <BookmarkButton />
      </div>

      <div
        style={{
          fontSize: "14px",
          color: designTokens.colors.textMuted,
          marginBottom: "8px",
        }}
      >
        Posted by {user} &middot; {timeAgo}
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
      <TagHolder tags={postTags} />
      <p style={{ margin: "0 0 12px", color: "#555" }}>{description}</p>
      <div
        style={{
          display: "flex",
          justifyContent: "right",
          alignItems: "right",
          gap: "16px",
        }}
      >
        <ReadFullPostButton id={id} />
        <MessageButton />
        <LikeButton />
      </div>
    </div>
  );
}
export const defaultProps: FeedProps = {
  dataLength: 20,
  hasMore: true,
  endMessage: <p style={{ textAlign: "center"}}>
    <b>Yay! you have seen it all</b>
  </p>
}
