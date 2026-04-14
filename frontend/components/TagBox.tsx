import { ActionIcon, Button, TextInput } from "@mantine/core";
import { IconAdjustments, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import ProjectTag from "./ProjectTag";

type TagBoxProps = {
    tags: string[];
    setTags: (tags: string[]) => void
    label: string;
    description: string;
}

export default function TagBox({ tags, setTags, label, description }: TagBoxProps) {
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
            label={label}
            description={description}
            placeholder="ml, devops"
            leftSection={searchIcon}
            value={input}
            onChange={(e) => setInput(e.target.value.toLowerCase())}
            onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTag();
            }}
            onBlur={() => {
                handleAddTag();
            }}
            />
        </div>
    )
}

async function onChange(){
    
}