"use client";

import { useState } from "react";
import { designTokens } from "@/app/GlobalTheme";
import { Text, Box } from "@mantine/core";

export type Message = {
    _id?: string,
    author_username: string,
    createdAt: string, // ISO String
    content: string,
    isSelf: boolean,
}

export default function ChatMessage({ author_username, createdAt, content, isSelf }: Message) {
    const date = new Date(createdAt);
    const [isHovered, setIsHovered] = useState(false);

    // Format: 2:30 PM
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // Format: Tuesday, April 21, 2026
    const fullDateString = date.toLocaleDateString([], { dateStyle: 'full' });

    return (
        <Box 
            style={{ 
                display: "flex", 
                flexDirection: "column",
                alignItems: isSelf ? "flex-end" : "flex-start",
                margin: "8px 0" 
            }}
        >
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    borderRadius: designTokens.borderRadius.card,
                    padding: "12px 16px",
                    boxShadow: designTokens.colors.cardShadow,
                    backdropFilter: "blur(7px)",
                    maxWidth: "75%",
                    minWidth: "120px",
                    // Dynamic background logic for better contrast
                    backgroundColor: isSelf 
                        ? 'orange'
                        : 'white',
                    border: `1px solid ${isSelf ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    position: "relative"
                }}
            >
                {/* Header: Author and Time */}
                <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "baseline",
                    gap: "12px",
                    marginBottom: "4px"
                }}>
                    <Text size="xs" fw={700} style={{ 
                        color: isSelf ? "#fff" : "orange",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase"
                    }}>
                        {author_username || "User"}
                    </Text>
                    
                    <Text 
                        size="xs" 
                        style={{ color: isSelf ? "rgba(255,255,255,0.6)" : "gray", cursor: "help" }}
                        title={fullDateString}
                    >
                        {timeString}
                    </Text>
                </div>

                {/* Message Body */}
                <Text size="sm" style={{ 
                    color: isSelf ? "white" : "black",
                    lineHeight: "1.4",
                    wordBreak: "break-word"
                }}>
                    {content}
                </Text>

                {/* Hover Date Tooltip (Optional since we use 'title' attribute above) */}
                {isHovered && (
                    <div style={{
                        position: "absolute",
                        bottom: "-20px",
                        left: isSelf ? "auto" : "0",
                        right: isSelf ? "0" : "auto",
                        fontSize: "10px",
                        color: "gray",
                        zIndex: 10
                    }}>
                        {fullDateString}
                    </div>
                )}
            </div>
        </Box>
    );
}