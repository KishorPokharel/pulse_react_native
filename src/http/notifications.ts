import { apiClient } from "./client";

export const apiGetUnreadNotificationCount = async () => {
  const data = await apiClient.get<{ count: number }>(
    "/notifications/unread-count",
  );
  return data;
};

export type GetNotificationResponse = {
  results: {
    id: number;
    type: string;
    read: boolean;
    postId: number;
    createdAt: string;
    actor: {
      id: number;
      name: string;
    };
  }[];
};

export const apiGetNotifications = async () => {
  const data = await apiClient.get<GetNotificationResponse>("/notifications");
  return data;
};

export const apiMarkAllNotificationAsRead = async () => {
  const data = await apiClient.patch<{ success: boolean }>(
    `/notifications/read-all`,
  );
  return data;
};

export const apiMarkNotificationAsRead = async (notificationId: number) => {
  const data = await apiClient.patch<{ success: boolean }>(
    `/notifications/${notificationId}/read`,
  );
  return data;
};
