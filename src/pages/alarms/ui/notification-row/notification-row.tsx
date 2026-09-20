import { Link, useNavigate } from "react-router";

import {
  formatScheduledAt,
  getSendStatusBadge,
  getStatCount,
  type Notification,
} from "@/entities/notification";
import { ROUTES } from "@/shared/config";
import { dataCellVariants } from "@/shared/ui/data-table";
import { StatusBadge } from "@/shared/ui/status-badge";

import {
  dateStackClass,
  rowClass,
  titleLinkClass,
  titleRowClass,
} from "./notification-row-variants";

/**
 * @types
 */
type NotificationRowProps = {
  notification: Notification;
};

export function NotificationRow({ notification }: NotificationRowProps) {
  const navigate = useNavigate();
  const detailPath = ROUTES.alarmDetail(notification.id);
  const scheduledAt = formatScheduledAt(notification.scheduled_at);
  const badge = getSendStatusBadge(notification.send_status);
  const successCount = getStatCount(notification.stats, "success_count");
  const failureCount = getStatCount(notification.stats, "failure_count");

  return (
    <tr
      className={rowClass()}
      onClick={() => {
        void navigate(detailPath);
      }}
    >
      <td className={dataCellVariants()}>{notification.id}</td>
      <td className={dataCellVariants()}>
        <div className={titleRowClass()}>
          <Link
            to={detailPath}
            className={titleLinkClass()}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {notification.title}
          </Link>
        </div>
      </td>
      <td className={dataCellVariants({ align: "center" })}>{successCount ?? "-"}</td>
      <td className={dataCellVariants({ align: "center" })}>{failureCount ?? "-"}</td>
      <td className={dataCellVariants({ align: "center" })}>
        {scheduledAt ? (
          <span className={dateStackClass()}>
            <span>{scheduledAt.date}</span>
            <span>{scheduledAt.time}</span>
          </span>
        ) : (
          "-"
        )}
      </td>
      <td className={dataCellVariants({ align: "center" })}>
        <StatusBadge tone={badge.tone}>{badge.label}</StatusBadge>
      </td>
    </tr>
  );
}
