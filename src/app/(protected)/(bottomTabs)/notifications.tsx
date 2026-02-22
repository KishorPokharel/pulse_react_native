import Avatar from "@/src/components/avatar";
import Button from "@/src/components/button";
import FullscreenLoader from "@/src/components/fullscreenLoader";
import { useTheme } from "@/src/context/ThemeContext";
import {
  useAllNotificationAsRead,
  useNotificationAsRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/src/hooks/notifications";
import { timeAgo } from "@/src/utils";
import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

export default function Screen() {
  const { theme } = useTheme();
  const { data, isLoading, isRefetching, refetch } = useNotifications();

  const allReadMutation = useAllNotificationAsRead();
  const { data: unreadNotifsCountData } = useUnreadNotificationCount();

  if (isLoading) {
    return <FullscreenLoader />;
  }

  const notifications = data?.results || [];
  const unreadNotifsCount = unreadNotifsCountData?.count || 0;
  if (notifications.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <Text>Nothing to see here.</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        paddingInline: 16,
      }}
    >
      <FlatList
        refreshing={isRefetching}
        onRefresh={() => refetch()}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: "#e9e9e97c" }} />
        )}
        ListHeaderComponent={
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBlock: 12,
            }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 20, color: theme.text }}
            >
              Notifications
            </Text>
            {unreadNotifsCount > 0 ? (
              <Pressable
                disabled={allReadMutation.isPending}
                onPress={() => allReadMutation.mutate()}
              >
                <Text style={{ color: theme.text }}>Mark all as Read</Text>
              </Pressable>
            ) : null}
          </View>
        }
        data={notifications}
        renderItem={({ item: notification }) => (
          <View
            style={{
              paddingBlock: 12,
              backgroundColor: theme.background,
            }}
          >
            <NotificationCard notification={notification} />
          </View>
        )}
        keyExtractor={(notification) => notification.id + ""}
      />
    </View>
  );
}

type NotificationCardProps = {
  notification: {
    id: number;
    type: string;
    read: boolean;
    postId: number;
    createdAt: string;
    actor: {
      id: number;
      name: string;
    };
  };
};

function NotificationCard({ notification }: NotificationCardProps) {
  const { actor } = notification;
  const { theme } = useTheme();
  const router = useRouter();

  const readMutation = useNotificationAsRead();

  return (
    <>
      <Pressable
        onPress={() => {
          if (!notification.read) {
            readMutation.mutate(notification.id);
          }
          switch (notification.type) {
            case "follow":
              router.push({
                pathname: "/user/[userId]",
                params: { userId: actor.id },
              });
              break;
            case "comment":
              router.push({
                pathname: "/post/[postId]",
                params: { postId: notification.postId },
              });
              break;
          }
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
          }}
        >
          {!notification.read ? (
            <View>
              <View
                style={{
                  height: 10,
                  width: 10,
                  backgroundColor: "steelblue",
                  borderRadius: "100%",
                }}
              ></View>
            </View>
          ) : null}
          <Avatar id={actor.id} name={actor.name} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text }}>
              <Text style={{ fontWeight: "bold" }}>{actor.name}</Text>
              <Text>{getNotificationText(notification.type)}</Text>
            </Text>
            <Text style={{ color: theme.text }}>
              {timeAgo(notification.createdAt)}
            </Text>
          </View>
        </View>
      </Pressable>
      {!notification.read ? (
        <View style={{ marginTop: 16 }}>
          <Button
            disabled={readMutation.isPending}
            loading={readMutation.isPending}
            onPress={() => {
              readMutation.mutate(notification.id);
            }}
            label="Mark as read"
            type="secondary"
          />
        </View>
      ) : null}
    </>
  );
}

function getNotificationText(type: string) {
  if (type === "follow") {
    return " followed you.";
  }
  if (type === "comment") {
    return " commented on a post of yours.";
  }
  return "";
}
