import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import {
  apiGetNotifications,
  apiGetUnreadNotificationCount,
  apiMarkAllNotificationAsRead,
  apiMarkNotificationAsRead,
  GetNotificationResponse,
} from "../http/notifications";

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: apiGetUnreadNotificationCount,
    refetchInterval: 30 * 1000,
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: apiGetNotifications,
  });
}

export function useAllNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiMarkAllNotificationAsRead,
    onSuccess: () => {
      queryClient.setQueryData<GetNotificationResponse>(
        ["notifications"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            results: old.results.map((not) => {
              return {
                ...not,
                read: true,
              };
            }),
          };
        },
      );
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
    onError: (err) => {
      console.log(err);
      Alert.alert("Something went wrong");
    },
  });
}

export function useNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiMarkNotificationAsRead,
    onSuccess: (data, notificationId) => {
      queryClient.setQueryData<GetNotificationResponse>(
        ["notifications"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            results: old.results.map((not) => {
              return {
                ...not,
                read: not.id === notificationId ? true : not.read,
              };
            }),
          };
        },
      );
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
    onError: (err) => {
      console.log(err);
      Alert.alert("Something went wrong");
    },
  });
}
