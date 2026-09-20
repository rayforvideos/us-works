import { useSearchParams } from "react-router";

import {
  CONTENT_LIST_PARAM_KEYS,
  type ContentListFilters,
  parseContentListParams,
  useContentsQuery,
} from "@/entities/content";
import { NewPostButton } from "@/features/start-content";
import { ROUTES } from "@/shared/config";
import { getPageCount } from "@/shared/lib/pagination-params";
import { Container } from "@/shared/ui/container";
import { Pagination } from "@/shared/ui/pagination";
import { ListHeader, type ListHeaderTab } from "@/widgets/list-header";

import { ContentFilters } from "../content-filters";
import { ContentTable } from "../content-table";

/**
 * @constants
 */
const LIST_TABS: readonly ListHeaderTab[] = [
  { label: "콘텐츠", to: ROUTES.contents, end: true },
  { label: "알람", to: ROUTES.alarms },
];

const EMPTY_MESSAGE = "콘텐츠가 없습니다.";

const FILTERED_EMPTY_MESSAGE = "조건에 맞는 콘텐츠가 없습니다.";

function writeParam(params: URLSearchParams, key: string, value: string | undefined) {
  if (value === undefined) {
    params.delete(key);
    return;
  }
  params.set(key, value);
}

export function ContentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = parseContentListParams(searchParams);
  const { data, isPending, isFetching, isPlaceholderData, error, refetch } =
    useContentsQuery(params);

  const hasFilter = params.category !== undefined || params.publishStatus !== undefined;

  const applyFilters = (next: ContentListFilters) => {
    const nextParams = new URLSearchParams(searchParams);
    writeParam(nextParams, CONTENT_LIST_PARAM_KEYS.category, next.category);
    writeParam(nextParams, CONTENT_LIST_PARAM_KEYS.publishStatus, next.publishStatus);
    nextParams.delete(CONTENT_LIST_PARAM_KEYS.page);
    setSearchParams(nextParams);
  };

  const goToPage = (page: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set(CONTENT_LIST_PARAM_KEYS.page, String(page));
    setSearchParams(nextParams);
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
        {data ? (
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
