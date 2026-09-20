import { contentInputSchema, isHttpUrl } from ".";
import { type ContentFormValues } from "./types";

const VALID_VALUES: ContentFormValues = {
  title: "제목",
  body: "내용",
  categories: ["realty"],
  linkUrl: "",
};

function readMessage(
  values: ContentFormValues,
  field: keyof ContentFormValues,
): string | undefined {
  const result = contentInputSchema.safeParse(values);
  return result.error?.issues.find((issue) => issue.path[0] === field)?.message;
}

describe("contentInputSchema", () => {
  it('R-01 카테고리가 0개면 "카테고리를 1개 이상 선택해주세요." 오류다', () => {
    expect(readMessage({ ...VALID_VALUES, categories: [] }, "categories")).toBe(
      "카테고리를 1개 이상 선택해주세요.",
    );
  });

  it('R-03 제목이 비어 있으면 "제목을 입력해주세요." 오류다', () => {
    expect(readMessage({ ...VALID_VALUES, title: "  " }, "title")).toBe("제목을 입력해주세요.");
  });

  it('R-04 내용이 비어 있으면 "내용을 입력해주세요." 오류다', () => {
    expect(readMessage({ ...VALID_VALUES, body: "" }, "body")).toBe("내용을 입력해주세요.");
  });

  it("제목은 50자, 내용은 500자, 카테고리는 3개까지 허용한다", () => {
    const atLimit: ContentFormValues = {
      title: "가".repeat(50),
      body: "나".repeat(500),
      categories: ["realty", "investment", "safeAsset"],
      linkUrl: "",
    };

    expect(contentInputSchema.safeParse(atLimit).success).toBe(true);
    expect(readMessage({ ...atLimit, title: "가".repeat(51) }, "title")).toBeDefined();
    expect(readMessage({ ...atLimit, body: "나".repeat(501) }, "body")).toBeDefined();
    expect(
      readMessage(
        { ...atLimit, categories: ["realty", "investment", "safeAsset", "macroEconomics"] },
        "categories",
      ),
    ).toBeDefined();
  });
});

describe("isHttpUrl", () => {
  it("R-05 링크 입력값이 `http://` 또는 `https://`로 시작하는 URL이면 삽입할 수 있고, 아니면 삽입할 수 없다", () => {
    expect(isHttpUrl("https://example.com")).toBe(true);
    expect(isHttpUrl("http://example.com/path?q=1")).toBe(true);
    expect(isHttpUrl("example")).toBe(false);
    expect(isHttpUrl("ftp://example.com")).toBe(false);
    expect(isHttpUrl("")).toBe(false);
  });
});
