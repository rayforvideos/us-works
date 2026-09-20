import {
  type NotificationScheduleInput,
  type NotificationUpdateInput,
} from "@/entities/notification";

export type NotificationUpdate = {
  detail?: NotificationUpdateInput;
  schedule?: NotificationScheduleInput;
};
