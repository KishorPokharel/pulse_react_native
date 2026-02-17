import Avatar from "@/src/components/avatar";
import FullscreenLoader from "@/src/components/fullscreenLoader";
import { useTheme } from "@/src/context/ThemeContext";
import { useFollowers } from "@/src/hooks/users";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function Screen() {
  const router = useRouter();
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ userId: string }>();
  const userId = +params.userId;

  const { data, isLoading } = useFollowers(userId);
  if (isLoading) {
    return <FullscreenLoader />;
  }

  const users = data?.results || [];

  if (users.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <Text style={{ color: theme.text }}>Nothing to see here yet.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: "#e9e9e97c" }} />
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
    </View>
  );
}
