import { type ContentFormValues } from "../content-input-schema";
import { toContentInput } from ".";

const VALUES: ContentFormValues = {
  title: "제목",
  body: "내용",
  categories: ["realty"],
  linkUrl: "",
};

describe("toContentInput", () => {
  it("R-07 요청 본문은 삽입된 링크가 있으면 `link_url`을 포함하고, 수정 화면에서 링크를 지웠으면 빈 문자열을 보낸다", () => {
    expect(
      toContentInput({ ...VALUES, linkUrl: "https://example.com" }, { editing: false }),
    ).toEqual({
      title: "제목",
      body: "내용",
      categories: ["realty"],
      link_url: "https://example.com",
    });
    expect(toContentInput(VALUES, { editing: true })).toEqual({
      title: "제목",
      body: "내용",
      categories: ["realty"],
      link_url: "",
    });
  });

  it("작성 화면에서 링크가 없으면 `link_url`을 보내지 않는다", () => {
    expect(toContentInput(VALUES, { editing: false })).toEqual({
      title: "제목",
      body: "내용",
      categories: ["realty"],
    });
  });
});
