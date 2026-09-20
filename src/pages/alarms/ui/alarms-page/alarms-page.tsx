import { useSearchParams } from "react-router";

import {
  NOTIFICATION_LIST_PARAM_KEYS,
  parseNotificationListParams,
  useNotificationsQuery,
} from "@/entities/notification";
import { NewPostButton } from "@/features/start-content";
import { ROUTES } from "@/shared/config";
import { getPageCount } from "@/shared/lib/pagination-params";
import { Container } from "@/shared/ui/container";
import { Pagination } from "@/shared/ui/pagination";
import { ListHeader, type ListHeaderTab } from "@/widgets/list-header";

import { NotificationTable } from "../notification-table";

/**
 * @constants
 */
const LIST_TABS: readonly ListHeaderTab[] = [
  { label: "콘텐츠", to: ROUTES.contents, end: true },
  { label: "알람", to: ROUTES.alarms },
];

const EMPTY_MESSAGE = "알림이 없습니다.";

export function AlarmsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = parseNotificationListParams(searchParams);
  const { data, isPending, isFetching, isPlaceholderData, error, refetch } =
    useNotificationsQuery(params);

  const goToPage = (page: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set(NOTIFICATION_LIST_PARAM_KEYS.page, String(page));
    setSearchParams(nextParams);
  };

  return (
    <>
      <ListHeader homeTo={ROUTES.contents} tabs={LIST_TABS} action={<NewPostButton />} />
      <Container as="main" className="flex flex-col gap-6 py-10">
        <h1 className="text-32-b700 text-blue-grey-300">알람</h1>
        <NotificationTable
          notifications={data?.notifications ?? []}
          isLoading={isPending}
          isFetching={isFetching && isPlaceholderData}
          error={error}
          emptyMessage={EMPTY_MESSAGE}
          onRetry={() => {
            void refetch();
          }}
        />
        {data && data.total > 0 ? (
          <Pagination
            page={params.page}
            pageCount={getPageCount(data.total, data.limit)}
            onPageChange={goToPage}
          />
        ) : null}
      </Container>
    </>
  );
}
