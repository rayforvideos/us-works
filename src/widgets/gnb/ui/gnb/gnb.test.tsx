import { fireEvent, render, screen } from "@testing-library/react";

import { Gnb } from ".";

describe("Gnb", () => {
  it("S-01 Given 제목을 넘겼을 때 When GNB가 렌더링되면 Then 제목이 1단계 헤딩으로 보인다", () => {
    render(<Gnb title="커뮤니티 쓰기" />);

    expect(screen.getByRole("heading", { level: 1, name: "커뮤니티 쓰기" })).toBeInTheDocument();
  });

  it("S-02 Given 상태 문구를 넘겼을 때 When GNB가 렌더링되면 Then 그 문구가 보인다", () => {
    render(<Gnb title="커뮤니티 쓰기" message="해당 글이 임시 저장되었습니다 16:41" />);

    expect(screen.getByText("해당 글이 임시 저장되었습니다 16:41")).toBeInTheDocument();
  });

  it("S-03 Given 상태 문구를 넘기지 않았을 때 When GNB가 렌더링되면 Then 상태 문구 영역이 없다", () => {
    render(<Gnb title="커뮤니티 쓰기" />);

    expect(screen.queryByText("해당 글이 임시 저장되었습니다 16:41")).not.toBeInTheDocument();
  });

  it("S-04 Given `onBack`과 제목을 넘겼을 때 When 화살표와 제목으로 이뤄진 뒤로가기 버튼을 클릭하면 Then `onBack`이 한 번 호출되고 제목은 1단계 헤딩으로 남는다", () => {
    const onBack = vi.fn();
    render(<Gnb title="커뮤니티 쓰기" onBack={onBack} />);

    fireEvent.click(screen.getByRole("button", { name: "커뮤니티 쓰기" }));

    expect(onBack).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("heading", { level: 1, name: "커뮤니티 쓰기" })).toBeInTheDocument();
  });

  it("S-05 Given `onBack`을 넘기지 않았을 때 When GNB가 렌더링되면 Then 뒤로가기 버튼이 없다", () => {
    render(<Gnb title="커뮤니티 쓰기" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("S-06 Given 우측 버튼 요소를 넘겼을 때 When GNB가 렌더링되면 Then 그 요소가 우측에 보인다", () => {
    render(<Gnb title="커뮤니티 쓰기" actions={<button type="button">발행하기</button>} />);

    expect(screen.getByRole("button", { name: "발행하기" })).toBeInTheDocument();
  });

  it("S-07 Given GNB가 렌더링된 상태 When 접근성 트리를 보면 Then banner 랜드마크가 있다", () => {
    render(<Gnb title="커뮤니티 쓰기" />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it('S-08 Given `onBack`만 넘기고 제목이 없을 때 When GNB가 렌더링되면 Then 접근성 이름이 "뒤로 가기"인 버튼이 보인다', () => {
    const onBack = vi.fn();
    render(<Gnb onBack={onBack} />);

    fireEvent.click(screen.getByRole("button", { name: "뒤로 가기" }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
