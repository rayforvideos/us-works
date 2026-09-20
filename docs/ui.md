# 공용 컴포넌트 구현 규칙

`shared/ui` 컴포넌트를 만들거나 고칠 때 읽는다. 아키텍처 결정은 ADR-0007, ADR-0009, ADR-0010, ADR-0011에 있고, 여기에는 그 결정을 코드로 옮기는 방식을 적는다.

## 모듈 구성

- `<이름>.tsx`: props 해석과 JSX만 둔다. 클래스 문자열을 직접 쓰지 않는다.
- `<이름>-variants.ts`: 그 컴포넌트의 클래스 문자열이 있는 유일한 파일이다. 슬롯(컨테이너, 입력, 박스, 아이콘)마다 `cva()` 하나를 두고, 변형이 없는 슬롯도 `cva("...")`로 감싼다. 변형 해석 함수(`resolveButtonVariant` 같은 것)도 여기 둔다.
- `types.ts`, `<이름>.test.tsx`, `index.ts`는 `docs/file-structure.md`를 따른다. `index.ts`는 컴포넌트와 소비자가 쓰는 함수·타입만 내보낸다.

## 클래스

- Tailwind 클래스 문자열은 `cva()`, `cn()`, `className` 안에만 쓴다. Prettier가 정렬하고 린트가 검사하는 자리가 그 셋이다.
- 색, 글자, 라운드, 그림자는 `@theme` 토큰 클래스만 쓴다. Figma에 값이 있는데 토큰이 없으면 토큰을 추가하고, 토큰으로 표현할 수 없는 값(`border-[1.5px]`)만 임의 값으로 쓴다.
- 소비자가 넘긴 `className`은 `cn(variants(props), className)`으로 마지막에 합친다.
- 상호작용 상태는 속성이 아니라 CSS 상태(`hover:`, `focus-visible:`, `active:`, `disabled:`, `peer-*`, `has-*`)로 표현한다.

## Figma에 없는 값

- hover는 같은 팔레트 한 단계 어두운 값, pressed는 두 단계. 인접 단계가 없으면 배경은 두고 글자만 어둡게 한다.
- disabled는 채움과 테두리 `grey-200`, 글자와 아이콘 `grey-300`.
- 키보드 포커스는 `focus-visible`에 2px `blue-green-70` 외곽선.

## 너비와 반응형

- 너비는 부모가 정한다. 입력 요소는 기본 `w-full`, 버튼은 내용 크기이며 `fullWidth`로만 `w-full`이 된다. 고정 `w-*`는 아이콘과 컨트롤 크기에만 쓴다.
- `shared/ui`에는 브레이크포인트 클래스(`md:`, `xl:`)를 쓰지 않는다. 반응형 판단은 위젯과 페이지가 하고, 화면 폭을 가진 블록은 `shared/ui/container`를 쓴다(ADR-0011).
- 위젯과 페이지에서는 작은 폭을 기본 클래스로 쓰고 Figma 데스크톱 값을 `xl:`에 둔다. 넘치는 행은 `flex-wrap`, 표는 컨테이너 안 가로 스크롤로 처리한다.

## 구조

- 네이티브 요소를 우선 쓴다. `button`, `input`은 그대로 두고 시각 요소는 `peer`(형제)나 `has-*`(부모)로 그린다. 프리미티브는 Base UI Select와 Dialog에만 쓴다(ADR-0015).
- 날짜·시간 입력은 필드 하나로 받는다. 포맷된 값을 보이는 박스 위에 투명한 `input type="datetime-local"`(`step` 1800)을 겹치고, 누르면 `showPicker()`로 브라우저 기본 선택기를 연다. 달력 UI를 직접 만들거나 라이브러리를 더하지 않는다.
- 변형은 `data-variant`, `data-size` 같은 `data-*` 속성으로 드러낸다. 역할을 가진 요소(`input`, `button`)에 붙인다.
- 아이콘은 `shared/ui/icon`의 인라인 SVG를 쓰고 색은 `currentColor`를 따른다.
- 오류 문구 자리는 항상 예약한다. 입력 컴포넌트는 오류가 없어도 문구 한 줄 높이를 유지해 오류가 나타날 때 아래 요소가 밀리지 않는다. 오류 문구를 라벨 옆처럼 다른 곳에 두는 폼은 `TextField`의 `reserveError={false}`로 아래 슬롯을 끄고, 문구를 스스로 갖지 않는 입력(`DateTimeField`)은 `invalid`로 테두리만 바꾼다.
- Base UI 팝업(Select, Dialog)의 열림·닫힘 전환은 `transition-[opacity,scale]`처럼 속성을 한정한다. Tailwind `transition` 단축은 `display`, `pointer-events` 같은 이산 속성을 포함해 Base UI가 닫힘 전환의 완료를 기다리다 팝업을 언마운트하지 못한다.
- Base UI의 `onOpenChange`는 `(open, eventDetails)` 두 인자를 넘기므로 `shared/ui/dialog`는 소비자 콜백에 `open` 하나만 전달하는 래퍼를 둔다.

## 테스트

- 변형 하나에 테스트 한 문장. 역할, 이름, 상태(`toBeChecked`, `toBeDisabled`)와 `data-*` 속성으로 확인하고 클래스 문자열은 검사하지 않는다.
- Figma에 없는 조합은 타입 유니언으로 막고 `expectTypeOf`로 검증한다.
