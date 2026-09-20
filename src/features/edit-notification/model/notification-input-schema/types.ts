import { type z } from "zod";

import { type notificationInputSchema } from "./notification-input-schema";

export type NotificationFormValues = z.infer<typeof notificationInputSchema>;
