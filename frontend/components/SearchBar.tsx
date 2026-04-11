"use client";
import { ActionIcon, Button, TextInput } from "@mantine/core";
import { IconAdjustments, IconSearch } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import AdvancedSettings from "./AdvancedSettings";
import { API_ENTRYPOINT } from "@/constants/constants";
import { Post } from "@/types/Post";
import { title } from "process";


type SearchBarProp = {
    onResults: (posts: Post[]) => void
}

export default function SearchBar({ onResults }: SearchBarProp) {

    const [inputText, setInputText] = useState("");
    const [searchText, setSearchText] = useState("");
    const [byTitle, setByTitle] = useState<any>(null);
    const [byBody, setByBody] = useState<any>(null);
    const searchIcon = <IconSearch size={16} />;
    const [showAdvanced, setShowAdvanced] = useState(false);

useEffect(() => {
    if (searchText.trim()) {
        // api request
        Promise.all([
            fetch(API_ENTRYPOINT + '/posts/title?q=' + encodeURIComponent(searchText)),
            fetch(API_ENTRYPOINT + '/posts/body?q=' + encodeURIComponent(searchText)),
        ]).then(([titleRes, bodyRes]) => {
            return Promise.all([titleRes.json(), bodyRes.json()]);
        }).then(([titleData, bodyData]) => {
            const titlePosts = (Array.isArray(titleData) ? titleData : []).map(post => ({
                id: post._id,
                title: post.title,
                body: post.body,
                author: post.author || 'Unknown',
                likes: post.likes || 0,
                tags: Array.isArray(post.tags) ? post.tags : [],
                datePosted: post.datePosted ? new Date(post.datePosted) : new Date(),
            }));

            const bodyPosts = (Array.isArray(bodyData) ? bodyData : []).map(post => ({
                id: post._id,
                title: post.title,
                body: post.body,
                author: post.author || 'Unknown',
                likes: post.likes || 0,
                tags: Array.isArray(post.tags) ? post.tags : [],
                datePosted: post.datePosted ? new Date(post.datePosted) : new Date(),
            }));

            const mergedPosts = [...titlePosts, ...bodyPosts];
            onResults(mergedPosts);
    }).catch((error) => {
        console.error("search error", error);
        onResults([]);
    });
    }
}, [searchText, onResults]);

return (
    <div style={{width: "100%"}}>
        <div style={{display: "flex", gap: "12px", alignItems:"flex-end"}}>
            <TextInput
            style={{flex: 1}}
            label="Search"
            description="What posts are you looking for?"
            placeholder="ML, DevOps"
            leftSection={searchIcon}
            value={inputText}
            onChange={(e) => setInputText(e.currentTarget.value)}
            onBlur={(e) => setSearchText(e.currentTarget.value.trim())}
            />
            <ActionIcon
                variant="light"
                size={"lg"}
                onClick={() => setShowAdvanced((prev) => !prev)}
            >
                <IconAdjustments />
            </ActionIcon>
        </div>

        {showAdvanced && (
        <div style={{ marginTop: "12px" }}>
            <AdvancedSettings />
        </div>
        )}
    </div>
    

  );
}