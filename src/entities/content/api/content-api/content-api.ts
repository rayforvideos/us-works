import { type AxiosInstance } from "axios";

import { type Notification } from "@/entities/notification/@x/content";
import { isApiError } from "@/shared/api";

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
): Promise<ContentListResponse> {
  const response = await client.get<ContentListResponse>("/api/v1/contents", {
    params: {
      page: params.page,
      limit: params.limit,
      category: params.category,
      publish_status: params.publishStatus,
    },
  });
  return response.data;
}

export async function fetchContent(client: AxiosInstance, id: string): Promise<Content> {
  const response = await client.get<Content>(toContentPath(id));
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
): Promise<Content> {
  const response = await client.put<Content>(toSchedulePath(id), input);
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
): Promise<Notification | null> {
  try {
    const response = await client.get<Notification>(`${toContentPath(id)}/notification`);
    return response.data;
  } catch (error) {
    if (isApiError(error) && error.kind === "not_found") {
      return null;
    }
    throw error;
  }
}
