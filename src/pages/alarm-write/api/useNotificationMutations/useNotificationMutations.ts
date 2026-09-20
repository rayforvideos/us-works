import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createNotification,
  type NotificationInput,
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
      void queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
      void queryClient.invalidateQueries({ queryKey: ["contents"] });
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
      void queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications", "detail", id] });
    },
  });
}
