import { type Content, type ContentVisibility } from "@/entities/content";
import {
  type Notification,
  type NotificationScheduleInput,
  type NotificationUpdateInput,
  type TargetType,
} from "@/entities/notification";

import { type PublishOptionsValues } from "../publish-options-schema";

type NotificationCreateDraft = {
  title: string;
  target_type: TargetType;
  scheduled_at?: string;
};

export type PublishStep =
  | { kind: "status"; status: ContentVisibility }
  | { kind: "schedule-create"; publishedAt: string }
  | { kind: "schedule-update"; publishedAt: string }
  | { kind: "schedule-delete" }
  | { kind: "notification-create"; input: NotificationCreateDraft }
  | {
      kind: "notification-update";
      id: number;
      detail?: NotificationUpdateInput;
      schedule?: NotificationScheduleInput;
    }
  | { kind: "notification-delete"; id: number };

type PublishCurrentState = {
  content: Content | null;
  notification: Notification | null;
};

export type BuildPublishPlanInput = {
  current: PublishCurrentState;
  values: PublishOptionsValues;
  contentTitle: string;
};
