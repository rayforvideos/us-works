import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { writeContentDraft } from "@/entities/content";

import { NewPostButton } from ".";

function renderNewPostButton() {
  const router = createMemoryRouter(
    [
      { path: "/", element: <NewPostButton /> },
      { path: "/contents/new", element: <p>작성 화면</p> },
    ],
    { initialEntries: ["/"] },
  );

  render(<RouterProvider router={router} />);

  return { router };
}

function openDialog() {
  fireEvent.click(screen.getByRole("button", { name: "새 글쓰기" }));
}

describe("NewPostButton", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('S-01 Given 목록 페이지 When "새 글쓰기"를 누르면 Then "새글쓰기" 다이얼로그가 열린다', () => {
    renderNewPostButton();

    openDialog();

    expect(screen.getByRole("dialog", { name: "새글쓰기" })).toBeInTheDocument();
  });

  it('S-06 Given 다이얼로그가 열린 상태 When Esc를 누르거나 닫기 버튼을 누르면 Then 다이얼로그가 닫히고 포커스가 "새 글쓰기" 버튼으로 돌아간다', async () => {
    renderNewPostButton();
    openDialog();

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
    expect(screen.getByRole("button", { name: "새 글쓰기" })).toHaveFocus();

    openDialog();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
    expect(screen.getByRole("button", { name: "새 글쓰기" })).toHaveFocus();
  });

  it("S-08 Given 모달을 닫은 뒤 임시저장이 생겼을 때 When 모달을 다시 열면 Then 이어쓰기 항목이 보인다", async () => {
    renderNewPostButton();

    openDialog();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    writeContentDraft({ title: "제목", body: "내용", categories: ["realty"], linkUrl: "" });
    openDialog();

    expect(
      screen.getByRole("button", { name: /임시 저장된 콘텐츠 이어서 쓰기/ }),
    ).toBeInTheDocument();
  });
});
