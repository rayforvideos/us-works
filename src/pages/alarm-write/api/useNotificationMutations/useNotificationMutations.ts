import { useMutation, useQueryClient } from "@tanstack/react-query";

import { contentQueries } from "@/entities/content";
import {
  createNotification,
  type NotificationInput,
  notificationQueries,
  updateNotification,
  updateNotificationSchedule,
} from "@/entities/notification";
import { useHttpClient } from "@/shared/api";

import { type NotificationUpdate } from "../../model/to-notification-input";

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

export function useUpdateNotificationMutation(id: string) {
  const client = useHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (update: NotificationUpdate) => {
      if (update.detail) {
        await updateNotification(client, id, update.detail);
      }
      if (update.schedule) {
        await updateNotificationSchedule(client, id, update.schedule);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationQueries.lists() });
      void queryClient.invalidateQueries({ queryKey: [...notificationQueries.details(), id] });
      void queryClient.invalidateQueries({ queryKey: contentQueries.all() });
    },
  });
}
