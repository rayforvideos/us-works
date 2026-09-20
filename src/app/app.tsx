import { Button } from "@/shared/ui/button";

export function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-18-b700">US Alliance</h1>
      <div className="flex items-center gap-3">
        <Button>발행하기</Button>
        <Button importance="secondary" size="medium">
          임시저장
        </Button>
        <Button importance="assistive" size="medium">
          취소
        </Button>
        <Button disabled>비활성</Button>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline">아웃라인</Button>
        <Button variant="outline" importance="secondary" size="small">
          작은 버튼
        </Button>
        <Button variant="outline" importance="assistive" size="small">
          보조
        </Button>
        <Button variant="text">더보기</Button>
      </div>
    </main>
  );
}
