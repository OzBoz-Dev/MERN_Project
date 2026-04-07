'use client'

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Title,
  Text,
  Group,
  Center,
  Button,
  Paper,
  Flex,
  LoadingOverlay,
  Loader,
} from "@mantine/core";
import ProfileInfoCard from "@/app/profile/ProfileInfoCard";
import EditProfileModal from "@/app/profile/EditProfileModal";
import ProfileActions from "@/app/profile/ProfileActions";
import { designTokens } from "../../GlobalTheme";
import { notFound, useParams } from "next/navigation";
import { API_ENTRYPOINT } from '@/constants/constants'

async function getProfile(username: any){
  console.log(username)
  const res = await fetch(API_ENTRYPOINT+'/profile/' + username, {
    cache: 'no-store'
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch user');
  }

  return await res.json();
}

async function saveProfile(username: string, data: any){
  console.log(username)
  const res = await fetch(API_ENTRYPOINT+'/profile/' + username, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: localStorage.getItem('token'),
      ...data
    })
  });

  if (!res.ok) {
    throw new Error('Failed to update profile!' + res.status);
  }

  return await res.json();
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMe, setIsMe] = useState(false);
  const { username } = useParams();

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      try {
        setIsLoading(true);
        const data = await getProfile(username);
        if (!data) {
          window.location.href = '/not-found';
          return;
        }
        setProfileData(data);
        if (username == localStorage.getItem('username')) setIsMe(true);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  // Handle profile save
  const handleSaveProfile = async (data: any) => {
    try {
      setIsLoading(true);
      const updatedUser = await saveProfile(username as string, data);
      if (updatedUser) {
        setProfileData(updatedUser);
        setIsEditing(false);
        localStorage.setItem('firstName', data.firstName)
        localStorage.setItem('lastName', data.lastName)
      }
    } catch (error) {
      alert("Could not save profile. Please try again"+error);
    }
    finally{
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Client-side logout: destroy token and redirect
    localStorage.clear();
    // Redirect to auth page
    window.location.href = "/auth";
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // TODO: Implement soft delete API call
      console.log("Account deletion requested");
      // For now, just show success message
      alert("Account deletion request sent. Check console for details.");
    }
  };

  // Auto-open edit modal if firstName/lastName missing
  const handleAutoEdit = () => {
    if (profileData?.firstName && profileData?.lastName) {
      return;
    }
    setIsEditing(true);
  };

  if (isLoading) {
    return (
      <div className="animated-grid">
      <Container size="lg" py="xl">
        <Center>
          <Loader></Loader>
        </Center>
      </Container>
      </div>
    );
  }

  return (
    <div className="animated-grid">
    <Container size='xl' py="xl">
      <Paper withBorder p="lg" miw={500} radius="md" className='glass-card' shadow="md" style={{backgroundColor: designTokens.colors.glassyBackground}}>
        <Flex direction="column" justify="flex-end" p="sm">
          {isMe? (
          <ProfileActions
            onLogout={handleLogout}
            onEditProfile={() => setIsEditing(true)}
          />
          ) : (
            <></>
          )}
          <ProfileInfoCard
            username = {profileData?.username}
            firstName={profileData?.firstName}
            lastName={profileData?.lastName}
            bio={profileData?.bio}
            profilePicture={profileData?.profilePicture}
            tags={profileData?.tags}
          />
        </Flex>

      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSaveProfile}
        initialData={profileData}
      />
      </Paper>
    </Container>
    </div>
  );
}
