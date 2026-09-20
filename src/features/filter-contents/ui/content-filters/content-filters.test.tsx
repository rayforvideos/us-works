import { fireEvent, render, screen } from "@testing-library/react";

import { ContentFilters } from ".";

async function pickOption(filterName: string, optionName: string) {
  fireEvent.click(screen.getByRole("combobox", { name: filterName }));
  const option = await screen.findByRole("option", { name: optionName });
  fireEvent.pointerDown(option);
  fireEvent.click(option);
}

describe("ContentFilters", () => {
  it('상태 필터를 "공개"로 고르면 publishStatus를 담아 변경을 알린다', async () => {
    const onChange = vi.fn();
    render(<ContentFilters onChange={onChange} />);

    await pickOption("상태", "공개");

    expect(onChange).toHaveBeenCalledWith({ category: undefined, publishStatus: "published" });
  });

  it('카테고리 필터를 "전체"로 되돌리면 category 없이 변경을 알린다', async () => {
    const onChange = vi.fn();
    render(<ContentFilters category="realty" publishStatus="draft" onChange={onChange} />);

    await pickOption("카테고리", "전체");

    expect(onChange).toHaveBeenCalledWith({ category: undefined, publishStatus: "draft" });
  });

  it("한쪽 필터를 바꿔도 다른 쪽 필터는 그대로 전달한다", async () => {
    const onChange = vi.fn();
    render(<ContentFilters category="realty" onChange={onChange} />);

    await pickOption("상태", "예약");

    expect(onChange).toHaveBeenCalledWith({ category: "realty", publishStatus: "scheduled" });
  });

  it("필터가 없으면 플레이스홀더를 보여준다", () => {
    render(<ContentFilters onChange={vi.fn()} />);

    expect(screen.getByRole("combobox", { name: "카테고리" })).toHaveTextContent("카테고리");
    expect(screen.getByRole("combobox", { name: "상태" })).toHaveTextContent("상태");
  });

  it("선택된 필터는 한글 라벨을 보여준다", () => {
    render(<ContentFilters category="realty" publishStatus="published" onChange={vi.fn()} />);

    expect(screen.getByRole("combobox", { name: "카테고리" })).toHaveTextContent("부동산");
    expect(screen.getByRole("combobox", { name: "상태" })).toHaveTextContent("공개");
  });
});
