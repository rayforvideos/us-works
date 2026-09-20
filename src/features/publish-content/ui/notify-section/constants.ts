export const NOTIFY_VALUES = ["send", "none"] as const;

export const NOTIFY_LABELS: Record<(typeof NOTIFY_VALUES)[number], string> = {
  send: "발송",
  none: "미발송",
};

export const NOTIFICATION_TITLE_PLACEHOLDER = "알림 제목을 입력해주세요.";

export const NOTIFY_HELPER_TEXT =
  "비공개 상태로 발행시 알람 설정은 자동으로 미발송으로 처리됩니다.";

export const SENT_NOTIFICATION_TEXT = "이미 발송된 알림입니다.";
