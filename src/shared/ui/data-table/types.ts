import { type ReactNode } from "react";

type DataTableColumnAlign = "left" | "center";

type DataTableColumnWidth = "auto" | "narrow";

export type DataTableColumn = {
  label: string;
  align?: DataTableColumnAlign;
  width?: DataTableColumnWidth;
};

export type DataTableProps = {
  columns: readonly DataTableColumn[];
  isFetching?: boolean;
  children: ReactNode;
};

export type TableStateRowProps = {
  columnCount: number;
  children: ReactNode;
};
