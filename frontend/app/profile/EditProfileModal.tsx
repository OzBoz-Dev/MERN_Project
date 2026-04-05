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

// Hardcoded tag list for now
const AVAILABLE_TAGS = [
  "react",
  "python",
  "javascript",
  "typescript",
  "node",
  "mongodb",
  "css",
  "html",
];

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
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
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
  const [profilePicture, setProfilePicture] = useState(
    initialData?.profilePicture || COLOR_OPTIONS[0]
  );
  const [selectedTags, setSelectedTags] = useState(
    initialData?.tags || []
  );
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);

  // Filter tags based on input (after 2+ chars)
  const handleTagInputChange = (value: string) => {
    setTagInput(value);
    if (value.length >= 2) {
      const filtered = AVAILABLE_TAGS.filter((tag) =>
        tag.toLowerCase().startsWith(value.toLowerCase())
      );
      setTagSuggestions(filtered);
    } else {
      setTagSuggestions([]);
    }
  };

  // Handle tag selection from dropdown
  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setTagInput("");
      setTagSuggestions([]);
    }
  };

  // Handle tag removal
  const handleTagRemove = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!firstName || !lastName) {
      alert("First name and last name are required!");
      return;
    }

    onSave({
      firstName,
      lastName,
      bio,
      profilePicture,
      tags: selectedTags,
    });

    // Reset form
    setFirstName("");
    setLastName("");
    setBio("");
    setProfilePicture(COLOR_OPTIONS[0]);
    setSelectedTags([]);
    setTagInput("");
    setTagSuggestions([]);
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Edit Profile"
      size="md"
      centered
    >
      <form onSubmit={handleSubmit} style={{ display: "contents" }}>
        {/* First Name */}
        <TextInput
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          placeholder="Enter first name"
        />

        {/* Last Name */}
        <TextInput
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          placeholder="Enter last name"
        />

        {/* Bio */}
        <Textarea
          label="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          autosize
          minRows={3}
        />

        {/* Profile Picture Color */}
        <Text fw={500} mt="md" mb="xs">
          Profile Picture Color
        </Text>
        <Group wrap="wrap" gap="xs" mt="xs">
          {COLOR_OPTIONS.map((color) => (
            <Box
              key={color}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: color,
                cursor: "pointer",
                border: profilePicture === color ? "2px solid #000" : "2px solid transparent",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
              onClick={() => setProfilePicture(color)}
            >
            </Box>
          ))}
        </Group>

        {/* Tags */}
        <Text fw={500} mt="md" mb="xs">
          Tags
        </Text>

        {/* Tag Input with Dropdown */}
        <Group mt="md">
          <TextInput
            value={tagInput}
            onChange={(e) => handleTagInputChange(e.target.value)}
            placeholder="Type to search tags..."
            data-placeholder="Type to search tags..."
          />

          {/* Tag Suggestions Dropdown */}
          {tagSuggestions.length > 0 && (
            <Box
              mt="-1"
              style={{
                position: "absolute",
                zIndex: 10,
                background: "white",
                borderRadius: "4px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                minWidth: 200,
              }}
            >
              {tagSuggestions.map((tag) => (
                <Box
                  key={tag}
                  p="8"
                  style={{
                    cursor: "pointer",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                  onClick={() => handleTagSelect(tag)}
                >
                  <Text size="sm" c="gray">#{tag}</Text>
                </Box>
              ))}
            </Box>
          )}
        </Group>

        {/* Selected Tags Display */}
        {selectedTags.length > 0 && (
          <Group wrap="wrap" mt="md" gap="xs">
            {selectedTags.map((tag) => (
              <Box
                key={tag}
                style={{
                  background: "#dbeafe",
                  color: "#1e40af",
                  padding: "4px 12px",
                  borderRadius: "16px",
                  fontSize: "12px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                #{tag}
                <Box
                  style={{
                    cursor: "pointer",
                    color: "#1e40af",
                    fontWeight: 700,
                  }}
                  onClick={() => handleTagRemove(tag)}
                >
                </Box>
              </Box>
            ))}
          </Group>
        )}

        {/* Divider */}
        <Divider my="md" />

        {/* Action Buttons */}
        <Group justify="flex-end" gap="md">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="filled" color="blue">
            Save Changes
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
