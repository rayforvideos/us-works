import { z } from "zod";

import { TARGET_TYPES } from "@/entities/notification";
import { isFutureDateTime } from "@/shared/lib/seoul-time";

import { isNotifying } from "../publish-rules";
import {
  MAX_NOTIFICATION_TITLE_LENGTH,
  NOTIFICATION_TITLE_MAX_MESSAGE,
  NOTIFICATION_TITLE_REQUIRED_MESSAGE,
  PAST_TIME_MESSAGE,
  PUBLISH_VISIBILITIES,
  REQUIRED_MESSAGE,
} from "./constants";

export const publishOptionsSchema = z
  .object({
    visibility: z.enum(PUBLISH_VISIBILITIES),
    publishedAt: z.string(),
    notify: z.boolean(),
    targetType: z.enum(TARGET_TYPES),
    useContentTitle: z.boolean(),
    notificationTitle: z
      .string()
      .max(MAX_NOTIFICATION_TITLE_LENGTH, NOTIFICATION_TITLE_MAX_MESSAGE),
  })
  .superRefine((values, ctx) => {
    if (values.visibility === "scheduled" && values.publishedAt === "") {
      ctx.addIssue({ code: "custom", path: ["publishedAt"], message: REQUIRED_MESSAGE });
    }
    if (
      values.visibility === "scheduled" &&
      values.publishedAt !== "" &&
      !isFutureDateTime(values.publishedAt, new Date())
    ) {
      ctx.addIssue({ code: "custom", path: ["publishedAt"], message: PAST_TIME_MESSAGE });
    }
    if (isNotifying(values) && values.notificationTitle.trim() === "") {
      ctx.addIssue({
        code: "custom",
        path: ["notificationTitle"],
        message: NOTIFICATION_TITLE_REQUIRED_MESSAGE,
      });
    }
  });
