import { Avatar } from "@mantine/core";

// 8 solid colors for profile picture
const COLOR_OPTIONS = [
  "#3b82f6",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#f59e0b",
  "#ec4899",
  "#6b7280",
  "#e9da3d",
];

interface UserAvatarProps{
    username: string
    firstName: string,
    lastName: string,
    radius: string,
    size: string
}

export default function UserAvatar({username, firstName, lastName, radius, size} :UserAvatarProps){
    return (
        <Avatar
                radius={radius}
                size={size}
                style={{
                  background: COLOR_OPTIONS[username ? username?.length % 8 : 0],
                  margin: "0 auto",
                }}
                color="white"
              >
                {firstName && lastName
                  ? `${firstName.charAt(0)}${lastName.charAt(0)}`
                  : "UN"}
        </Avatar>
    )
}