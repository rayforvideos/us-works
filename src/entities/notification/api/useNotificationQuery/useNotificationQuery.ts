import { useQuery } from "@tanstack/react-query";

import { useHttpClient } from "@/shared/api";

import { fetchNotification } from "../notification-api";

export function useNotificationQuery(id: string) {
  const client = useHttpClient();

  return useQuery({
    queryKey: ["notifications", "detail", id],
    queryFn: () => fetchNotification(client, id),
  });
}
