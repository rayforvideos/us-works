import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import {
  CONTENT_LIST_PARAM_KEYS,
  type ContentListFilters,
  contentQueries,
  parseContentListParams,
  withContentListFilters,
} from "@/entities/content";
import { NewPostButton } from "@/features/start-content";
import { useHttpClient } from "@/shared/api";
import { ROUTES } from "@/shared/config";
import { getPageCount, withPage } from "@/shared/lib/pagination-params";
import { Container } from "@/shared/ui/container";
import { Pagination } from "@/shared/ui/pagination";
import { LIST_TABS, ListHeader } from "@/widgets/list-header";

import { ContentFilters } from "../content-filters";
import { ContentTable } from "../content-table";

/**
 * @constants
 */
const EMPTY_MESSAGE = "콘텐츠가 없습니다.";

const FILTERED_EMPTY_MESSAGE = "조건에 맞는 콘텐츠가 없습니다.";

export function ContentsPage() {
  const client = useHttpClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = parseContentListParams(searchParams);
  const { data, isPending, isFetching, isPlaceholderData, error, refetch } = useQuery(
    contentQueries.list(client, params),
  );

  const hasFilter = params.category !== undefined || params.publishStatus !== undefined;

  const applyFilters = (next: ContentListFilters) => {
    setSearchParams(withContentListFilters(searchParams, next));
  };

  const goToPage = (page: number) => {
    setSearchParams(withPage(searchParams, CONTENT_LIST_PARAM_KEYS.page, page));
  };

  return (
    <>
      <ListHeader homeTo={ROUTES.contents} tabs={LIST_TABS} action={<NewPostButton />} />
      <Container as="main" className="flex flex-col gap-6 py-10">
        <h1 className="text-32-b700 text-blue-grey-300">콘텐츠</h1>
        <ContentFilters
          category={params.category}
          publishStatus={params.publishStatus}
          onChange={applyFilters}
        />
        <ContentTable
          contents={data?.contents ?? []}
          isLoading={isPending}
          isFetching={isFetching && isPlaceholderData}
          error={error}
          emptyMessage={hasFilter ? FILTERED_EMPTY_MESSAGE : EMPTY_MESSAGE}
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
