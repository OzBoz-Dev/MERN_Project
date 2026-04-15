import { useState } from "react";
import {
  Modal,
  TextInput,
  Textarea,
  Text,
  Group,
  Button,
  Box,
  Divider,
} from "@mantine/core";
import TagBox from "@/components/TagBox";
import ProjectTag from "@/components/ProjectTag";
import TagComboBox from "@/components/TagComboBox";
import { designTokens } from "../GlobalTheme";

// 8 solid colors for profile picture
const COLOR_OPTIONS = [
  "#3b82f6",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#f59e0b",
  "#ec4899",
  "#6b7280",
  "#ffffff",
];

export default function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  onOpenDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onOpenDelete: () => void;
  initialData?: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    profilePicture?: string;
    tags?: string[];
  };
}) {
  const [firstName, setFirstName] = useState(initialData?.firstName || "");
  const [lastName, setLastName] = useState(initialData?.lastName || "");
  const [bio, setBio] = useState(initialData?.bio || "");
  const [tags, setTags] = useState(
    initialData?.tags || []
  );
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);

  // Handle form submission
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!firstName || !lastName) {
      alert("First name and last name are required!");
      return;
    }

    const updatedData = {
      firstName,
      lastName,
      bio,
      tags: tags,
    };

    console.log(tags);

    await onSave(updatedData);

    onClose();
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      zIndex={3000}
      title="Edit Profile"
      styles={{
        title: {fontWeight: 700},
        content: {
          backgroundColor: designTokens.colors.cardBackground
        },
        header: {
          backgroundColor: designTokens.colors.cardBackground
        },
        inner: {
          paddingTop: '10px'
        }
      }}
      size="lg"
      centered
    >
      <form onSubmit={handleSubmit} style={{ display: "contents" }} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault();}}>
        {/* First Name */}
        <TextInput
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          placeholder="Enter first name"
          styles={{
            input: {
              backgroundColor: designTokens.colors.cardBackground
            }
          }}
        />

        {/* Last Name */}
        <TextInput
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          placeholder="Enter last name"
          styles={{
            input: {
              backgroundColor: designTokens.colors.cardBackground
            }
          }}
        />

        {/* Bio */}
        <Textarea
          label="Bio"
          value={bio}
          maxLength={300}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          description={bio.length + "/300"}
          autosize
          minRows={3}
          styles={{
            input: {
              backgroundColor: designTokens.colors.cardBackground
            }
          }}
        />
        
        <TagComboBox
          setTags={setTags}
          selectedTags={tags}
          color="designTokens.colors.cardBackground"
        />

        <div style={{
          display:"flex", 
          flexWrap:"wrap",
          marginTop:"8px",
        }}>
        {tags.length === 0 ? (
        <></>
        ) : (
          tags.map((tag, idx) => (
            <ProjectTag key={tag+idx}
              tag={tag}
              isRemovable={true}
              onRemove={() => setTags(tags.filter(t => t !== tag))}
              >
            </ProjectTag>
          ))
        )}
        </div>

        {/* Divider */}
        <Divider my="md" />

        {/* Action Buttons */}
        <Group justify="space-between" gap="md">
          <Button 
            variant="filled" color="red" onClick={onOpenDelete}
          >
            Delete Account
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="filled" color="orange">
            Save Changes
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
