import { type AxiosInstance } from "axios";

import {
  type NotificationListParams,
  type NotificationListResponse,
} from "../../model/notification";

export async function fetchNotifications(
  client: AxiosInstance,
  params: NotificationListParams,
): Promise<NotificationListResponse> {
  const response = await client.get<NotificationListResponse>("/api/v1/notifications", {
    params: {
      page: params.page,
      limit: params.limit,
    },
  });
  return response.data;
}
