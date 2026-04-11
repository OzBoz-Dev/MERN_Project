"use client";
import { ActionIcon, Button, TextInput } from "@mantine/core";
import { IconAdjustments, IconSearch } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import AdvancedSettings from "./AdvancedSettings";
import { API_ENTRYPOINT } from "@/constants/constants";


export default function SearchBar() {

    const [inputText, setInputText] = useState("");
    const [searchText, setSearchText] = useState("");
    const [byTitle, setByTitle] = useState<any>(null);
    const [byBody, setByBody] = useState<any>(null);
    const searchIcon = <IconSearch size={16} />;
    const [showAdvanced, setShowAdvanced] = useState(false);

    useEffect(() => {
        if (searchText.trim()) {
            Promise.all([
                fetch(API_ENTRYPOINT + '/posts/title?q=' + encodeURIComponent(searchText)),
                fetch(API_ENTRYPOINT + '/posts/body?q=' + encodeURIComponent(searchText)),
            ]).then(([titleRes, bodyRes]) => {
                return Promise.all([titleRes.json(), bodyRes.json()]);
            }).then(([titleData, bodyData]) => {
                setByTitle(titleData);
                setByBody(bodyData);

                console.log(byTitle);
                console.log(byBody);
            });
        }
    }, [searchText]);

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