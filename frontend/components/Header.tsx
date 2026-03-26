'use client';

import styles from "./Header.module.css";
import { Flex, Tabs, Text } from "@mantine/core";
import { IconCode, IconHome, IconMessage } from "@tabler/icons-react";

export function Header() {

    // For tab icons
    const iconSize = 18;

    // Tab items w/ name and icon for easy editing
    const tabItems = [
        {
            "name": "Feed",
            "icon": IconHome
        },
        {
            "name": "My Projects",
            "icon": IconCode
        },
        {
            "name": "Messages",
            "icon": IconMessage
        },
    ];

    const tabs = tabItems.map((tabItem) => {
        const Icon = tabItem.icon;
        return (
            <Tabs.Tab key={tabItem.name} value={tabItem.name} leftSection={<Icon size={iconSize} />}>
                {tabItem.name}
            </Tabs.Tab>
        );
    });

    return (
        // Space between to separate tabs and profile
        <Flex justify={"space-between"} px={10} py={5}>
            {/* Main navigation tabs */}
            <Flex gap="lg">
                {/* Logo */}
                <Text fw={700} size="l">Logo</Text>
                {/* Default value is the first tab always */}
                <Tabs classNames={{tab: styles.tab}} defaultValue={tabItems[0].name} variant="outline">
                    <Tabs.List>
                        {tabs}
                    </Tabs.List>
                </Tabs>
            </Flex>
            {/* Profile component will go here */}
            <Text fw={700} size="l">Profile</Text>
        </Flex>
    );
}