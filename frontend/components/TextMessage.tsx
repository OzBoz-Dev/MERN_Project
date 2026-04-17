"use client";

import { useState } from "react";
import { designTokens } from "@/app/GlobalTheme";
import { Divider } from "@mantine/core";
type Prop = {
    author: string,
    timeStamp: Date,
    message: string
}
export default function TextMessage({author, timeStamp, message}: Prop) {
    const [showDate, setShowDate] = useState(false);
    return(
        <div style={{
            borderLeft: `8px solid ${designTokens.colors.cardBorder}`,
            borderRadius: designTokens.borderRadius.card,
            padding: designTokens.spacing.cardPadding,
            margin: "16px 0",
            boxShadow: designTokens.colors.cardShadow,
            background: designTokens.colors.glassyBackground,
            backdropFilter: "blur(7px)",
        }}>
            <div style={{
                color: "black",
                display:"flex",
                width:"80%",
                gap:"24px",
            }}>
                <span>{author}</span>
                <Divider my="sm" variant="solid" h="12" style={{borderColor:"black"}}/>                    
                <span style={{color: "gray"}} onMouseEnter={() => setShowDate(true)} onMouseLeave={() => setShowDate(false)}>{timeStamp.toDateString()} {showDate ? timeStamp.toLocaleTimeString() : ""}</span>
            </div>
            {message}
        </div>

    );
}