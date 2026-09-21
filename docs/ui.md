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

- 너비는 부모가 정한다. 입력 요소는 기본 `w-full`, 버튼은 내용 크기이며 `fullWidth`로만 `w-full`이 된다. 고정 `w-*`는 아이콘과 컨트롤 크기에 쓴다.
- 폭이 그 컴포넌트의 사양이면 컴포넌트가 폭과 브레이크포인트를 스스로 갖는다(ADR-0019). 지금 그런 모듈은 `container`(`max-w-320 px-9 xl:px-25`), `dialog`(`w-121`, 좁은 형태 `w-90`), `data-table`(`min-w-160`) 셋이고, 나머지 모듈에는 브레이크포인트 클래스(`md:`, `xl:`)를 쓰지 않는다.
- 반응형 판단은 위젯과 페이지가 하고, 화면 폭을 가진 블록은 `shared/ui/container`를 쓴다(ADR-0011).
- 위젯과 페이지에서는 작은 폭을 기본 클래스로 쓰고 Figma 데스크톱 값을 `xl:`에 둔다. 넘치는 행은 `flex-wrap`, 표는 컨테이너 안 가로 스크롤로 처리한다.

## 구조

- 네이티브 요소를 우선 쓴다. `button`, `input`은 그대로 두고 시각 요소는 `peer`(형제)나 `has-*`(부모)로 그린다. 프리미티브는 Base UI Select와 Dialog에만 쓴다(ADR-0015).
- 날짜·시간은 `DateTimeField` 하나로 고른다. 브라우저 기본 `datetime-local` 선택기를 열고 분 단위로 고르며, 달력 UI를 직접 만들거나 라이브러리를 더하지 않는다.
- 변형은 `data-variant`, `data-size` 같은 `data-*` 속성으로 드러낸다. 역할을 가진 요소(`input`, `button`)에 붙인다.
- 아이콘은 `shared/ui/icon`의 인라인 SVG를 쓰고 색은 `currentColor`를 따른다. 필요한 아이콘은 그 아이콘을 처음 쓰는 화면 작업에서 Figma 치수로 그려 늘린다.
- 모달 껍데기는 `shared/ui/dialog`와 그 위에 얹은 `shared/ui/confirm-dialog` 둘이다. 한 화면에서만 쓰는 모달의 내용과 동작은 그 페이지의 `ui` 세그먼트에 둔다(ADR-0017).
- 진행 중인 버튼은 `disabled`로 막지 않는다. Figma가 로딩 상태의 배경과 글자를 그대로 두므로 `disabled` 모양이 되면 안 된다. 대신 클릭 처리기에서 기본 동작까지 막고 `aria-busy`와 `aria-disabled`로 상태를 알린다. `pointer-events-none`만으로는 키보드 활성화와 폼 제출이 막히지 않는다.
- 비활성 입력에는 지우기 버튼을 그리지 않는다. 누를 수 없는 버튼이 남아 있으면 상태를 잘못 읽게 한다.
- 오류 문구는 `shared/ui/field-error`의 `FieldError` 하나로 그린다. 문구 한 줄 높이를 늘 유지해 오류가 나타날 때 아래 요소가 밀리지 않고, `id`로 입력의 `aria-describedby`와 이어진다. 오류 문구를 라벨 옆처럼 다른 곳에 두는 폼은 `reserve={false}`로 빈 자리를 끄고, 문구를 스스로 갖지 않는 입력(`DateTimeField`)은 `invalid`로 테두리만 바꾼 뒤 화면이 `FieldError`를 따로 둔다. `TextField`의 `reserveError={false}`도 같은 뜻이다.
- 값을 돌려주는 컨트롤은 콜백 이름을 `onValueChange`로 맞춘다(`Select`, `RadioGroup`, `DateTimeField`). `onChange`는 네이티브 이벤트를 그대로 넘기는 입력(`TextField`, `TextArea`)에만 쓴다.
- 선 아이콘은 `shared/ui/icon/stroke-icon`의 `StrokeIcon`을 감싸고 `viewBox`, `strokeWidth`, 경로만 갖는다. 채움이 있는 아이콘(`RoundArrowIcon`, `RoundCancelIcon`, `LogoIcon`)은 자기 `svg`를 그대로 둔다.
- Base UI 팝업(Select, Dialog)의 열림·닫힘 전환은 `transition-[opacity,scale]`처럼 속성을 한정한다. Tailwind `transition` 단축은 `display`, `pointer-events` 같은 이산 속성을 포함해 Base UI가 닫힘 전환의 완료를 기다리다 팝업을 언마운트하지 못한다.
- 사용자가 일으키는 화면 이동에는 react-router의 `viewTransition`을 붙인다. 목록 헤더의 탭과 로고, 목록 행, 안내의 목록 링크, 작성과 발행 뒤 이동이 대상이다. 인증 가드의 리다이렉트처럼 사용자가 누르지 않은 이동에는 붙이지 않는다. React의 `<ViewTransition>` 컴포넌트는 쓰지 않는다. 이동 시점을 라우터가 쥐고 있어 둘을 함께 쓰면 전환이 겹친다.
- 동작 줄이기를 켠 사용자에게는 전환 애니메이션을 끈다. 규칙은 `app/styles/base.css`에 있다.
- 화면 위에 고정하는 블록(목록 헤더, GNB)은 `sticky top-0`과 `z-10`, 배경색을 함께 준다. Base UI 팝업(Select, Dialog)은 body로 포털되며 자체 z-index를 최상단에 두므로 페이지의 `z-*`와 겹치지 않는다.
- Base UI의 `onOpenChange`는 `(open, eventDetails)` 두 인자를 넘기므로 `shared/ui/dialog`는 소비자 콜백에 `open` 하나만 전달하는 래퍼를 둔다.

## 테스트

- 변형 하나에 테스트 한 문장. 역할, 이름, 상태(`toBeChecked`, `toBeDisabled`)와 `data-*` 속성으로 확인하고 클래스 문자열은 검사하지 않는다.
- Figma에 없는 조합은 타입 유니언으로 막고 `expectTypeOf`로 검증한다.
