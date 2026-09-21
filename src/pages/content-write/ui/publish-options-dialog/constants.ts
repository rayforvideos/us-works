import { type PublishVisibility } from "../../model/publish-options-schema";

export const PUBLISH_OPTIONS_FORM_ID = "publish-options-form";

export const VISIBILITY_LABELS: Record<PublishVisibility, string> = {
  public: "공개",
  private: "비공개",
  scheduled: "예약 발행",
};

export const SCHEDULE_DISABLED_VALUES = ["scheduled"] satisfies readonly PublishVisibility[];
