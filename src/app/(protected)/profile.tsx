import Avatar from "@/src/components/avatar";
import Button from "@/src/components/button";
import { useAuth } from "@/src/hooks/useAuth";
import { formatDate } from "@/src/utils";
import { Alert, Pressable, Text, View } from "react-native";

export default function Screen() {
  const { user: authUser, logout } = useAuth();
  const user = authUser!;

  const handleLogout = () => {
    Alert.alert("Are you sure?", "", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          logout();
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
      <View
        style={{
          marginBottom: 20,
          // justifyContent: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#e0e0e0",
          paddingBlockEnd: 10,
          alignItems: "center",
        }}
      >
        <View
          style={{
            marginBlockEnd: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar name={user.name} />
          <Text style={{ fontSize: 18, marginBlockStart: 8 }}>{user.name}</Text>
          <Text>{user.email}</Text>
        </View>
        {user.emailVerified ? (
          <Text
            style={{
              fontSize: 12,
              backgroundColor: "green",
              borderRadius: 12,
              color: "white",
              paddingInline: 8,
              paddingBlock: 4,
              marginBlockStart: 8,
            }}
          >
            Verified
          </Text>
        ) : null}
        <Text style={{ marginBlockStart: 10 }}>
          Joined {formatDate(user.createdAt!)}
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            marginBlockStart: 8,
          }}
        >
          <Pressable onPress={() => {}}>
            <Text>
              <Text style={{ fontWeight: "bold" }}>{user.followersCount}</Text>
              {" Followers"}
            </Text>
          </Pressable>
          <Pressable onPress={() => {}}>
            <Text>
              <Text style={{ fontWeight: "bold" }}>{user.followingCount}</Text>
              {" Following"}
            </Text>
          </Pressable>
        </View>
      </View>
      <Button label="Logout" onPress={handleLogout} />
    </View>
  );
}
