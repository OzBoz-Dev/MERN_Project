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
    const [tags, setTags] = useState<string[]>([]);

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
                likes: Array.isArray(post.likes) ? post.likes : [],
                array_tags_id: Array.isArray(post.tags) ? post.tags : [],
                attachments: post.attachments || '',
                author_username: post.author || 'Unknown',
                datePosted: post.datePosted ? new Date(post.datePosted) : new Date(),
            }));

            const bodyPosts = (Array.isArray(bodyData) ? bodyData : []).map(post => ({
                id: post._id,
                title: post.title,
                body: post.body,
                author: post.author || 'Unknown',
                likes: Array.isArray(post.likes) ? post.likes : [],
                array_tags_id: Array.isArray(post.tags) ? post.tags : [],
                attachments: post.attachments || '',
                author_username: post.author || 'Unknown',
                datePosted: post.datePosted ? new Date(post.datePosted) : new Date(),
            }));

            // include tags that are also in the search
            const mergedPosts = [...titlePosts, ...bodyPosts];

            const filteredPosts = tags.length === 0
            ? mergedPosts :
            mergedPosts.filter(post =>
                Array.isArray(post.array_tags_id) && 
                tags.every(tag => post.array_tags_id.includes(tag))
            )

            onResults(filteredPosts);


    }).catch((error) => {
        console.error("search error", error);
        onResults([]);
    });
    }
}, [searchText, tags, onResults]);

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
            onKeyDown={(e) => {
                if(e.key === "Enter") {
                    setSearchText(e.currentTarget.value.trim());
                }
            }}
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
            <AdvancedSettings tags={tags} setTags={setTags}/>
        </div>
        )}
    </div>
    

  );
}