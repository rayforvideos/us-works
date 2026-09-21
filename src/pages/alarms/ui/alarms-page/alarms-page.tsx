import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import {
  NOTIFICATION_LIST_PARAM_KEYS,
  notificationQueries,
  parseNotificationListParams,
} from "@/entities/notification";
import { NewPostButton } from "@/features/start-content";
import { useHttpClient } from "@/shared/api";
import { ROUTES } from "@/shared/config";
import { getPageCount, withPage } from "@/shared/lib/pagination-params";
import { Container } from "@/shared/ui/container";
import { Pagination } from "@/shared/ui/pagination";
import { LIST_TABS, ListHeader } from "@/widgets/list-header";

import { NotificationTable } from "../notification-table";

/**
 * @constants
 */
const EMPTY_MESSAGE = "알림이 없습니다.";

export function AlarmsPage() {
  const client = useHttpClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = parseNotificationListParams(searchParams);
  const { data, isPending, isFetching, isPlaceholderData, error, refetch } = useQuery(
    notificationQueries.list(client, params),
  );

  const goToPage = (page: number) => {
    setSearchParams(withPage(searchParams, NOTIFICATION_LIST_PARAM_KEYS.page, page));
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
