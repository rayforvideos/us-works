import { type ReactNode } from "react";

import { type Content } from "@/entities/content";
import { cn } from "@/shared/lib/cn";
import { getErrorMessage } from "@/shared/lib/error-message";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";

import { ContentRow } from "../content-row";
import {
  bodyClass,
  dateColumnClass,
  headCellClass,
  numberColumnClass,
  stateCellClass,
  stateStackClass,
  statusColumnClass,
  tableClass,
  wrapperClass,
} from "./content-table-variants";

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
const COLUMN_COUNT = 4;

function StateRow({ children }: { children: ReactNode }) {
  return (
    <tr>
      <td colSpan={COLUMN_COUNT} className={stateCellClass()}>
        <div className={stateStackClass()}>{children}</div>
      </td>
    </tr>
  );
}

function ContentTableBody({
  contents,
  isLoading,
  error,
  onRetry,
  emptyMessage,
}: ContentTableBodyProps) {
  if (isLoading) {
    return (
      <StateRow>
        <Spinner aria-label="목록 불러오는 중" />
      </StateRow>
    );
  }
  if (error) {
    return (
      <StateRow>
        <p>{getErrorMessage(error)}</p>
        <Button variant="outline" size="small" onClick={onRetry}>
          다시 시도
        </Button>
      </StateRow>
    );
  }
  if (contents.length === 0) {
    return <StateRow>{emptyMessage}</StateRow>;
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
  const isRefreshing = isFetching && contents.length > 0;

  return (
    <div className={wrapperClass()}>
      <table aria-busy={isRefreshing || undefined} className={tableClass()}>
        <thead>
          <tr>
            <th scope="col" className={cn(headCellClass(), numberColumnClass())}>
              번호
            </th>
            <th scope="col" className={headCellClass()}>
              제목
            </th>
            <th scope="col" className={cn(headCellClass(), dateColumnClass())}>
              공개일자
            </th>
            <th scope="col" className={cn(headCellClass(), statusColumnClass())}>
              상태
            </th>
          </tr>
        </thead>
        <tbody className={bodyClass({ fetching: isRefreshing })}>
          <ContentTableBody
            contents={contents}
            isLoading={isLoading}
            error={error}
            onRetry={onRetry}
            emptyMessage={emptyMessage}
          />
        </tbody>
      </table>
    </div>
  );
}
