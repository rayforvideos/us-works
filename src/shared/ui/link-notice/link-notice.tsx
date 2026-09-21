import { Link } from "react-router";

import { linkClass, messageClass, noticeClass } from "./link-notice-variants";
import { type LinkNoticeProps } from "./types";

export function LinkNotice({ message, linkLabel, to }: LinkNoticeProps) {
  return (
    <div className={noticeClass()}>
      <p className={messageClass()}>{message}</p>
      <Link to={to} viewTransition className={linkClass()}>
        {linkLabel}
      </Link>
    </div>
  );
}
