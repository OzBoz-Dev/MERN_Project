import { Avatar } from "@mantine/core";

// 8 solid colors for profile picture
const COLOR_OPTIONS = [
  "#1e40af", 
  "#065f46", 
  "#7f1d1d", 
  "#5b21b6",
  "#92400e", 
  "#9d174d", 
  "#1f2937",
  "#78350f", 
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
                bg={COLOR_OPTIONS[username ? username?.length % 8 : 0]}
                style={{
                  margin: "0 auto",
                  border: 'none'
                }}
                color='white'
              >
                {firstName && lastName
                  ? `${firstName.charAt(0)}${lastName.charAt(0)}`
                  : "UN"}
        </Avatar>
    )
}