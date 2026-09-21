import { z } from "zod";

import { MAX_NOTIFICATION_TITLE_LENGTH, TARGET_TYPES } from "@/entities/notification";
import { isFutureDateTime } from "@/shared/lib/seoul-time";

import { PAST_TIME_MESSAGE, REQUIRED_MESSAGE, TITLE_MAX_MESSAGE } from "./constants";

export const notificationInputSchema = z
  .object({
    targetType: z.enum(TARGET_TYPES),
    title: z
      .string()
      .trim()
      .min(1, REQUIRED_MESSAGE)
      .max(MAX_NOTIFICATION_TITLE_LENGTH, TITLE_MAX_MESSAGE),
    scheduledAt: z.string().min(1, REQUIRED_MESSAGE),
  })
  .superRefine((values, ctx) => {
    if (values.scheduledAt === "") {
      return;
    }
    if (!isFutureDateTime(values.scheduledAt, new Date())) {
      ctx.addIssue({ code: "custom", path: ["scheduledAt"], message: PAST_TIME_MESSAGE });
    }
  });
