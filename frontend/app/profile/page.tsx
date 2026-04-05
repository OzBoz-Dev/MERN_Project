'use client'

import { useState } from "react";
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
} from "@mantine/core";
import ProfileInfoCard from "@/app/profile/ProfileInfoCard";
import EditProfileModal from "@/app/profile/EditProfileModal";
import ProfileActions from "@/app/profile/ProfileActions";
import { designTokens } from "../GlobalTheme";
import { Main } from "next/document";

// Mock API functions for placeholder data
const mockFetchProfile = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        username: "jDoe",
        firstName: "John",
        lastName: "Doe",
        bio: "Software developer passionate about building amazing applications.",
        profilePicture: "#3b82f6",
        tags: ["react", "javascript", "node"],
      });
    }, 1000);
  });
};

const mockUpdateProfile = async (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMe, setIsMe] = useState(true);

  // Fetch profile data on mount
  useState(() => {
    const fetchProfile = async () => {
      try {
        const data = await mockFetchProfile();
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  });

  // Handle profile save
  const handleSaveProfile = async (data: any) => {
    try {
      await mockUpdateProfile(data);
      setProfileData(data);
      setIsEditing(false);
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Client-side logout: destroy token and redirect
    localStorage.removeItem("token");
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
      <Container size="sm" py="xl">
        <Center>
          <Text>Loading profile...</Text>
        </Center>
      </Container>
    );
  }

  return (
    <div className="animated-grid">
    <Container size="sm" py="xl">
      <Paper withBorder p="lg" radius="md" className='glass-card' shadow="md" style={{backgroundColor: designTokens.colors.glassyBackground}}>
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
