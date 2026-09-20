import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { CheckboxChip } from "@/shared/ui/checkbox-chip";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";

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
      <div className="flex items-center gap-4">
        <Checkbox aria-label="medium" />
        <Checkbox aria-label="medium checked" defaultChecked />
        <Checkbox aria-label="large" size="large" />
        <Checkbox aria-label="large checked" size="large" defaultChecked />
        <Checkbox aria-label="disabled" disabled />
        <Checkbox aria-label="disabled checked" disabled defaultChecked />
      </div>
      <div className="flex items-center gap-2">
        <CheckboxChip defaultChecked>고객센터</CheckboxChip>
        <CheckboxChip shape="solid">거래안내</CheckboxChip>
        <CheckboxChip>공지사항</CheckboxChip>
        <CheckboxChip disabled>비활성</CheckboxChip>
      </div>
      <RadioGroup name="plan" aria-label="요금제" defaultValue="pro" className="gap-1">
        <RadioGroupItem value="basic" label="레이블" />
        <RadioGroupItem value="pro" label="레이블" subLabel="서브레이블" />
        <RadioGroupItem value="off" label="비활성" disabled />
      </RadioGroup>
    </main>
  );
}
