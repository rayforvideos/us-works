import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { fireEvent, render, screen } from "@testing-library/react";

import { readContentDraft, writeContentDraft } from "@/entities/content";

import { NewPostDialog } from ".";

const SAVED_TIME_PATTERN = /\(임시 저장된 시간 : \d{4}년 \d{2}월 \d{2}일 \d{2}:\d{2}\)/;

function seedDraft() {
  writeContentDraft({ title: "제목", body: "내용", categories: ["realty"], linkUrl: "" });
}

function renderNewPostDialog() {
  const onOpenChange = vi.fn();
  const router = createMemoryRouter(
    [
      { path: "/", element: <NewPostDialog open onOpenChange={onOpenChange} /> },
      { path: "/contents/new", element: <p>작성 화면</p> },
    ],
    { initialEntries: ["/"] },
  );

  render(<RouterProvider router={router} />);

  return { router, onOpenChange };
}

describe("NewPostDialog", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('S-02 Given 임시저장이 없을 때 When 다이얼로그가 열리면 Then "콘텐츠 쓰기" 항목만 보인다', () => {
    renderNewPostDialog();

    expect(screen.getByRole("button", { name: /콘텐츠 쓰기/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /임시 저장된 콘텐츠 이어서 쓰기/ })).toBeNull();
  });

  it("S-03 Given 임시저장이 있을 때 When 다이얼로그가 열리면 Then 이어쓰기 항목에 저장 시각이 보이고 콘텐츠 쓰기 항목도 보인다", () => {
    seedDraft();

    renderNewPostDialog();

    expect(
      screen.getByRole("button", { name: /임시 저장된 콘텐츠 이어서 쓰기/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(SAVED_TIME_PATTERN)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /콘텐츠 쓰기/ })).toBeInTheDocument();
  });

  it("S-04 Given 임시저장이 있을 때 When 이어쓰기를 누르면 Then 임시저장을 유지한 채 `/contents/new`로 이동한다", async () => {
    seedDraft();
    const { onOpenChange } = renderNewPostDialog();

    fireEvent.click(screen.getByRole("button", { name: /임시 저장된 콘텐츠 이어서 쓰기/ }));

    expect(await screen.findByText("작성 화면")).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(readContentDraft()).not.toBeNull();
  });

  it("S-05 Given 임시저장이 있을 때 When 콘텐츠 쓰기를 누르면 Then 임시저장을 지우고 `/contents/new`로 이동한다", async () => {
    seedDraft();
    const { onOpenChange } = renderNewPostDialog();

    fireEvent.click(screen.getByRole("button", { name: /^콘텐츠 쓰기/ }));

    expect(await screen.findByText("작성 화면")).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(readContentDraft()).toBeNull();
  });
});
