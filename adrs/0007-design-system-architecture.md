# ADR-0007: Build the Design System in shared/ui with Native Elements, Tailwind Theme Tokens and Base UI Select

## Status

Accepted

## Context

Figma 컴포넌트는 Button(Solid, Outline, Text), Label(상태 배지), Control(Radio, Checkbox), Input box(한 줄, 여러 줄, Dropdown), GNB 다섯 묶음이다. 변형은 `Importance`, `Size`, `State`, `checked` 같은 속성 축으로 정리되어 있고, 색 변수는 `App/BlueGreen/70`, `Grey/300`처럼 팔레트 이름만 있으며 의미 변수는 없다. 파일은 뷰어 권한이라 아이콘을 내보낼 수 없다.

shadcn/ui 도입 여부를 정해야 한다. shadcn/ui CLI는 Base UI를 기본 프리미티브로 쓰지만, 산출물(평평한 `components/ui/*.tsx`, `components.json`, tsconfig `baseUrl`)과 기본 변형(default, ghost, destructive)이 FSD 파일 규칙과 Figma 변형 축에 맞지 않는다.

## Decision

- shadcn/ui CLI는 쓰지 않고, 같은 구성(소스 소유, Tailwind 테마 변수, 변형 헬퍼)을 `shared/ui`에 직접 구현한다. 컴포넌트가 여덟 종류 안팎이라 생성기의 이점이 없다.
- Button, Checkbox, Radio, 입력은 네이티브 `button`, `input`, `textarea` 요소로 만든다. 키보드와 ARIA를 브라우저가 이미 제공하고, 시안은 `appearance-none`과 CSS로 재현된다.
- Dropdown만 `@base-ui/react`의 Select로 만든다. 네이티브 `select`는 목록 스타일링이 불가능하다. Base UI가 요구하는 `isolation: isolate`를 앱 루트에 둔다. ADR-0015가 이 항목을 대체한다.
- shadcn/ui 레지스트리의 Base UI 버전 소스는 Select처럼 프리미티브 조합이 복잡한 컴포넌트의 참고 자료로만 쓴다. 저장소에 `components.json`이나 CLI 산출물을 두지 않고, 참고한 코드는 `shared/ui` 모듈 규칙에 맞게 옮겨 쓴다.
- 변형 선언은 `class-variance-authority`의 `cva()`를 쓴다. 슬롯이 필요한 컴포넌트는 text-field와 text-area 둘뿐이라 요소별 `cva()` 정의로 충분하고, 병합을 하지 않아 `cn`과 역할이 겹치지 않는다.
- 클래스 병합은 `shared/lib/cn`(`clsx` + `tailwind-merge`) 한 곳에서만 한다. 컴포넌트는 `cn(variants(props), className)` 형태로 소비자 클래스를 마지막에 합친다.
- `@theme`에서 Tailwind 기본 색, 라운드, 글자 크기 척도를 `--color-*: initial`, `--radius-*: initial`, `--text-*: initial`로 비우고 Figma 값만 정의한다. 기본 척도가 남으면 두 체계가 섞이고 린트로 막을 수 없다.
- Figma 색 변수를 이름 그대로 팔레트 토큰으로 옮긴다(`App/BlueGreen/70` → `--color-blue-green-70`). 의미 토큰 계층은 만들지 않고, 팔레트와 역할의 대응은 각 컴포넌트의 `cva()` 정의에 적는다.
- 텍스트는 `--text-12`~`--text-18`과 행간 토큰에 Tailwind `font-*`를 조합한다(`Pr_16_SB600` → `text-16 font-semibold`). 라운드는 Figma 값(4, 6, 8, 10, 12, 14px)만 `--radius-*`로 두고, 간격은 Tailwind 기본 척도를 쓴다. ADR-0010이 이 항목을 대체한다.
- Figma 세트를 다음 모듈로 옮긴다.
  - `button`: Solid, Outline, Text를 `variant`, `importance`, `size` 속성으로 통합
  - `status-badge`: Label
  - `checkbox`, `radio-group`: Control. `Checkbox / Label` 칩 형태는 Storyboard에서 쓰임을 확인한 뒤 이름을 정한다.
  - `text-field`, `text-area`, `select`: Input box
  - `icon`: Figma 아이콘 네 개(`check`, `round-cancel`, `arrow-up`, `arrow-left`)를 Figma 치수로 그린 인라인 SVG. 색은 `currentColor`
- 링크로 동작하는 버튼은 `button` 모듈이 내보내는 `buttonVariants()`를 React Router `Link`의 `className`에 적용한다. 다형 컴포넌트나 Slot은 만들지 않는다.
- GNB는 문구가 도메인에 묶여 있어 `widgets`에서 `button`과 `icon`을 조합해 만든다.
- hover, focus, pressed, disabled는 속성이 아니라 CSS 상태(`hover:`, `focus-visible:`, `active:`, `disabled:`, `aria-invalid`)로 표현한다.

## Consequences

**좋은 점**

- 소스가 전부 `shared/ui`에 있어 코드만 읽어도 동작을 알 수 있다.
- 기본 척도를 비워 토큰과 Figma가 1:1로 대응하고, Figma에 없는 값은 빌드에서 클래스가 생성되지 않아 드러난다.
- 서드파티 UI 의존성이 Base UI Select 하나라 API 변경 영향이 작다.

**나쁜 점과 감수하는 위험**

- Storyboard에 Dialog, Toast 같은 오버레이가 여럿 나오면 CLI 미도입 결정을 다시 본다.
