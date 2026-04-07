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
} from "@mantine/core";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";
import { IconRocket } from "@tabler/icons-react";

const content = "";
const TITLE_LIMIT = 50;
const BODY_LIMIT = 500;

export default function PostEditor() {
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
        placeholder: "Tell others what you're working on!"
      })
    ],
    content,
  });

  // Title character limit counter
  const [title, setTitle] = useState("");

  return (
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
          <RichTextEditor editor={editor} >
            <RichTextEditor.Toolbar
              sticky
              stickyOffset="var(--docs-header-height)"
              style={{ backgroundColor: designTokens.colors.glassyBackground }}
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
          mt={10}
          style={{
            height: 45,
          }}
          leftSection={<IconRocket />}
          disabled={
            title.length == 0 ||
            editor?.storage.characterCount.characters() == 0
          }
          onClick={() => {
            const description = editor?.getHTML() || "";
            console.log("Title:", title);
            console.log("Description:", description);
          }}
        >
          Post Project
        </Button>
      </Stack>
    </Card>
  );
}
