import { type Content } from "@/entities/content";
import { getErrorMessage } from "@/shared/lib/error-message";
import { Button } from "@/shared/ui/button";
import { DataTable, type DataTableColumn, TableStateRow } from "@/shared/ui/data-table";
import { Spinner } from "@/shared/ui/spinner";

import { ContentRow } from "../content-row";

/**
 * @types
 */
type ContentTableProps = {
  contents: readonly Content[];
  isLoading: boolean;
  isFetching?: boolean;
  error: unknown;
  onRetry: () => void;
  emptyMessage: string;
};

type ContentTableBodyProps = Omit<ContentTableProps, "isFetching">;

/**
 * @constants
 */
const COLUMNS: readonly DataTableColumn[] = [
  { label: "번호", width: "narrow" },
  { label: "제목" },
  { label: "공개일자", align: "center", width: "narrow" },
  { label: "상태", align: "center", width: "narrow" },
];

function ContentTableBody({
  contents,
  isLoading,
  error,
  onRetry,
  emptyMessage,
}: ContentTableBodyProps) {
  if (isLoading) {
    return (
      <TableStateRow columnCount={COLUMNS.length}>
        <Spinner aria-label="목록 불러오는 중" />
      </TableStateRow>
    );
  }
  if (error) {
    return (
      <TableStateRow columnCount={COLUMNS.length}>
        <p>{getErrorMessage(error)}</p>
        <Button variant="outline" size="small" onClick={onRetry}>
          다시 시도
        </Button>
      </TableStateRow>
    );
  }
  if (contents.length === 0) {
    return <TableStateRow columnCount={COLUMNS.length}>{emptyMessage}</TableStateRow>;
  }
  return contents.map((content) => <ContentRow key={content.id} content={content} />);
}

export function ContentTable({
  contents,
  isLoading,
  isFetching = false,
  error,
  onRetry,
  emptyMessage,
}: ContentTableProps) {
  return (
    <DataTable columns={COLUMNS} isFetching={isFetching && contents.length > 0}>
      <ContentTableBody
        contents={contents}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        emptyMessage={emptyMessage}
      />
    </DataTable>
  );
}
