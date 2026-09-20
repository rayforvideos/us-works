import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useHttpClient } from "@/shared/api";

import { type ContentListParams } from "../../model/content";
import { fetchContents } from "../content-api";

export function useContentsQuery(params: ContentListParams) {
  const client = useHttpClient();

  return useQuery({
    queryKey: ["contents", "list", params],
    queryFn: ({ signal }) => fetchContents(client, params, { signal }),
    placeholderData: keepPreviousData,
  });
}
