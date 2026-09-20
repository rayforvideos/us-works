import {
  clearContentDraft,
  formatSavedAt,
  formatSavedAtDateTime,
  readContentDraft,
  writeContentDraft,
} from ".";
import { CONTENT_DRAFT_KEY } from "./constants";
import { type ContentDraftValues } from "./types";

const FILLED_VALUES: ContentDraftValues = {
  title: "제목",
  body: "내용",
  categories: ["realty"],
  linkUrl: "https://example.com",
};

const EMPTY_VALUES: ContentDraftValues = { title: "", body: "", categories: [], linkUrl: "" };

function readStoredDraft(): Record<string, unknown> {
  const raw = localStorage.getItem(CONTENT_DRAFT_KEY);
  if (raw === null) {
    throw new Error("임시저장 값이 없습니다");
  }
  return JSON.parse(raw) as Record<string, unknown>;
}

describe("임시저장", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("R-06 임시저장 값은 제목, 내용, 카테고리, 링크, 저장 시각으로 저장되고, 네 필드가 모두 비어 있으면 저장하지 않는다", () => {
    const savedAt = writeContentDraft(FILLED_VALUES);

    expect(readStoredDraft()).toEqual({ ...FILLED_VALUES, savedAt });
    expect(writeContentDraft(EMPTY_VALUES)).toBeNull();
  });

  it("빈 값은 저장하지 않으므로 이전 임시저장이 남는다", () => {
    writeContentDraft(FILLED_VALUES);

    writeContentDraft(EMPTY_VALUES);

    expect(readContentDraft()).toMatchObject(FILLED_VALUES);
  });

  it("임시저장이 없으면 null을 돌려준다", () => {
    expect(readContentDraft()).toBeNull();
  });

  it("저장된 값을 저장 시각과 함께 돌려준다", () => {
    const savedAt = writeContentDraft(FILLED_VALUES);

    expect(readContentDraft()).toEqual({ ...FILLED_VALUES, savedAt });
  });

  it("손상된 임시저장은 null로 읽는다", () => {
    localStorage.setItem(CONTENT_DRAFT_KEY, "{");
    expect(readContentDraft()).toBeNull();

    localStorage.setItem(CONTENT_DRAFT_KEY, JSON.stringify({ title: 1, categories: ["없는값"] }));
    expect(readContentDraft()).toBeNull();
  });

  it("내용이 모두 빈 임시저장은 null로 읽는다", () => {
    localStorage.setItem(
      CONTENT_DRAFT_KEY,
      JSON.stringify({ ...EMPTY_VALUES, savedAt: "2026-09-20T07:41:00.000Z" }),
    );

    expect(readContentDraft()).toBeNull();
  });

  it("로컬 스토리지를 읽을 수 없으면 null을 돌려준다", () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(readContentDraft()).toBeNull();

    getItem.mockRestore();
  });

  it("임시저장을 지운다", () => {
    writeContentDraft(FILLED_VALUES);

    clearContentDraft();

    expect(readContentDraft()).toBeNull();
  });

  it("저장 시각을 서울 기준 HH:mm으로 보여준다", () => {
    expect(formatSavedAt("2026-09-20T07:41:00.000Z")).toBe("16:41");
  });

  it('R-01 저장 시각은 Asia/Seoul 기준 "YYYY년 MM월 DD일 HH:mm"으로 표시한다', () => {
    expect(formatSavedAtDateTime("2026-09-20T07:41:00.000Z")).toBe("2026년 09월 20일 16:41");
    expect(formatSavedAtDateTime("2026-01-05T15:00:00.000Z")).toBe("2026년 01월 06일 00:00");
  });
});
