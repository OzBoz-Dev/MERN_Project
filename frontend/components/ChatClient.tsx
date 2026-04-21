"use client";
// page where the messages actually happen

import ChatMessage, { Message } from "@/components/ChatMessage";
import { API_SERVER_ENTRYPOINT } from "@/constants/constants";
import { Button, ScrollArea } from "@mantine/core";
import { getCookie } from "cookies-next/client";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import ChatInput from "@/components/ChatInput";

export default function ChatClient() {
    const { id } = useParams();
    const userId = getCookie("username");
    const socketRef = useRef<Socket | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        async function fetchConversation() {
            const res = await fetch(API_SERVER_ENTRYPOINT + '/conversations/' + id + '/');
            const data = await res.json();
            setMessages(data.messages || []);
        }
        if (id) fetchConversation();
    }, [id]);

    // connect to client
    useEffect(() => {
        if(!id) return;
        // Initialize socket inside the effect, client-side only
        socketRef.current = io(API_SERVER_ENTRYPOINT);
        const socket = socketRef.current;


        socket.emit("joinConversation", id);

        socket.on("newMessage", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        // clean up
        return () => {
            socket.off("newMessage");
            socket.disconnect();
        };
    }, [id]);

    return (
        <div>
            <ScrollArea style={{ flex: 1, height: "100%"}}>
            {messages.map((msg) => (
                <ChatMessage
                key={msg._id}
                author_username={msg.author_username}
                createdAt={msg.createdAt}
                content={msg.content}
                isSelf={userId === msg.author_username}
                />
            ))}
            </ScrollArea>
            <ChatInput id = { id }/>
        </div>
    );
}