import Button from "@/src/components/button";
import TextArea from "@/src/components/textarea";
import { useAuth } from "@/src/hooks/useAuth";
import { apiCreatePost } from "@/src/http/posts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";

export default function Screen() {
  const { user } = useAuth();
  const [content, setContent] = useState("");

  const router = useRouter();

  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: apiCreatePost,
    onSuccess: () => {
      Alert.alert("Done.");
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      setContent("");
      router.push("/home");
    },
    onError: () => {
      Alert.alert("Failed to create post");
    },
  });

  const handleCreatePost = async () => {
    const trimmed = content.trim();
    if (trimmed === "") {
      return;
    }
    createPostMutation.mutate({ content: trimmed });
  };

  return (
    <View style={{ flex: 1, padding: 16, paddingBlockStart: 32 }}>
      <View
        style={{
          flex: 1,
          marginBottom: 16,
        }}
      >
        <TextArea
          placeholder="Write your thoughts here"
          value={content}
          onChangeText={setContent}
        />
      </View>
      <Button
        label="Post"
        onPress={handleCreatePost}
        disabled={createPostMutation.isPending}
        loading={createPostMutation.isPending}
      />
    </View>
  );
}
