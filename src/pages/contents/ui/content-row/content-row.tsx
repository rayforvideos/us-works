import { Link, useNavigate } from "react-router";

import { type Content, formatPublishedAt, getPublishStatusBadge } from "@/entities/content";
import { ROUTES } from "@/shared/config";
import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/button";
import { dataCellVariants } from "@/shared/ui/data-table";
import { StatusBadge } from "@/shared/ui/status-badge";

import {
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
  const detailPath = ROUTES.contentDetail(content.id);
  const publishedAt = formatPublishedAt(content.published_at);
  const badge = getPublishStatusBadge(content.publish_status);
  const isNotifiable =
    !content.notification_status.has_notification && content.publish_status !== "draft";

  return (
    <tr
      className={rowClass()}
      onClick={() => {
        void navigate(detailPath);
      }}
    >
      <td className={dataCellVariants()}>{content.id}</td>
      <td className={dataCellVariants()}>
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
          {isNotifiable ? (
            <Link
              to={ROUTES.alarmNewForContent(content.id)}
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
          ) : null}
        </div>
      </td>
      <td className={dataCellVariants({ align: "center" })}>
        {publishedAt ? (
          <span className={dateStackClass()}>
            <span>{publishedAt.date}</span>
            <span>{publishedAt.time}</span>
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
