import { type ContentDraft } from "@/entities/content";

import { toContentFormValues } from ".";

const DRAFT: ContentDraft = {
  title: "제목",
  body: "내용",
  categories: ["realty"],
  linkUrl: "https://example.com",
  savedAt: "2026-09-20T07:41:00.000Z",
};

describe("toContentFormValues", () => {
  it("임시저장이 없으면 빈 폼 값을 돌려준다", () => {
    expect(toContentFormValues(null)).toEqual({
      title: "",
      body: "",
      categories: [],
      linkUrl: "",
    });
  });

  it("임시저장의 저장 시각을 뺀 폼 값을 돌려준다", () => {
    expect(toContentFormValues(DRAFT)).toEqual({
      title: "제목",
      body: "내용",
      categories: ["realty"],
      linkUrl: "https://example.com",
    });
  });
});
