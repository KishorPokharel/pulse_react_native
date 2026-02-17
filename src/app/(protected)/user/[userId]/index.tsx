import Avatar from "@/src/components/avatar";
import Button from "@/src/components/button";
import FullscreenLoader from "@/src/components/fullscreenLoader";
import PostCard from "@/src/components/postCard";
import { useAuth } from "@/src/context/AuthContext";
import { usePostLikeUnlike } from "@/src/hooks/posts";
import { apiGetUserPosts } from "@/src/http/posts";
import {
  apiFollowUser,
  apiGetUserProfile,
  apiUnfollowUser,
} from "@/src/http/users";
import { formatDate } from "@/src/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, FlatList, Pressable, Text, View } from "react-native";

export default function Screen() {
  const params = useLocalSearchParams<{ userId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["users", params.userId],
    queryFn: () => apiGetUserProfile(+params.userId),
  });

  const queryClient = useQueryClient();
  const router = useRouter();
  const followMutation = useMutation({
    mutationFn: apiFollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", params.userId] });
    },
    onError: () => {
      alert("Failed to follow");
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: apiUnfollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", params.userId] });
    },
    onError: () => {
      alert("Failed to follow");
    },
  });

  let { user: authUser, logout } = useAuth();
  authUser = authUser!;

  const isMyProfile = +params.userId === authUser.id;
  const user = data!;

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
    <>
      <View style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
        <View>
          <View
            style={{
              marginBottom: 10,
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
        </View>
        <View>
          <UserProfilePosts user={{ id: user.id, name: user.name }} />
        </View>
      </View>
    </>
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

  return (
    <View
      style={{
        gap: 8,
      }}
    >
      <View style={{}}>
        <Avatar id={user.id} name={user.name} size={48} />
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
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/user/[userId]/followers",
              params: { userId: user.id },
            });
          }}
        >
          <Text>
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
          <Text>
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

type UserProfilePostsProps = {
  user: {
    id: number;
    name: string;
  };
};

function UserProfilePosts({ user }: UserProfilePostsProps) {
  let { likedPostIds, setLikedPostIds } = useAuth();

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["users", user.id, "posts"],
    queryFn: () => apiGetUserPosts(user.id),
  });

  const likeUnlikeMutation = usePostLikeUnlike();

  if (isLoading) {
    return <FullscreenLoader />;
  }

  const posts = data?.results || [];
  return (
    <View style={{ gap: 8 }}>
      {posts.length > 0 ? (
        <Text
          style={{
            fontSize: 18,
            color: "#333",
          }}
        >
          Posts
        </Text>
      ) : null}
      <FlatList
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={refetch}
        contentContainerStyle={{
          paddingBlockEnd: 450,
        }}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: "#e0e0e0" }} />
        )}
        data={posts}
        renderItem={({ item: post }) => (
          <View
            style={{
              paddingBlock: 16,
            }}
          >
            <PostCard
              post={{
                id: post.id,
                author: {
                  id: user.id,
                  name: user.name,
                },
                content: post.content,
                createdAt: post.createdAt,
                isLiked: likedPostIds.includes(post.id),
                numberOfLikes: post.likesCount,
                numberOfComments: post.repliesCount,
              }}
              onLikeTap={() =>
                likeUnlikeMutation.mutate({
                  postId: post.id,
                  authorId: user.id,
                })
              }
              onShowMore={() => {
                router.push({
                  pathname: "/post/[postId]",
                  params: { postId: post.id },
                });
              }}
              likeBtnDisabled={
                likeUnlikeMutation.isPending &&
                likeUnlikeMutation.variables.postId === post.id
              }
            />
          </View>
        )}
        keyExtractor={(post) => post.id + ""}
      />
    </View>
  );
}
