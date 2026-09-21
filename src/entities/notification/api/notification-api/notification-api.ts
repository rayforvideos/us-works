import { type AxiosInstance } from "axios";

import { type RequestOptions } from "@/shared/api";

import {
  type Notification,
  type NotificationInput,
  type NotificationListParams,
  type NotificationListResponse,
  type NotificationSchedule,
  type NotificationScheduleInput,
  type NotificationUpdateInput,
} from "../../model/notification";

function toNotificationPath(id: number): string {
  return `/api/v1/notifications/${id}`;
}

export async function fetchNotifications(
  client: AxiosInstance,
  params: NotificationListParams,
  options: RequestOptions = {},
): Promise<NotificationListResponse> {
  const response = await client.get<NotificationListResponse>("/api/v1/notifications", {
    params: {
      page: params.page,
      limit: params.limit,
    },
    signal: options.signal,
  });
  return response.data;
}

export async function fetchNotification(
  client: AxiosInstance,
  id: number,
  options: RequestOptions = {},
): Promise<Notification> {
  const response = await client.get<Notification>(toNotificationPath(id), {
    signal: options.signal,
  });
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
  id: number,
  input: NotificationUpdateInput,
): Promise<Notification> {
  const response = await client.put<Notification>(toNotificationPath(id), input);
  return response.data;
}

export async function updateNotificationSchedule(
  client: AxiosInstance,
  id: number,
  input: NotificationScheduleInput,
): Promise<NotificationSchedule> {
  const response = await client.put<NotificationSchedule>(
    `${toNotificationPath(id)}/schedule`,
    input,
  );
  return response.data;
}

export async function deleteNotification(client: AxiosInstance, id: number): Promise<void> {
  await client.delete(toNotificationPath(id));
}
