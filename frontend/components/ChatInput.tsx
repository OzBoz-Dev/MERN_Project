"use client";

import { API_ENTRYPOINT } from "@/constants/constants";
import { Affix, Button, Group, TextInput } from "@mantine/core";
import { IconArrowDown, IconSendFilled } from "@tabler/icons-react";
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

        const result = await fetch(API_ENTRYPOINT + '/conversations/' + id + '/messages', {
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
        <Group mb={-20}>
            <TextInput 
            style={{flex: 1, width:"100%", border: '10px'}}  
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
        </Group>
    );
}