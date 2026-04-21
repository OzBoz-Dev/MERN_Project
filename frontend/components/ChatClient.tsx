"use client";
// page where the messages actually happen

import ChatMessage, { Message } from "@/components/ChatMessage";
import { API_ENTRYPOINT } from "@/constants/constants";
import { Affix, Box, Button, Divider, Group, Paper, ScrollArea, Text, Transition } from "@mantine/core";
import { getCookie } from "cookies-next/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import ChatInput from "@/components/ChatInput";
import { designTokens } from "@/app/GlobalTheme";
import { IconArrowDown, IconArrowLeft, IconArrowUp } from "@tabler/icons-react";
import { useWindowScroll } from "@mantine/hooks";

export default function ChatClient() {

    const { id } = useParams();
    const my_username = getCookie("username");
    const socketRef = useRef<Socket | null>(null);
    const viewport = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const notMe = users.find(user => user !== my_username)
    const [scroll, scrollTo] = useWindowScroll();
    const [dataLoaded, setDataLoaded] = useState(false);

    const router = useRouter();

    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
        // Suppress document scroll
        document.body.style.overflow = "hidden";
        // Cleanup to restore it when leaving the chat
        return () => {
        document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
    if (dataLoaded) {
        const timeout = setTimeout(scrollToBottom, 1000);
        return () => clearTimeout(timeout);
    }
}, [dataLoaded]);

    const handleScroll = (position: { x: number; y: number }) => {
        if (viewport.current) {
            const { scrollHeight, clientHeight } = viewport.current;
            // Show button
            setShowScrollButton(position.y < scrollHeight - clientHeight - 200);
        }
    };

    // Logic to jump to bottom of the ScrollArea
    const scrollToBottom = () => {
        viewport.current?.scrollTo({ 
            top: viewport.current.scrollHeight, 
            behavior: 'smooth' 
        });
    };

    // Helper for Date Dividers
    const getDateLabel = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return "Today";
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
        return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
    };

    useEffect(() => {
        window.scrollTo(0,0);
        async function fetchConversation() {
            const res = await fetch(API_ENTRYPOINT + '/conversations/' + id + '/');
            const data = await res.json();
            setMessages(data.messages || []);
            setUsers(data.member_usernames || []);
            setTimeout(() => {
                setDataLoaded(true);
                scrollToBottom();
            }, 100);
        }
        if (id) fetchConversation();
    }, [id]);

    // connect to client
    useEffect(() => {
        if(!id) return;

        const socketURL = API_ENTRYPOINT.replace('/api', '');

        socketRef.current = io(socketURL, {
            path: "/socket.io/",
            transports: ["websocket"],
            withCredentials: true,
            reconnection: true
        });
        const socket = socketRef.current;

        socket.on("connect", () => {
            socket.emit("joinConversation", String(id)); 
        });

        socket.on("newMessage", (message) => {
            setMessages((prev) => [...prev, message]);
            if (!showScrollButton) { // Scroll on new msg
                setTimeout(scrollToBottom, 100);
            }
        });

        // clean up
        return () => {
            socket.off("newMessage");
            socket.off("connect");
            socket.disconnect();
        };
    }, [id, showScrollButton]);

    return (
            <Paper
              withBorder
              p="xl"
              w='80vw'
            //   px={10}
              h='85vh'
              radius="md"
              className="glass-card"
              shadow="md"
              style={{ 
                backgroundColor: designTokens.colors.glassyBackground,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
            <Affix position={{ bottom: 20, right: 10 }}>
                  <Transition transition="slide-up" mounted={showScrollButton}>
                    {(transitionStyles) => (
                      <Button
                        aria-label="Jump to latest"
                        style={transitionStyles}
                        leftSection={<IconArrowDown size={16}/>}
                        onClick={scrollToBottom}
                        radius='xl'
                      >
                        Latest
                      </Button>
                    )}
                  </Transition>
            </Affix>
            <Group gap='md' mb='md'>
            <Button variant="transparent" size="xs" onClick={() => {router.push('/messages')}}>
                <IconArrowLeft/>
            </Button>
            <Text fw={700} size="xl">
                {users.length == 2
                  ? notMe
                  : `${notMe} & ${users.length - 1} more`}
            </Text>
            </Group>
            <Divider/>
            <ScrollArea 
                style={{ flex: 1 }}
                viewportRef={viewport}
                onScrollPositionChange={handleScroll}
                type="auto"
                offsetScrollbars
                styles={{ viewport: { overflowX: 'hidden' } }}
            >
            <Box pr="xl" py="md"
                style={{ 
                    overflowX: 'hidden', // Kill horizontal spill from animations
                    width: '100%'        // Force it to stay within bounds
                }}    
            >
            {messages.map((msg, index) => {
            const isSelf = my_username === msg.author_username;
            const currentDate = new Date(msg.createdAt).toDateString();
            const prevDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
            const showDivider = currentDate !== prevDate;
            return (
                <div key={msg._id || index}>
                    {showDivider && (
                    <Divider 
                        my="xl" 
                        label={getDateLabel(msg.createdAt)} 
                        labelPosition="center" 
                    />
                )}
                <Transition
                    key={msg._id || index}
                    mounted={dataLoaded}
                    transition={isSelf ? "slide-left" : "slide-right"}
                    duration={300}
                    timingFunction="ease"
                    enterDelay={index * 30} 
                >
                    {(styles) => (
                        <div style={styles}>
                <ChatMessage
                key={msg._id}
                author_username={msg.author_username}
                createdAt={msg.createdAt}
                content={msg.content}
                isSelf={my_username === msg.author_username}
                />
                </div>
                    )}
                    </Transition>
                </div>
            )})}
            </Box>
            </ScrollArea>
            <Divider mb={10}/>
            <ChatInput id = { id }/>
        </Paper>
    );
}