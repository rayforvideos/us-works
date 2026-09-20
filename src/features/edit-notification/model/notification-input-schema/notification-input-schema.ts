import { z } from "zod";

import { TARGET_TYPES } from "@/entities/notification";

import { isFutureScheduledAt } from "../scheduled-at";
import {
  MAX_TITLE_LENGTH,
  PAST_TIME_MESSAGE,
  REQUIRED_MESSAGE,
  TITLE_MAX_MESSAGE,
} from "./constants";

export const notificationInputSchema = z
  .object({
    targetType: z.enum(TARGET_TYPES),
    title: z.string().trim().min(1, REQUIRED_MESSAGE).max(MAX_TITLE_LENGTH, TITLE_MAX_MESSAGE),
    scheduledAt: z.string().min(1, REQUIRED_MESSAGE),
  })
  .superRefine((values, ctx) => {
    if (values.scheduledAt === "") {
      return;
    }
    if (!isFutureScheduledAt(values.scheduledAt, new Date())) {
      ctx.addIssue({ code: "custom", path: ["scheduledAt"], message: PAST_TIME_MESSAGE });
    }
  });
