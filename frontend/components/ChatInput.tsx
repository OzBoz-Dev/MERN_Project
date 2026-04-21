"use client";

import { API_SERVER_ENTRYPOINT } from "@/constants/constants";
import { Button, TextInput } from "@mantine/core";
import { IconSendFilled } from "@tabler/icons-react";
import { getCookie } from "cookies-next/client";
import { ParamValue } from "next/dist/server/request/params";
import { useState } from "react";

type Prop = {
    id: ParamValue
}

export default function ChatInput({ id }: Prop) {
    const [msg, setMsg] = useState("");
    const sendMessage = async(content: string) => {
        if(!id || !content.trim()) return; // no content to send

        const token = getCookie("token");

        const result = await fetch(API_SERVER_ENTRYPOINT + '/conversations/' + id + '/messages', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ content }),
        });

        if(!result.ok) {
            throw new Error("Failed to send message");
        }
        else {
            // clean out the message
            setMsg("");
        }
    }
    return (
        <div style = {{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "max(12px, env(safe-area-inset-bottom))",
            width: "min(80%, 1100px)",
            display: "flex",
            gap: 12,
            padding: "10px 12px",
            borderRadius: 10,
            backgroundColor: "#f0f0ff",
            zIndex: 1200
            }}
        >
            <TextInput 
            style={{flex: 1, width:"100%",}}  
            w="100%" 
            placeholder="Send a message!"
            value={msg}
            onChange={(e) => setMsg(e.currentTarget.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter"){
                    sendMessage(msg)
                }
            }}
            />
            <Button aria-label="Send Message" onClick={() => sendMessage(msg)}>
                <IconSendFilled/>
            </Button>
        </div>
    );
}