import { ActionIcon, Button, TextInput } from "@mantine/core";
import { IconAdjustments, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import ProjectTag from "./ProjectTag";

type TagBoxProps = {
    tags: string[];
    setTags: (tags: string[]) => void
}
export default function TagBox({ tags, setTags }: TagBoxProps) {
    const searchIcon = <IconSearch size={16} />;
    const [input, setInput] = useState("");
    
    const handleAddTag = () => {
        if (input.trim() && !tags.includes(input.trim())) {
            setTags([...tags, input.trim()]);
            setInput("");
        }
    }

    return (
        <div>
            <TextInput
            label="Search"
            description="What posts are you looking for?"
            placeholder="ML, DevOps"
            leftSection={searchIcon}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTag();
            }}
            />
        </div>
    )
}