import Avatar from "@/src/components/avatar";
import Button from "@/src/components/button";
import FullscreenLoader from "@/src/components/fullscreenLoader";
import { useAuth } from "@/src/hooks/useAuth";
import { apiGetUserProfile } from "@/src/http/users";
import { formatDate } from "@/src/utils";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";

export default function Screen() {
  const params = useLocalSearchParams<{ userId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["users", params.userId],
    queryFn: () => apiGetUserProfile(+params.userId),
  });

  let { user: authUser, logout } = useAuth();
  authUser = authUser!;

  const isMyProfile = +params.userId === authUser.id;
  const user = data!;

  console.log("USER", user);

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

  if (isLoading) {
    return <FullscreenLoader />;
  }

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
            bio: user.bio || "",
            joinedAt: user.createdAt,
            followersCount: user.followersCount,
            followingCount: user.followingCount,
          }}
        />
      </View>
      {isMyProfile ? <Button label="Logout" onPress={handleLogout} /> : null}
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
        {user.email === "" ? null : <Text>{user.email}</Text>}
        {user.bio ? (
          <Text style={{ marginBlockStart: 10 }}>{user.bio}</Text>
        ) : null}
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
