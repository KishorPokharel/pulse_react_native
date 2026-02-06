import Button from "@/src/components/button";
import TextArea from "@/src/components/textarea";
import { useAuth } from "@/src/hooks/useAuth";
import { apiCreatePost } from "@/src/http/posts";
import { useState } from "react";
import { View } from "react-native";

export default function Screen() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreatePost =async  () => {
    if(content.trim() === "") {
      return;
    }
    setLoading(true);
    const data = await apiCreatePost({content: content.trim()});
    setLoading(false);
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
      <Button label="Post" onPress={handleCreatePost} disabled={loading} loading={loading} />
    </View>
  );
}
