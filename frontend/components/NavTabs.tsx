"use client";

import styles from "./NavTabs.module.css";
import { Avatar, Box, Flex, Tabs, Text, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCode, IconHome, IconMessage } from "@tabler/icons-react";
import { IconBaguette } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { designTokens, theme } from "@/app/GlobalTheme";
import { getCookie } from "cookies-next/client";
import { BagIcon } from "./BagIcon";

export function NavTabs() {
  const pathname = usePathname(); // Pathname of the current page
  const router = useRouter();

  const hiddenRoutes = ['/auth'];
  if (hiddenRoutes.some(route => pathname.startsWith(route))) {
    return null;
  }

  const [user, setUser] = useState<{ username: string; firstName: string; lastName: string } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Breakpoints for responsive behavior
  const isCompact = useMediaQuery('(max-width: 768px)');   // icon + text → icon only
  const isTiny    = useMediaQuery('(max-width: 400px)');   // shrink logo too

  useEffect(() => {
    setIsMounted(true);
    const username = getCookie('username');
    if (username) {
      setUser({
        username,
        firstName: getCookie('firstName') || "",
        lastName: getCookie('lastName') || "",
      });
    }
  }, []);

  const iconSize = 18;

  // Tab items w/ name, icon, and path for easy editing
  const tabItems = [
    { name: "Home",        icon: IconHome,    path: "/feed"        },
    { name: "My Bag", icon: BagIcon,    path: "/my-bag" },
    { name: "Messages",    icon: IconMessage, path: "/messages"    },
  ];

  // Determine the current active tab
  // If pathname matches with a tabItem's "path", then this is the active tab
  const activeTab =
    tabItems.find((item) => pathname.includes(item.path))?.name || null;

  // Create a Tab for each tabItem
  const tabs = tabItems.map((tabItem) => {
    const Icon = tabItem.icon;
    const tab = (
      <Tabs.Tab
        aria-label={isCompact ? tabItem.name : undefined}
        key={tabItem.name}
        value={tabItem.name}
        onClick={() => router.push(tabItem.path)}
        // On compact screens, remove leftSection and use the icon as the only child
        leftSection={!isCompact ? <Icon size={iconSize} aria-hidden="true"/> : undefined}
        // Tighten padding on small screens so tabs don't overflow
        style={isCompact ? { padding: '8px 10px' } : undefined}
      >
        {isCompact
          ? <Icon size={iconSize} aria-hidden="true" />   // icon only
          : tabItem.name               // icon (leftSection) + text
        }
      </Tabs.Tab>
    );

    // Wrap icon-only tabs in a Tooltip so the label isn't lost
    return isCompact ? (
      <Tooltip key={tabItem.name} label={tabItem.name} position="bottom" withArrow>
        {tab}
      </Tooltip>
    ) : tab;
  });

  return (
    <Flex
      justify={"space-between"}
      px={isTiny ? 6 : 10}
      pt={10}
      w="100%"
      style={{
        position: "fixed",
        zIndex: 1500,
        backgroundColor: theme.white,
        boxShadow: '0px 1px 5px rgba(0,0,0,0.07)'
      }}
    >
      <Flex gap={isCompact ? "xs" : "lg"} align="center">
        {/* Shrink the logo on very small screens */}
        <Link href='/'>
          <Image
            src="/ChipIn-nobg.png"
            alt="ChipIn logo"
            width={isTiny ? 90 : 150}
            height={isTiny ? 30 : 50}
            style={{ objectFit: 'contain' }}
            fetchPriority="high"
          />
        </Link>

        <Tabs
          classNames={{ tab: styles.tab }}
          defaultValue={tabItems[0].name}
          value={activeTab}
          variant="unstyled"
        >
          <Tabs.List style={{ border: 'none', display: 'flex', alignItems: 'stretch', height: '100%' }}>
            {tabs}
          </Tabs.List>
        </Tabs>
      </Flex>

      <div style={{ flex: 1 }} />

      {isMounted && user ? (
        <Tooltip label="View Profile" zIndex={2000}>
          <Link
            href={`/profile/${getCookie('username')}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <UserAvatar
              username={getCookie('username') as string}
              firstName={getCookie('firstName') as string}
              lastName={getCookie('lastName') as string}
              radius="xl"
              size={isCompact ? "sm" : "md"}   // shrink avatar too
            />
          </Link>
        </Tooltip>
      ) : null}
    </Flex>
  );
}