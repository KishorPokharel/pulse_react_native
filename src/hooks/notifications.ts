import { useQuery } from "@tanstack/react-query";
import { apiGetUnreadNotificationCount } from "../http/notifications";

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: apiGetUnreadNotificationCount,
    refetchInterval: 30 * 1000,
  });
}
