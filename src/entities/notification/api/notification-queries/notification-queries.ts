import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { type AxiosInstance } from "axios";

import { type NotificationListParams } from "../../model/notification";
import { fetchNotification, fetchNotifications } from "../notification-api";

export const notificationQueries = {
  all: () => ["notifications"] as const,
  lists: () => [...notificationQueries.all(), "list"] as const,
  details: () => [...notificationQueries.all(), "detail"] as const,
  list: (client: AxiosInstance, params: NotificationListParams) =>
    queryOptions({
      queryKey: [...notificationQueries.lists(), params],
      queryFn: ({ signal }) => fetchNotifications(client, params, { signal }),
      placeholderData: keepPreviousData,
    }),
  detail: (client: AxiosInstance, id: number) =>
    queryOptions({
      queryKey: [...notificationQueries.details(), id],
      queryFn: ({ signal }) => fetchNotification(client, id, { signal }),
    }),
};
