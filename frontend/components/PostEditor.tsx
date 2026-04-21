"use client";

import { designTokens, theme } from "@/app/GlobalTheme";
import {
  Card,
  Divider,
  Stack,
  TextInput,
  Text,
  Button,
  Group,
  Modal,
  Center,
  Loader,
} from "@mantine/core";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import { IconRocket } from "@tabler/icons-react";
import { API_ENTRYPOINT } from "@/constants/constants";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next/client";
import TagBox from "./TagBox";
import TagComboBox from "./TagComboBox";
import ProjectTag from "./ProjectTag";
import { Post } from "@/types/Post";

const content = "";
const TITLE_LIMIT = 50;
const BODY_LIMIT = 500;

// Posts a project
// Returns the new project's given id
async function postProject(
  title: string,
  body: string,
  author_username: string,
  array_tags: string[]
) {
  const response = await fetch(API_ENTRYPOINT + "/posts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    body: JSON.stringify({
      title,
      body,
      attachments: "",
      likes: [], // default no likes on a post (empty array of usernames)
      array_tags, // put in tags from post
      author_username,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    const error: string = data.error;
    throw new Error(`Error occurred when creating a post: ${error}`);
  }
  const postId: string = data._id;
  return postId;
}
async function editProject(
  title: string,
  body: string,
  array_tags: string[],
  postId: string
) {
  const response = await fetch(API_ENTRYPOINT + "/posts/" + postId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    body: JSON.stringify({
      title,
      body,
      attachments: "",
      array_tags, // put in tags from post
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    const error: string = data.error;
    throw new Error(`Error occurred when creating a post: ${error}`);
  }
  return data;
}

type Prop = {
  originalPost?: Post,
  edit?: boolean,
  setEdit?: (value: boolean) => void
}

export default function PostEditor({ originalPost, edit, setEdit }: Prop) {
  // States for loading and post creation success
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdPostId, setCreatedPostId] = useState<string | null>(originalPost?._id ?? null);
  const [tags, setTags] = useState<string[]>(originalPost?.array_tags ?? []);

  const router = useRouter();

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({
        openOnClick: false, // Prevents the editor from opening the link while typing
        HTMLAttributes: {
          target: "_blank", // Opens in a new tab
          rel: "noopener noreferrer", // Security best practice for external links
        },
      }),
      CharacterCount.configure({
        limit: BODY_LIMIT,
      }),
      Placeholder.configure({
        placeholder: "Tell others what you're working on!",
      }),
    ],
    content,
  });

  useEffect(() => {
    if (editor && originalPost?.body) {
      editor.commands.setContent(originalPost.body);
    }
  }, [editor, originalPost?.body]);
  
  // Title character limit counter
  const [title, setTitle] = useState(originalPost?.title ?? "");

  return (
    <>
      {/* Modals */}
      {/* Loading modal */}
      <Modal
        opened={loading}
        onClose={() => {}}
        withCloseButton={false}
        centered
        padding={"xl"}
      >
        <Center style={{ flexDirection: "column", gap: 10 }}>
          <Loader size="lg" />
          <Text>Posting your project...</Text>
        </Center>
      </Modal>
      {/* Success modal */}
      <Modal
        opened={success}
        onClose={() => setSuccess(false)}
        withCloseButton
        centered
      >
        <Center style={{ flexDirection: "column", gap: 10 }}>
          <Text size="xl">{edit ? "Project Edited!" : "Project Posted!"}</Text>
          <Button
            aria-label="View Your New Post"
            mt={15}
            fullWidth
            // Show the new post on the dynamic route
            onClick={() => {
              setSuccess(false);
              router.push(`/projects/${createdPostId}`);
            }}
          >
            View Your New Post
          </Button>
        </Center>
      </Modal>
      <Card
        style={{
          borderLeft: `8px solid ${designTokens.colors.cardBorder}`,
          borderRadius: designTokens.borderRadius.card,
          padding: designTokens.spacing.cardPadding,
          boxShadow: designTokens.colors.cardShadow,
          background: designTokens.colors.glassyBackground,
          textAlign: "left",
        }}
      >
        <Stack gap={5}>
          <TextInput
            label="Project Title"
            labelProps={{
              style: {
                fontSize: 18,
                fontWeight: "bold",
              },
            }}
            withAsterisk
            description="Give your project a name"
            descriptionProps={{
              style: {
                fontSize: 14,
                paddingBottom: 10,
              },
            }}
            placeholder="My Project"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            maxLength={TITLE_LIMIT}
            size="lg"
            styles={{
              input: {
                fontWeight: "bold",
              },
            }}
            rightSection={
              <Text size="xs" c={title.length == 50 ? "red" : "dimmed"} pr="md">
                {title.length}/{TITLE_LIMIT}
              </Text>
            }
          />
          <Divider my="md" />
          <Stack gap={0}>
            <Text style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                Tags
            </Text>
            <TagComboBox selectedTags={tags} setTags={setTags} color={designTokens.colors.cardBackground}/>
                <div style={{
                    display:"flex", 
                    flexWrap:"wrap",
                    marginTop:"8px",
                    minWidth: 500,
                }}>
                {tags.length === 0 ? (
                    <></>
                ) : (
                    tags.map((tag: string, idx: any) => (
                        <ProjectTag key={tag+idx}
                        tag={tag}
                        isRemovable={true}
                        onRemove={() => setTags(tags.filter((t: string) => t !== tag))}
                        >

                        </ProjectTag>
                    ))
                )}  
                </div>          
          </Stack>
          <Divider my="md" />
          <Stack gap={0}>
            <Group gap={0}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                Description
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "red",
                  marginLeft: 5,
                }}
              >
                *
              </Text>
            </Group>
          </Stack>
          <Text
            c="dimmed"
            style={{
              fontSize: 14,
              paddingBottom: 10,
            }}
          >
            Describe your project
          </Text>
          <div style={{ position: "relative" }}>
            <RichTextEditor editor={editor}>
              <RichTextEditor.Toolbar
                sticky
                stickyOffset="var(--docs-header-height)"
                style={{
                  backgroundColor: designTokens.colors.glassyBackground,
                }}
              >
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Underline />
                  <RichTextEditor.Strikethrough />
                  <RichTextEditor.ClearFormatting />
                  <RichTextEditor.Code />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H1 />
                  <RichTextEditor.H2 />
                  <RichTextEditor.H3 />
                  <RichTextEditor.H4 />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Blockquote />
                  <RichTextEditor.Hr />
                  <RichTextEditor.BulletList />
                  <RichTextEditor.OrderedList />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Link />
                  <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Undo />
                  <RichTextEditor.Redo />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>

              <RichTextEditor.Content
                style={{ backgroundColor: theme.white, minHeight: 300 }}
              />
            </RichTextEditor>
            {/* The Character Counter */}
            {editor && (
              <Text
                size="xs"
                c={
                  editor.storage.characterCount.characters() == BODY_LIMIT
                    ? "red"
                    : "dimmed"
                }
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 15,
                  zIndex: 10,
                  pointerEvents: "none", // Allows clicking "through" the text to the editor
                }}
              >
                {editor.storage.characterCount.characters()} / {BODY_LIMIT}
              </Text>
            )}
          </div>
          <Button
            aria-label="Post Project"
            mt={10}
            style={{
              height: 45,
            }}
            leftSection={<IconRocket />}
            disabled={
              title.length == 0 ||
              editor?.storage.characterCount.characters() == 0
            }
            onClick={async () => {
              const body = editor?.getHTML() || "";
              const author_username = getCookie("username") ?? "Anonymous";

              setLoading(true);
              setSuccess(true); // Show loading modal

              let postId: string;
              try {
                if(edit && originalPost?._id) {
                  // Edit mode
                  const updated = await editProject(title, body, tags, originalPost._id);
                  setCreatedPostId(updated._id);
                  
                  if(setEdit !== undefined) {
                    setEdit(false);
                  }
                }
                else {
                  // Create mode
                  postId = await postProject(title, body, author_username, tags);
                  setCreatedPostId(postId);
                }

                setLoading(false);
                setSuccess(true); // Show success modal
              } catch (e) {
                console.error(e);
              }
            }}
          >
            Post Project
          </Button>
        </Stack>
      </Card>
    </>
  );
}
