import Avatar from "@/src/components/avatar";
import Button from "@/src/components/button";
import FullscreenLoader from "@/src/components/fullscreenLoader";
import PostCard from "@/src/components/postCard";
import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import { usePostLikeUnlike } from "@/src/hooks/posts";
import {
  useFollowUser,
  useUnfollowUser,
  useUserPosts,
  useUserProfile,
} from "@/src/hooks/users";
import { UserProfileResponse } from "@/src/http/users";
import { formatDate } from "@/src/utils";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Screen() {
  const params = useLocalSearchParams<{ userId: string }>();
  const userId = +params.userId;

  let { user: authUser } = useAuth();
  authUser = authUser!;

  const { data, isLoading: isUserProfileLoading } = useUserProfile(userId);

  if (isUserProfileLoading) {
    return <FullscreenLoader />;
  }

  const user = data!;
  const isMyProfile = userId === authUser.id;
  return <UserProfileView user={user} isMyProfile={isMyProfile} />;
}

type UserProfileHeaderProps = {
  user: {
    id: number;
    name: string;
    email: string;
    bio: string;
    createdAt: string;
    followersCount: number;
    followingCount: number;
  };
  following: boolean;
  followUser?: () => void;
  unfollowUser?: () => void;
  followUnfollowRequestPending: boolean;
};

function UserProfileHeader({
  user,
  following,
  followUser = () => {},
  unfollowUser = () => {},
  followUnfollowRequestPending = false,
}: UserProfileHeaderProps) {
  const router = useRouter();
  let { user: authUser } = useAuth();
  authUser = authUser!;
  const { theme } = useTheme();

  return (
    <View
      style={{
        gap: 8,
      }}
    >
      <View style={{}}>
        <Avatar id={user.id} name={user.name} size={48} />
        <Text
          style={{
            fontSize: 16,
            marginBlockStart: 8,
            fontWeight: "bold",
            color: theme.text,
          }}
        >
          {user.name}
        </Text>
        {user.email === "" ? null : (
          <Text style={{ color: theme.text }}>{user.email}</Text>
        )}
        {user.bio ? (
          <Text style={{ marginBlockStart: 10, color: theme.text }}>
            {user.bio}
          </Text>
        ) : null}
      </View>

      <Text style={{ fontSize: 12, color: theme.text }}>
        Joined {formatDate(user.createdAt)}
      </Text>
      <View
        style={{
          flexDirection: "row",
          gap: 16,
        }}
      >
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/user/[userId]/followers",
              params: { userId: user.id },
            });
          }}
        >
          <Text style={{ color: theme.text }}>
            <Text style={{ fontWeight: "bold" }}>{user.followersCount}</Text>
            {" Followers"}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/user/[userId]/following",
              params: { userId: user.id },
            });
          }}
        >
          <Text style={{ color: theme.text }}>
            <Text style={{ fontWeight: "bold" }}>{user.followingCount}</Text>
            {" Following"}
          </Text>
        </Pressable>
      </View>
      {authUser.id === user.id ? null : (
        <View
          style={{
            marginTop: 8,
          }}
        >
          <Button
            label={following ? "Unfollow" : "Follow"}
            disabled={followUnfollowRequestPending}
            loading={followUnfollowRequestPending}
            onPress={() => {
              if (following) {
                unfollowUser();
              } else {
                followUser();
              }
            }}
          />
        </View>
      )}
    </View>
  );
}

type UserProfileViewProops = {
  user: UserProfileResponse;
  isMyProfile: boolean;
};

function UserProfileView({ user, isMyProfile }: UserProfileViewProops) {
  let { likedPostIds, setLikedPostIds, logout } = useAuth();

  const router = useRouter();

  const { data, isLoading, isRefetching, refetch } = useUserPosts(user.id);

  const likeUnlikeMutation = usePostLikeUnlike();
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

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

  const postIds = data || [];
  return (
    <View
      style={{ flex: 1, paddingInline: 16, backgroundColor: theme.background }}
    >
      <Stack.Screen options={{ title: `${user.name}'s Profile` }} />
      <FlatList
        ListHeaderComponent={
          <>
            <View style={{ flex: 1, paddingTop: 16 }}>
              <View
                style={{
                  // marginBottom: 10,
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
                    createdAt: user.createdAt,
                    followersCount: user.followersCount,
                    followingCount: user.followingCount,
                  }}
                  following={user.following}
                  followUser={() => {
                    followMutation.mutate(user.id);
                  }}
                  unfollowUser={() => {
                    unfollowMutation.mutate(user.id);
                  }}
                  followUnfollowRequestPending={
                    followMutation.isPending || unfollowMutation.isPending
                  }
                />
                {isMyProfile ? (
                  <View style={{ marginBlock: 16, gap: 16 }}>
                    <Button
                      label="Edit"
                      type="secondary"
                      onPress={() => {
                        router.push("/user/edit");
                      }}
                    />
                    <Button label="Logout" onPress={handleLogout} />
                  </View>
                ) : null}
              </View>
              {postIds.length > 0 ? (
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 18,
                    color: theme.text,
                    fontWeight: "bold",
                  }}
                >
                  Posts
                </Text>
              ) : null}
            </View>
          </>
        }
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={refetch}
        contentContainerStyle={{
          paddingBlockEnd: insets.bottom,
        }}
        ListEmptyComponent={isLoading ? <FullscreenLoader /> : null}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: "#e0e0e0" }} />
        )}
        data={postIds}
        renderItem={({ item: postId }) => (
          <View
            style={{
              paddingBlock: 16,
            }}
          >
            <PostCard
              postId={postId}
              onLikeTap={() =>
                likeUnlikeMutation.mutate({
                  postId: postId,
                  authorId: user.id,
                })
              }
              likeBtnDisabled={
                likeUnlikeMutation.isPending &&
                likeUnlikeMutation.variables.postId === postId
              }
            />
          </View>
        )}
        keyExtractor={(postId) => `user-profile-postlist-${postId}`}
      />
    </View>
  );
}
