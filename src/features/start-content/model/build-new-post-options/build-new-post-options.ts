import { type ContentDraft, formatSavedAtDateTime } from "@/entities/content";

import { type NewPostOption } from "./types";

/**
 * @constants
 */
const NEW_POST_OPTION: NewPostOption = {
  id: "new",
  icon: "chat",
  title: "콘텐츠 쓰기",
  description: "커뮤니티, 소통이 가능한 기본 포스트",
};

export function buildNewPostOptions(draft: ContentDraft | null): NewPostOption[] {
  if (draft === null) {
    return [NEW_POST_OPTION];
  }
  return [
    {
      id: "continue",
      icon: "pen",
      title: "임시 저장된 콘텐츠 이어서 쓰기",
      description: `(임시 저장된 시간 : ${formatSavedAtDateTime(draft.savedAt)})`,
    },
    NEW_POST_OPTION,
  ];
}
