import { type AxiosInstance } from "axios";

import { type ContentListParams, type ContentListResponse } from "../../model/content";

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
