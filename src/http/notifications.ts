import { apiClient } from "./client";

export const apiGetUnreadNotificationCount = async () => {
  const data = await apiClient.get<{ count: number }>(
    "/notifications/unread-count",
  );
  return data;
};
