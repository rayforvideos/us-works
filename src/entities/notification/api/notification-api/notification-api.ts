import { type AxiosInstance } from "axios";

import {
  type Notification,
  type NotificationInput,
  type NotificationListParams,
  type NotificationListResponse,
  type NotificationScheduleInput,
  type NotificationUpdateInput,
} from "../../model/notification";

function toNotificationPath(id: string): string {
  return `/api/v1/notifications/${id}`;
}

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

export async function fetchNotification(client: AxiosInstance, id: string): Promise<Notification> {
  const response = await client.get<Notification>(toNotificationPath(id));
  return response.data;
}

export async function createNotification(
  client: AxiosInstance,
  input: NotificationInput,
): Promise<Notification> {
  const response = await client.post<Notification>("/api/v1/notifications", input);
  return response.data;
}

export async function updateNotification(
  client: AxiosInstance,
  id: string,
  input: NotificationUpdateInput,
): Promise<Notification> {
  const response = await client.put<Notification>(toNotificationPath(id), input);
  return response.data;
}

export async function updateNotificationSchedule(
  client: AxiosInstance,
  id: string,
  input: NotificationScheduleInput,
): Promise<Notification> {
  const response = await client.put<Notification>(`${toNotificationPath(id)}/schedule`, input);
  return response.data;
}
