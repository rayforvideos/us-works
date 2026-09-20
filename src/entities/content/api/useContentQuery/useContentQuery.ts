import { useQuery } from "@tanstack/react-query";

import { useHttpClient } from "@/shared/api";

import { fetchContent } from "../content-api";

export function useContentQuery(id: string) {
  const client = useHttpClient();

  return useQuery({
    queryKey: ["contents", "detail", id],
    queryFn: () => fetchContent(client, id),
  });
}
