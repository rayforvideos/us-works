import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosInstance } from "axios";

import {
  changeContentStatus,
  contentQueries,
  createContent,
  deleteContentSchedule,
  fetchContent,
  fetchContentNotification,
  scheduleContent,
  updateContent,
  updateContentSchedule,
} from "@/entities/content";
import {
  createNotification,
  deleteNotification,
  notificationQueries,
  updateNotification,
  updateNotificationSchedule,
} from "@/entities/notification";
import { useHttpClient } from "@/shared/api";

import { buildPublishPlan, type PublishStep } from "../../model/publish-plan";
import { type PublishContentVariables, type PublishMutationOptions } from "./types";

async function runStep(client: AxiosInstance, contentId: string, step: PublishStep): Promise<void> {
  switch (step.kind) {
    case "status":
      await changeContentStatus(client, contentId, step.status);
      return;
    case "schedule-create":
      await scheduleContent(client, contentId, { published_at: step.publishedAt });
      return;
    case "schedule-update":
      await updateContentSchedule(client, contentId, { published_at: step.publishedAt });
      return;
    case "schedule-delete":
      await deleteContentSchedule(client, contentId);
      return;
    case "notification-create":
      await createNotification(client, { content_id: Number(contentId), ...step.input });
      return;
    case "notification-delete":
      await deleteNotification(client, String(step.id));
      return;
    case "notification-update":
      if (step.detail) {
        await updateNotification(client, String(step.id), step.detail);
      }
      if (step.schedule) {
        await updateNotificationSchedule(client, String(step.id), step.schedule);
      }
      return;
  }
}

export function usePublishContentMutation({ onContentSaved }: PublishMutationOptions = {}) {
  const client = useHttpClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contentId,
      contentInput,
      values,
      contentTitle,
    }: PublishContentVariables) => {
      const saved =
        contentId === null
          ? await createContent(client, contentInput)
          : await updateContent(client, contentId, contentInput);
      const savedId = String(saved.id);
      onContentSaved?.(savedId);
      const [content, notification] = await Promise.all([
        fetchContent(client, savedId),
        contentId === null ? null : fetchContentNotification(client, savedId),
      ]);
      const plan = buildPublishPlan({ current: { content, notification }, values, contentTitle });
      for (const step of plan) {
        await runStep(client, savedId, step);
      }
      return { contentId: savedId };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contentQueries.all() });
      void queryClient.invalidateQueries({ queryKey: notificationQueries.all() });
    },
  });
}
