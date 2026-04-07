import PostEditor from "@/components/PostEditor";
import { Stack, Text, Divider } from "@mantine/core";

export default function CreateProjectPage() {
    return (
        <Stack gap={5} px={24}>
            <Text size="xl" fw={700}>
                Create a Project
            </Text>
            <Divider my={"md"} />
            <PostEditor />
        </Stack>
    );
}