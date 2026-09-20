import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { type ContentFormValues } from "../../model/content-input-schema";
import { CONTENT_FORM_ID, ContentForm } from ".";

const EMPTY_VALUES: ContentFormValues = { title: "", body: "", categories: [], linkUrl: "" };

function renderContentForm(defaultValues: ContentFormValues = EMPTY_VALUES) {
  const onSubmit = vi.fn();

  render(
    <>
      <ContentForm
        formId={CONTENT_FORM_ID}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isPending={false}
      />
      <button type="submit" form={CONTENT_FORM_ID}>
        발행하기
      </button>
    </>,
  );

  return { onSubmit };
}

function submitForm() {
  fireEvent.click(screen.getByRole("button", { name: "발행하기" }));
}

function typeLink(value: string) {
  fireEvent.change(screen.getByLabelText("링크"), { target: { value } });
}

describe("ContentForm", () => {
  it("S-01 Given 빈 작성 폼 When 발행하기를 누르면 Then 카테고리, 제목, 내용 오류가 보이고 요청을 보내지 않는다", () => {
    const { onSubmit } = renderContentForm();

    submitForm();

    expect(screen.getByText("카테고리를 1개 이상 선택해주세요.")).toBeInTheDocument();
    expect(screen.getByText("제목을 입력해주세요.")).toBeInTheDocument();
    expect(screen.getByText("내용을 입력해주세요.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("S-02 Given 카테고리 3개를 선택한 상태 When 네 번째 칩을 누르면 Then 선택되지 않고 세 개가 유지된다", () => {
    renderContentForm({ ...EMPTY_VALUES, categories: ["realty", "investment", "safeAsset"] });

    fireEvent.click(screen.getByRole("checkbox", { name: "거시경제" }));

    expect(screen.getByRole("checkbox", { name: "거시경제" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "부동산" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "투자기법" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "안전자산" })).toBeChecked();
  });

  it('S-03 Given 링크 입력에 "example" When 입력하면 Then 삽입 버튼이 비활성이고, "https://example.com"이면 활성이다', () => {
    renderContentForm();

    typeLink("example");

    expect(screen.getByRole("button", { name: "삽입" })).toBeDisabled();
    expect(screen.getByText("올바른 링크 형식이 아닙니다.")).toBeInTheDocument();

    typeLink("https://example.com");

    expect(screen.getByRole("button", { name: "삽입" })).toBeEnabled();
  });

  it("S-04 Given 삽입 가능한 링크 When 삽입을 누르면 Then 링크가 아래에 표시되고 입력창이 비활성이 된다", () => {
    renderContentForm();

    typeLink("https://example.com");
    fireEvent.click(screen.getByRole("button", { name: "삽입" }));

    const inserted = screen.getByRole("group", { name: "삽입된 링크" });
    expect(within(inserted).getByRole("textbox")).toHaveValue("https://example.com");
    expect(screen.getByLabelText("링크")).toBeDisabled();
    expect(screen.getByLabelText("링크")).toHaveAttribute("placeholder", "삽입된 링크가 있습니다.");
  });

  it("S-05 Given 삽입된 링크 When 지우기를 누르면 Then 링크가 사라지고 입력창이 활성이 된다", () => {
    renderContentForm({ ...EMPTY_VALUES, linkUrl: "https://example.com" });

    const inserted = screen.getByRole("group", { name: "삽입된 링크" });
    fireEvent.click(within(inserted).getByRole("button", { name: "입력 지우기" }));

    expect(screen.queryByRole("group", { name: "삽입된 링크" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("링크")).toBeEnabled();
    expect(screen.getByLabelText("링크")).toHaveAttribute("placeholder", "링크를 입력해주세요.");
  });

  it("모든 값이 유효하면 폼 값을 넘긴다", async () => {
    const { onSubmit } = renderContentForm({
      title: "제목",
      body: "내용",
      categories: ["realty"],
      linkUrl: "",
    });

    submitForm();

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: "제목",
        body: "내용",
        categories: ["realty"],
        linkUrl: "",
      });
    });
  });
});
