import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useHttpClient } from "@/shared/api";

import { type NotificationListParams } from "../../model/notification";
import { fetchNotifications } from "../notification-api";

export function useNotificationsQuery(params: NotificationListParams) {
  const client = useHttpClient();

  return useQuery({
    queryKey: ["notifications", "list", params],
    queryFn: () => fetchNotifications(client, params),
    placeholderData: keepPreviousData,
  });
}
