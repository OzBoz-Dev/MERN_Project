"use client";
import { ActionIcon, Button, Collapse, TextInput } from "@mantine/core";
import { IconAdjustments, IconSearch } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import AdvancedSettings from "./AdvancedSettings";
import { API_ENTRYPOINT } from "@/constants/constants";
import { Post } from "@/types/Post";
import { title } from "process";
import { ObjectId } from "bson";


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
        if(searchText.trim() || tags.length > 0) {
            const param = new URLSearchParams();
            param.append("q", searchText);

            tags.forEach(tag => param.append("tags", tag));

            fetch(API_ENTRYPOINT + '/posts/search?' + param.toString())
            .then(res => res.json())
            .then(posts => {
                onResults(posts);
            })
            .catch((error) => {
                console.log("search error found: ", error);
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
        
        <Collapse in={showAdvanced}>
            <div style={{ marginTop: "12px" }}>
                <AdvancedSettings tags={tags} setTags={setTags}/>
            </div>
        </Collapse>
    </div>
    

  );
}