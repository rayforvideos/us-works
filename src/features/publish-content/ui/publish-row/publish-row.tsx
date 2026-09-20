import { controlClass, labelClass, rowClass } from "./publish-row-variants";
import { type PublishRowProps } from "./types";

export function PublishRow({ label, align = "start", children }: PublishRowProps) {
  return (
    <div className={rowClass({ align })}>
      <p className={labelClass()}>{label}</p>
      <div className={controlClass()}>{children}</div>
    </div>
  );
}
