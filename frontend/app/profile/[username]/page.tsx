import ProfilePage from "./profile";
import { Metadata } from "next";
import { API_SERVER_ENTRYPOINT } from "@/constants/constants";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const cookieStore = await cookies();
  const currentUsername = cookieStore.get('username')?.value;
  
  try {
        const res = await fetch(`${API_SERVER_ENTRYPOINT}/profile/${username}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            return { title: 'User Not Found' };
        }

        const user = await res.json();
        const displayName = user.username == currentUsername ? "My" : user.username+"'s";

        return {
          title: `${displayName} Profile`,
        };
    }
    catch (err) {
        // This handles the ECONNREFUSED or other fetch failures
        console.error("Failed to fetch metadata:", err);
        return { title: 'Profile' };
    }
}

export default async function Page({ params }: Props) {
  // Pass the username prop to the client component
  return <ProfilePage />;
}