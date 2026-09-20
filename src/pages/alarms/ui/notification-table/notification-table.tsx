import { type Notification } from "@/entities/notification";
import { getErrorMessage } from "@/shared/lib/error-message";
import { Button } from "@/shared/ui/button";
import { DataTable, type DataTableColumn, TableStateRow } from "@/shared/ui/data-table";
import { Spinner } from "@/shared/ui/spinner";

import { NotificationRow } from "../notification-row";

/**
 * @types
 */
type NotificationTableProps = {
  notifications: readonly Notification[];
  isLoading: boolean;
  isFetching?: boolean;
  error: unknown;
  onRetry: () => void;
  emptyMessage: string;
};

type NotificationTableBodyProps = Omit<NotificationTableProps, "isFetching">;

/**
 * @constants
 */
const COLUMNS: readonly DataTableColumn[] = [
  { label: "번호", width: "narrow" },
  { label: "제목" },
  { label: "발송 성공", align: "center", width: "narrow" },
  { label: "발송 실패", align: "center", width: "narrow" },
  { label: "발송 날짜", align: "center", width: "narrow" },
  { label: "상태", align: "center", width: "narrow" },
];

function NotificationTableBody({
  notifications,
  isLoading,
  error,
  onRetry,
  emptyMessage,
}: NotificationTableBodyProps) {
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
  if (notifications.length === 0) {
    return <TableStateRow columnCount={COLUMNS.length}>{emptyMessage}</TableStateRow>;
  }
  return notifications.map((notification) => (
    <NotificationRow key={notification.id} notification={notification} />
  ));
}

export function NotificationTable({
  notifications,
  isLoading,
  isFetching = false,
  error,
  onRetry,
  emptyMessage,
}: NotificationTableProps) {
  return (
    <DataTable columns={COLUMNS} isFetching={isFetching && notifications.length > 0}>
      <NotificationTableBody
        notifications={notifications}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        emptyMessage={emptyMessage}
      />
    </DataTable>
  );
}
