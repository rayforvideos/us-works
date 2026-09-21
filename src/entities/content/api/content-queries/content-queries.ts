import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { type AxiosInstance } from "axios";

import { type ContentListParams } from "../../model/content";
import { fetchContent, fetchContentNotification, fetchContents } from "../content-api";

export const contentQueries = {
  all: () => ["contents"] as const,
  lists: () => [...contentQueries.all(), "list"] as const,
  details: () => [...contentQueries.all(), "detail"] as const,
  notifications: () => [...contentQueries.all(), "notification"] as const,
  list: (client: AxiosInstance, params: ContentListParams) =>
    queryOptions({
      queryKey: [...contentQueries.lists(), params],
      queryFn: ({ signal }) => fetchContents(client, params, { signal }),
      placeholderData: keepPreviousData,
    }),
  detail: (client: AxiosInstance, id: number) =>
    queryOptions({
      queryKey: [...contentQueries.details(), id],
      queryFn: ({ signal }) => fetchContent(client, id, { signal }),
    }),
  notification: (client: AxiosInstance, id: number) =>
    queryOptions({
      queryKey: [...contentQueries.notifications(), id],
      queryFn: ({ signal }) => fetchContentNotification(client, id, { signal }),
    }),
};
