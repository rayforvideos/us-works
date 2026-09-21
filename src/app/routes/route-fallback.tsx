import { Spinner } from "@/shared/ui/spinner";

export function RouteFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Spinner aria-label="화면 불러오는 중" />
    </div>
  );
}
