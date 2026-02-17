import Avatar from "@/src/components/avatar";
import Input from "@/src/components/input";
import { useTheme } from "@/src/context/ThemeContext";
import useDebounce from "@/src/hooks/useDebounce";
import { apiSearchUsers } from "@/src/http/users";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Screen() {
  const [text, setText] = useState("");
  const debouncedText = useDebounce(text, 500);

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useTheme();

  const { data, isLoading } = useQuery({
    queryKey: ["users", debouncedText.trim()],
    queryFn: () => apiSearchUsers(debouncedText.trim()),
    enabled: !!debouncedText.trim(),
  });

  const users = data?.results || [];

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top + 8,
        padding: 16,
        backgroundColor: "white",
      }}
    >
      <View style={{ flex: 1, borderWidth: 0 }}>
        <View
          style={{
            gap: 8,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBlockEnd: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Input
              placeholderTextColor={theme.text}
              autoFocus
              placeholder="Search..."
              value={text}
              inputStyle={{ borderRadius: 100 }}
              onChangeText={setText}
            />
          </View>
          <TouchableOpacity onPress={() => setText("")}>
            <MaterialIcons name="clear" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <View style={{ paddingBlock: 16 }}>
            <ActivityIndicator color="steelblue" size="large" />
          </View>
        ) : null}

        {!isLoading && debouncedText.trim() === "" && users.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.background,
            }}
          >
            <Text style={{ color: theme.text }}>Type to search</Text>
          </View>
        ) : null}

        {!isLoading && debouncedText.trim() != "" && users.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.background,
            }}
          >
            <Text style={{ color: theme.text }}>No users found.</Text>
          </View>
        ) : null}

        {!isLoading && users.length > 0 ? (
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
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: "/user/[userId]",
                      params: { userId: user.id },
                    });
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                    }}
                  >
                    <Avatar id={user.id} name={user.name} />
                    <View>
                      <Text>{user.name}</Text>
                      <Text
                        style={{
                          marginBlockStart: 4,
                        }}
                      >
                        {user.bio || ""}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : null}
      </View>
    </View>
  );
}
