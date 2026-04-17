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
  Modal,
  TextInput,
  Alert,
} from "@mantine/core";
import ProfileInfoCard from "@/app/profile/ProfileInfoCard";
import EditProfileModal from "@/app/profile/EditProfileModal";
import ProfileActions from "@/app/profile/ProfileActions";
import DeleteAccountModal from "../DeleteAccountModal";
import { designTokens } from "../../GlobalTheme";
import { notFound, useParams } from "next/navigation";
import { API_ENTRYPOINT } from '@/constants/constants'
import { deleteCookie, getCookie, setCookie } from "cookies-next/client";

async function getProfile(username: any){
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
  const res = await fetch(API_ENTRYPOINT+'/profile/' + username, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getCookie('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data
    })
});

  if (!res.ok) {
    throw new Error('Failed to update profile!' + res.status);
  }

  return await res.json();
}

async function deleteAccount(username: string, password: string){
  const res = await fetch(API_ENTRYPOINT+'/profile/'+username, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getCookie('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password: password
    })
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to delete account!' + res.status);
  }

  return await res.json();
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMe, setIsMe] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
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
        if (data.username == getCookie('username')) setIsMe(true);
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
      const updatedUser = await saveProfile(username as string, data);
      if (updatedUser) {
        setProfileData(updatedUser);
        setIsEditing(false);
        setCookie('firstName', data.firstName)
        setCookie('lastName', data.lastName)
      }
    } catch (error) {
      alert("Could not save profile. Please try again"+error);
    }
    finally{
      
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Client-side logout: destroy token and redirect
    deleteCookie('token');
    deleteCookie('firstName');
    deleteCookie('lastName');
    deleteCookie('username');
    // Redirect to auth page
    window.location.href = "/auth";
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setDeleteModalOpen(true);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deletePassword) {
      setDeleteError("Please enter your password");
      return;
    }

    try {
      setDeleteError(null);
      setDeleteSuccess(null);
      setIsDeleting(true);
      
      const updatedUser = await deleteAccount(username as string, deletePassword);
      
      if (updatedUser) {
        setDeleteSuccess("Account deleted successfully!");
        deleteCookie('token');
        deleteCookie('firstName');
        deleteCookie('lastName');
        deleteCookie('username');
        
        // Wait briefly to show success message before redirecting
        setTimeout(() => {
          window.location.href = "/auth";
        }, 2000);
      }
    } catch (error: any) {
      setDeleteError(error.message || "Failed to delete account");
    } finally {
      setDeletePassword("");
      setIsDeleting(false);
    }
  };

  // Handle delete modal close
  const handleDeleteClose = () => {
    setDeletePassword("");
    setDeleteError(null);
    setDeleteSuccess(null);
    setDeleteModalOpen(false);
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
      <Paper withBorder p="lg" w={700} radius="md" className='glass-card' shadow="md" style={{backgroundColor: designTokens.colors.glassyBackground}}>
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
        onOpenDelete={() => {
          setIsEditing(false);
          setDeleteModalOpen(true);
        }}
      />
      <DeleteAccountModal
          opened={deleteModalOpen}
          onClose={handleDeleteClose}
          onConfirm={handleDeleteConfirm}
          loading={isDeleting}
          passwordValue={deletePassword}
          onPasswordChange={setDeletePassword}
          error={deleteError}
          onErrorClose={() => setDeleteError(null)}
          success={deleteSuccess}
          onSuccessClose={() => setDeleteSuccess(null)}
        />
      </Paper>
    </Container>
    </div>
  );
}
