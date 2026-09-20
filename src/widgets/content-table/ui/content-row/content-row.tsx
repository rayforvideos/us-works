import { Link, useNavigate } from "react-router";

import { type Content, formatPublishedAt, getPublishStatusBadge } from "@/entities/content";
import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/button";
import { StatusBadge } from "@/shared/ui/status-badge";

import {
  cellClass,
  centeredCellClass,
  dateStackClass,
  pushLinkClass,
  rowClass,
  titleLinkClass,
  titleRowClass,
} from "./content-row-variants";

/**
 * @types
 */
type ContentRowProps = {
  content: Content;
};

export function ContentRow({ content }: ContentRowProps) {
  const navigate = useNavigate();
  const detailPath = `/contents/${String(content.id)}`;
  const publishedAt = formatPublishedAt(content.published_at);
  const badge = getPublishStatusBadge(content.publish_status);

  return (
    <tr
      className={rowClass()}
      onClick={() => {
        void navigate(detailPath);
      }}
    >
      <td className={cellClass()}>{content.id}</td>
      <td className={cellClass()}>
        <div className={titleRowClass()}>
          <Link
            to={detailPath}
            className={titleLinkClass()}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {content.title}
          </Link>
          {content.notification_status.has_notification ? null : (
            <Link
              to={`/alarms/new?contentId=${String(content.id)}`}
              className={cn(
                buttonVariants({ variant: "outline", importance: "assistive", size: "small" }),
                pushLinkClass(),
              )}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              푸시알림 생성
            </Link>
          )}
        </div>
      </td>
      <td className={cn(cellClass(), centeredCellClass())}>
        {publishedAt ? (
          <span className={dateStackClass()}>
            <span>{publishedAt.date}</span>
            <span>{publishedAt.time}</span>
          </span>
        ) : (
          "-"
        )}
      </td>
      <td className={cn(cellClass(), centeredCellClass())}>
        <StatusBadge tone={badge.tone}>{badge.label}</StatusBadge>
      </td>
    </tr>
  );
}
