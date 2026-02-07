import Avatar from "@/src/components/avatar";
import Button from "@/src/components/button";
import Input from "@/src/components/input";
import { useAuth } from "@/src/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

export default function Screen() {
  const { user } = useAuth();
  const [text, setText] = useState("");

  const router = useRouter();

  const queryClient = useQueryClient();

  const handleSearch = async () => {
    const trimmed = text.trim();
    if (trimmed === "") {
      return;
    }
  };

  const users = [
    {
      id: 1,
      name: "Kishor Pokharel",
      bio: "Software developer with years of experience.",
    },
    {
      id: 2,
      name: "John Doe",
      bio: "Writer, language instructor and having fun.",
    },
    {
      id: 3,
      name: "Sarah",
      bio: "I'm here to have fun.",
    },
  ];

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flex: 1, borderWidth: 0 }}>
        <View
          style={{
            gap: 8,
            marginBlockEnd: 16,
          }}
        >
          <Input placeholder="Search..." value={text} onChangeText={setText} />
          {text.trim() === "" ? null : (
            <Button
              label="Search"
              onPress={handleSearch}
              disabled={text.trim() === ""}
              loading={false}
            />
          )}
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: "#e0e0e0" }} />
          )}
          data={users}
          renderItem={({ item: user }) => (
            <View
              style={{
                padding: 12,
              }}
            >
              <Pressable onPress={() => {}}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <Avatar name={user.name} />
                  <Text>{user.name}</Text>
                </View>
                <Text
                  style={{
                    marginBlockStart: 4,
                  }}
                >
                  {user.bio}
                </Text>
              </Pressable>
            </View>
          )}
        />
      </View>
    </View>
  );
}
