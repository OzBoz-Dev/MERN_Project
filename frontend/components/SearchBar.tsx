"use client";
import { ActionIcon, Button, TextInput } from "@mantine/core";
import { IconAdjustments, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import AdvancedSettings from "./AdvancedSettings";


export default function SearchBar() {
    const searchIcon = <IconSearch size={16} />;
    const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div style={{width: "100%"}}>
        <div style={{display: "flex", gap: "12px", alignItems:"flex-end"}}>
            <TextInput
            style={{flex: 1}}
            label="Search"
            description="What posts are you looking for?"
            placeholder="ML, DevOps"
            leftSection={searchIcon}
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