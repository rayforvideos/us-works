import { useQuery } from "@tanstack/react-query";

import { useHttpClient } from "@/shared/api";

import { fetchContentNotification } from "../content-api";

export function useContentNotificationQuery(id: string) {
  const client = useHttpClient();

  return useQuery({
    queryKey: ["contents", "notification", id],
    queryFn: () => fetchContentNotification(client, id),
  });
}
