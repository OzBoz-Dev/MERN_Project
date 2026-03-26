"use client";

import styles from "./Header.module.css";
import { Flex, Tabs, Text } from "@mantine/core";
import { IconCode, IconHome, IconMessage } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const pathname = usePathname(); // Pathname of the current page
  const router = useRouter();

  // For tab icons
  const iconSize = 18;

  // Tab items w/ name, icon, and path for easy editing
  const tabItems = [
    {
      name: "Feed",
      icon: IconHome,
      path: "/feed",
    },
    {
      name: "My Projects",
      icon: IconCode,
      path: "/my-projects",
    },
    {
      name: "Messages",
      icon: IconMessage,
      path: "/messages",
    },
  ];

  // Determine the current active tab
  // If pathname matches with a tabItem's "path", then this is the active tab
  const activeTab =
    tabItems.find((item) => item.path === pathname)?.name || null;

  // Create a Tab for each tabItem
  const tabs = tabItems.map((tabItem) => {
    const Icon = tabItem.icon;
    return (
      <Tabs.Tab
        key={tabItem.name}
        value={tabItem.name}
        onClick={() => {
          router.push(tabItem.path); // navigate to defined path
        }}
        leftSection={<Icon size={iconSize} />}
      >
        {tabItem.name}
      </Tabs.Tab>
    );
  });

  return (
    // Space between to separate tabs and profile
    <Flex justify={"space-between"} px={10} py={10}>
      {/* Main navigation tabs */}
      <Flex gap="lg">
        {/* Logo */}
        <Text fw={700} size="l">
          Logo
        </Text>
        {/* Default value is the first tab always */}
        <Tabs
          classNames={{ tab: styles.tab }}
          defaultValue={tabItems[0].name}
          value={activeTab} // use active tab for the current tab value
          variant="unstyled"
        >
          <Tabs.List>{tabs}</Tabs.List>
        </Tabs>
      </Flex>
      {/* Profile component will go here */}
      <Text fw={700} size="l">
        Profile
      </Text>
    </Flex>
  );
}
