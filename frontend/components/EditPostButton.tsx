"use client";

import { designTokens } from "@/app/GlobalTheme";
import { Button, Container } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { getCookie } from "cookies-next/client";

type Prop = {
  edit: boolean;
  setEdit: (value: boolean) => void;
};


export default function EditButton({edit, setEdit}: Prop) {
    return (
        <Button
            size="md"
            radius="md"
            style={{ width: 40, height: 36, padding: 0 }}
            color={designTokens.colors.buttonPrimary}

            title = {
                getCookie("username") != undefined ? 
                "Edit" : 
                "This is not your post!"
            }

            onClick={() => setEdit(!edit)}
            
        >
            <IconPencil style={{ verticalAlign: "center" }} />
        </Button>
    );
}



