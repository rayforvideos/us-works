import { render, screen } from "@testing-library/react";

import { DataTable, type DataTableColumn, TableStateRow } from ".";

const COLUMNS: readonly DataTableColumn[] = [
  { label: "번호", width: "narrow" },
  { label: "제목" },
  { label: "상태", align: "center", width: "narrow" },
];

function renderDataTable(isFetching?: boolean) {
  render(
    <DataTable columns={COLUMNS} isFetching={isFetching}>
      <TableStateRow columnCount={COLUMNS.length}>내용이 없습니다.</TableStateRow>
    </DataTable>,
  );
}

describe("DataTable", () => {
  it("넘긴 컬럼 이름을 머리글로 보여준다", () => {
    renderDataTable();

    expect(screen.getByRole("columnheader", { name: "번호" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "제목" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "상태" })).toBeInTheDocument();
  });

  it("다시 불러오는 중이면 표가 aria-busy가 된다", () => {
    renderDataTable(true);

    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
  });

  it("다시 불러오는 중이 아니면 aria-busy를 켜지 않는다", () => {
    renderDataTable();

    expect(screen.getByRole("table")).not.toHaveAttribute("aria-busy");
  });

  it("상태 행은 모든 열을 가로지른다", () => {
    renderDataTable();

    expect(screen.getByRole("cell", { name: "내용이 없습니다." })).toHaveAttribute("colspan", "3");
  });
});
