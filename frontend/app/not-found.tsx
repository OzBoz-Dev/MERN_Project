import { Title } from "@mantine/core";
import { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
    title: 'Not Found',
};

export default function globalRedirect(){
    return (
        <div>
            <Title>
                404 Not Found
            </Title>
        </div>
    )
}