import { type AxiosInstance } from "axios";

import {
  type Content,
  type ContentInput,
  type ContentListParams,
  type ContentListResponse,
} from "../../model/content";

function toContentPath(id: string): string {
  return `/api/v1/contents/${id}`;
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
