import Avatar from "@/src/components/avatar";
import Input from "@/src/components/input";
import { useAuth } from "@/src/hooks/useAuth";
import { apiSearchUsers } from "@/src/http/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

export default function Screen() {
  const { user } = useAuth();
  const [text, setText] = useState("");

  const router = useRouter();

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["users", text.trim()],
    queryFn: () => apiSearchUsers(text.trim()),
    enabled: !!text.trim(),
  });

  // const handleSearch = async () => {
  //   const trimmed = text.trim();
  //   if (trimmed === "") {
  //     return;
  //   }
  // };

  const users = data?.results || [];
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
      <View style={{ flex: 1, borderWidth: 0 }}>
        <View
          style={{
            gap: 8,
            marginBlockEnd: 16,
          }}
        >
          <Input
            autoFocus
            placeholder="Search..."
            value={text}
            onChangeText={setText}
          />
        </View>
        {isLoading ? (
          <Text style={{fontSize: 20, paddingBlock: 12, textAlign: "center"}}>...</Text>
        ) : (
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
                    {user.bio || ""}
                  </Text>
                </Pressable>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}
