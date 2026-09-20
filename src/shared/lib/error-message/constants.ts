import { type ApiErrorKind } from "@/shared/api";

export const DEFAULT_ERROR_MESSAGE = "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

export const ERROR_MESSAGES: Record<ApiErrorKind, string> = {
  network: "네트워크 연결을 확인해주세요.",
  canceled: DEFAULT_ERROR_MESSAGE,
  unauthorized: "로그인이 필요합니다.",
  forbidden: "권한이 없습니다.",
  not_found: "요청한 내용을 찾을 수 없습니다.",
  conflict: "이미 처리된 요청입니다.",
  validation: "입력값을 확인해주세요.",
  server: "잠시 후 다시 시도해주세요.",
  unknown: DEFAULT_ERROR_MESSAGE,
};
