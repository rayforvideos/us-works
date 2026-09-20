import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { CheckboxChip } from "@/shared/ui/checkbox-chip";
import { Container } from "@/shared/ui/container";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Select } from "@/shared/ui/select";
import { StatusBadge } from "@/shared/ui/status-badge";
import { TextArea } from "@/shared/ui/text-area";
import { TextField } from "@/shared/ui/text-field";
import { Gnb } from "@/widgets/gnb";

/**
 * @constants
 */
const CATEGORY_ITEMS = [
  { value: "notice", label: "공지사항" },
  { value: "guide", label: "거래안내" },
  { value: "support", label: "고객센터" },
  { value: "off", label: "비활성", disabled: true },
];

function goBack() {
  return undefined;
}

export function App() {
  return (
    <main className="flex min-h-screen flex-col pb-10">
      <Gnb
        title="커뮤니티 쓰기"
        message="해당 글이 임시 저장되었습니다 16:41"
        onBack={goBack}
        actions={
          <>
            <Button importance="secondary" size="medium">
              임시저장
            </Button>
            <Button size="medium">발행하기</Button>
          </>
        }
      />
      <Gnb
        title="커뮤니티 쓰기"
        onBack={goBack}
        actions={
          <>
            <Button importance="secondary" size="medium" loading>
              임시저장
            </Button>
            <Button size="medium">발행하기</Button>
          </>
        }
      />
      <Container className="flex flex-col items-center gap-6 py-10">
        <h1 className="text-18-b700">US Alliance</h1>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button>발행하기</Button>
          <Button importance="secondary" size="medium">
            임시저장
          </Button>
          <Button importance="assistive" size="medium">
            취소
          </Button>
          <Button disabled>비활성</Button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline">아웃라인</Button>
          <Button variant="outline" importance="secondary" size="small">
            작은 버튼
          </Button>
          <Button variant="outline" importance="assistive" size="small">
            보조
          </Button>
          <Button variant="text">더보기</Button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Checkbox aria-label="medium" />
          <Checkbox aria-label="medium checked" defaultChecked />
          <Checkbox aria-label="large" size="large" />
          <Checkbox aria-label="large checked" size="large" defaultChecked />
          <Checkbox aria-label="disabled" disabled />
          <Checkbox aria-label="disabled checked" disabled defaultChecked />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <CheckboxChip defaultChecked>고객센터</CheckboxChip>
          <CheckboxChip shape="solid">거래안내</CheckboxChip>
          <CheckboxChip>공지사항</CheckboxChip>
          <CheckboxChip disabled>비활성</CheckboxChip>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <StatusBadge tone="green">발송</StatusBadge>
          <StatusBadge tone="grey">미발송</StatusBadge>
          <StatusBadge tone="yellow">예약</StatusBadge>
          <StatusBadge tone="red">실패</StatusBadge>
          <StatusBadge tone="green" showDot={false}>
            공개
          </StatusBadge>
        </div>
        <div className="flex w-full max-w-160 flex-col gap-3">
          <TextField aria-label="제목" placeholder="제목을 입력해주세요. (최대 50자)" clearable />
          <TextField
            aria-label="제목 입력됨"
            defaultValue="제목을 입력해주세요. (최대 50자)"
            clearable
          />
          <TextField
            aria-label="제목 카운터"
            placeholder="제목을 입력해주세요. (최대 50자)"
            showCounter
            maxLength={50}
          />
          <TextField
            aria-label="제목 오류"
            placeholder="제목을 입력해주세요. (최대 50자)"
            clearable
            error="필수 정보입니다."
          />
          <TextField
            aria-label="제목 비활성"
            placeholder="제목을 입력해주세요. (최대 50자)"
            disabled
          />
          <TextArea
            aria-label="내용"
            placeholder="내용을 입력해주세요. (최대 500자)"
            showCounter
            maxLength={500}
          />
          <Select
            aria-label="카테고리"
            placeholder="카테고리를 선택해주세요."
            items={CATEGORY_ITEMS}
          />
          <Select aria-label="카테고리 선택됨" items={CATEGORY_ITEMS} defaultValue="guide" />
          <Select
            aria-label="카테고리 비활성"
            placeholder="카테고리를 선택해주세요."
            items={CATEGORY_ITEMS}
            disabled
          />
          <Button fullWidth>전체 너비</Button>
        </div>
        <RadioGroup name="plan" aria-label="요금제" defaultValue="pro" className="gap-1">
          <RadioGroupItem value="basic" label="레이블" />
          <RadioGroupItem value="pro" label="레이블" subLabel="서브레이블" />
          <RadioGroupItem value="off" label="비활성" disabled />
        </RadioGroup>
      </Container>
    </main>
  );
}
