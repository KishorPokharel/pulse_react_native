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
          borderBottomWidth: 1,
          borderBottomColor: "#e0e0e0",
          paddingBlockEnd: 10,
        }}
      >
        <UserProfileHeader
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            bio: "Software Engineer | No fluff Coding Courses",
            joinedAt: user.createdAt,
            followersCount: user.followersCount,
            followingCount: user.followingCount,
          }}
        />
      </View>
      <Button label="Logout" onPress={handleLogout} />
    </View>
  );
}

type UserProfileHeaderProps = {
  user: {
    id: number;
    name: string;
    email: string;
    bio: string;
    joinedAt: string;
    followersCount: number;
    followingCount: number;
  };
};

function UserProfileHeader({ user }: UserProfileHeaderProps) {
  return (
    <View
      style={{
        gap: 8,
      }}
    >
      <View style={{}}>
        <Avatar name={user.name} size={48} />
        <Text style={{ fontSize: 16, marginBlockStart: 8 }}>{user.name}</Text>
        <Text>{user.email}</Text>
        <Text style={{ marginBlockStart: 10 }}>{user.bio}</Text>
      </View>

      <Text style={{ fontSize: 12 }}>Joined {formatDate(user.joinedAt)}</Text>
      <View
        style={{
          flexDirection: "row",
          gap: 16,
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
  );
}
