import { type AxiosInstance } from "axios";

import { type Notification } from "@/entities/notification/@x/content";
import { type RequestOptions } from "@/shared/api";

import {
  type Content,
  type ContentInput,
  type ContentListParams,
  type ContentListResponse,
  type ContentSchedule,
  type ContentScheduleInput,
  type ContentVisibility,
} from "../../model/content";

function toContentPath(id: string): string {
  return `/api/v1/contents/${id}`;
}

function toSchedulePath(id: string): string {
  return `${toContentPath(id)}/schedule`;
}

export async function fetchContents(
  client: AxiosInstance,
  params: ContentListParams,
  options: RequestOptions = {},
): Promise<ContentListResponse> {
  const response = await client.get<ContentListResponse>("/api/v1/contents", {
    params: {
      page: params.page,
      limit: params.limit,
      category: params.category,
      publish_status: params.publishStatus,
    },
    signal: options.signal,
  });
  return response.data;
}

export async function fetchContent(
  client: AxiosInstance,
  id: string,
  options: RequestOptions = {},
): Promise<Content> {
  const response = await client.get<Content>(toContentPath(id), { signal: options.signal });
  return response.data;
}

export async function createContent(client: AxiosInstance, input: ContentInput): Promise<Content> {
  const response = await client.post<Content>("/api/v1/contents", input);
  return response.data;
}

export async function updateContent(
  client: AxiosInstance,
  id: string,
  input: ContentInput,
): Promise<Content> {
  const response = await client.put<Content>(toContentPath(id), input);
  return response.data;
}

export async function changeContentStatus(
  client: AxiosInstance,
  id: string,
  status: ContentVisibility,
): Promise<Content> {
  const response = await client.patch<Content>(`${toContentPath(id)}/status`, { status });
  return response.data;
}

export async function scheduleContent(
  client: AxiosInstance,
  id: string,
  input: ContentScheduleInput,
): Promise<Content> {
  const response = await client.post<Content>(toSchedulePath(id), input);
  return response.data;
}

export async function updateContentSchedule(
  client: AxiosInstance,
  id: string,
  input: ContentScheduleInput,
): Promise<ContentSchedule> {
  const response = await client.put<ContentSchedule>(toSchedulePath(id), input);
  return response.data;
}

export async function deleteContentSchedule(
  client: AxiosInstance,
  id: string,
): Promise<ContentSchedule> {
  const response = await client.delete<ContentSchedule>(toSchedulePath(id));
  return response.data;
}

export async function fetchContentNotification(
  client: AxiosInstance,
  id: string,
  options: RequestOptions = {},
): Promise<Notification | null> {
  const response = await client.get<Notification | null>(`${toContentPath(id)}/notification`, {
    signal: options.signal,
  });
  return response.data;
}
