import { useMutation, useQueryClient } from "@tanstack/react-query";

import { contentQueries } from "@/entities/content";
import {
  applyNotificationUpdate,
  createNotification,
  type NotificationInput,
  notificationQueries,
  type NotificationUpdate,
} from "@/entities/notification";
import { useHttpClient } from "@/shared/api";

export function useCreateNotificationMutation() {
  const client = useHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NotificationInput) => createNotification(client, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationQueries.lists() });
      void queryClient.invalidateQueries({ queryKey: contentQueries.all() });
    },
  });
}

export function useUpdateNotificationMutation(id: number) {
  const client = useHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (update: NotificationUpdate) => applyNotificationUpdate(client, id, update),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationQueries.lists() });
      void queryClient.invalidateQueries({ queryKey: [...notificationQueries.details(), id] });
      void queryClient.invalidateQueries({ queryKey: contentQueries.all() });
    },
  });
}
