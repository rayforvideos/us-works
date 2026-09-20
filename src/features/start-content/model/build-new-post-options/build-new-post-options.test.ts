import { type ContentDraft } from "@/entities/content";

import { buildNewPostOptions } from ".";

const DRAFT: ContentDraft = {
  title: "제목",
  body: "내용",
  categories: ["realty"],
  linkUrl: "",
  savedAt: "2026-09-20T07:41:00.000Z",
};

describe("buildNewPostOptions", () => {
  it("R-02 임시저장이 없으면 이어쓰기 항목을 만들지 않는다", () => {
    expect(buildNewPostOptions(null)).toEqual([
      {
        id: "new",
        icon: "chat",
        title: "콘텐츠 쓰기",
        description: "커뮤니티, 소통이 가능한 기본 포스트",
      },
    ]);
  });

  it('R-01 저장 시각은 Asia/Seoul 기준 "YYYY년 MM월 DD일 HH:mm"으로 표시한다', () => {
    const options = buildNewPostOptions(DRAFT);

    expect(options).toHaveLength(2);
    expect(options[0]?.id).toBe("continue");
    expect(options[0]?.description).toContain("임시 저장된 시간 :");
  });
});
