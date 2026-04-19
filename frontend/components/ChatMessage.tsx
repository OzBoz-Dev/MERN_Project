"use client";

import { useState } from "react";
import { designTokens } from "@/app/GlobalTheme";
import { Divider } from "@mantine/core";
export type Message = {
    _id?: string, // lowkey feels like a big nono but fuck it we ball
    author_username: string,
    createdAt: string,
    content: string,
    isSelf: boolean,
}
export default function ChatMessage({author_username, createdAt, content, isSelf}: Message) {
    const date = new Date(createdAt);
    const [showDate, setShowDate] = useState(false);
    return(
        <div style={{ display: "flex", justifyContent: isSelf ? "flex-end" : "flex-start" }}>
            <div
                style={{
                borderLeft: `8px solid ${isSelf ? designTokens.colors.cardBorderSelf : designTokens.colors.cardBorderOther}`,
                borderRadius: designTokens.borderRadius.card,
                padding: designTokens.spacing.cardPadding,
                margin: "16px 0",
                boxShadow: designTokens.colors.cardShadow,
                background: designTokens.colors.glassyBackground,
                backdropFilter: "blur(7px)",
                minWidth: "50%",
                maxWidth: "70%",
                backgroundColor:designTokens.colors.cardBackground
                }}
            >
                <div
                style={{
                    color: "black",
                    display: "flex",
                    gap: "24px",
                    justifyContent: "flex-start",
                    width: "100%",
                }}
                >
                <span>{author_username !== undefined ? author_username : "User"}</span>
                <Divider my="sm" variant="solid" h="12" style={{ borderColor: "black" }} />
                <span style={{color: "gray"}} onMouseEnter={() => setShowDate(true)} onMouseLeave={() => setShowDate(false)}>{date.toDateString()} {showDate ? date.toLocaleTimeString() : ""}</span>
                </div>
                {content}
            </div>
            </div>
        );
}