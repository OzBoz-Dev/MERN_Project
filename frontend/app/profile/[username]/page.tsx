import ProfilePage from "./profile";
import { Metadata } from "next";
import { API_ENTRYPOINT, API_SERVER_ENTRYPOINT } from "@/constants/constants";
import { redirect } from 'next/navigation';
import { cache } from "react";

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  
  try {
        const res = await fetch(`${API_SERVER_ENTRYPOINT}/profile/${username}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            return { title: 'User Not Found' };
        }

        const user = await res.json();
        return {
          title: `${user.username}'s Profile`,
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