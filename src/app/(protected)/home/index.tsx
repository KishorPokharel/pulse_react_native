import FullscreenLoader from "@/src/components/fullscreenLoader";
import PostCard from "@/src/components/postCard";
import { useAuth } from "@/src/hooks/useAuth";
import { apiGetFeed, apiLikeUnlikePost } from "@/src/http/posts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { FlatList, View } from "react-native";

type Post = {
  author: {
    id: number;
    name: string;
  };
  id: number;
  content: string;
  createdAt: string;
  liked: boolean;
};

export default function Screen() {
  const router = useRouter();
  let { user: authUser, likedPostIds, setLikedPostIds } = useAuth();
  authUser = authUser!;

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["feed"],
    queryFn: apiGetFeed,
  });

  const tapLikeMutation = useMutation({
    mutationFn: apiLikeUnlikePost,
    onSuccess: (data) => {
      if (data.liked) {
        setLikedPostIds([...likedPostIds, data.postId]);
      } else {
        setLikedPostIds((prev) => prev.filter((id) => id !== data.postId));
      }
    },
    onError: () => {
      alert("Something went wrong");
    },
  });

  const handleLikeTap = (postId: number) => {
    tapLikeMutation.mutate(postId);
  };

  if (isLoading) {
    return <FullscreenLoader />;
  }

  const feed = data?.results || [];
  return (
    <View style={{ flex: 1, paddingInline: 16, backgroundColor: "white" }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={refetch}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: "#e0e0e0" }} />
        )}
        data={feed}
        renderItem={({ item: post }) => (
          <View
            style={{
              paddingBlock: 16,
            }}
          >
            <PostCard
              post={{
                id: post.id,
                name: post.author.name,
                content: post.content,
                createdAt: post.createdAt,
                isLiked: likedPostIds.includes(post.id),
                numberOfLikes: post.likesCount,
                numberOfComments: post.repliesCount,
              }}
              onLikeTap={() => handleLikeTap(post.id)}
              onShowMore={() => {
                router.push({
                  pathname: "/home/[postId]",
                  params: { postId: post.id },
                });
              }}
              onProfileClick={() => {
                router.push({
                  pathname: "/user/[userId]",
                  params: { userId: post.author.id },
                });
              }}
            />
          </View>
        )}
        keyExtractor={(post) => post.id + ""}
      />
    </View>
  );
}
