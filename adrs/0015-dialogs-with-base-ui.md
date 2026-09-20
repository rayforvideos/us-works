# ADR-0015: Build Modals on Base UI Dialog

## Status

Accepted

## Context

새글쓰기 모달, 발행 옵션 모달, 확인 다이얼로그 여섯 종(Figma `Dialog_Custom01~06`)이 필요하다. ADR-0007은 프리미티브를 Base UI Select에만 쓰기로 했고, 모달은 아직 결정이 없다. 모달은 포커스 가두기, Esc와 바깥 클릭으로 닫기, 배경 스크롤 잠금, 열림·닫힘 전환이 필요하다.

비교한 선택지는 다음과 같다.

- 네이티브 `<dialog>` + `showModal()`: 의존성이 없고 top layer와 포커스 가두기를 브라우저가 준다. 다만 열고 닫기가 명령형(ref)이라 React 상태와 어긋나기 쉽고, 바깥 클릭 닫기와 닫힘 애니메이션을 직접 만들어야 하며, 스크롤 잠금도 수동이다.
- Base UI Dialog(이미 설치된 `@base-ui/react`): `open`/`onOpenChange`로 선언적이고 `Backdrop`, `Popup`, `Title`, `Description`, `Close`와 `data-starting-style`/`data-ending-style`을 주어 Select와 같은 방식으로 전환을 쓴다. 접근성 속성과 포커스 관리, 스크롤 잠금을 포함한다. 프리미티브 사용 범위가 Select에서 Dialog까지 넓어진다.
- 직접 구현(div + 포커스 관리): 통제력은 크지만 접근성과 포커스 관리를 다시 만들어야 하고 검증 비용이 크다.

## Decision

- 모달은 Base UI Dialog로 만든다. ADR-0007의 "프리미티브는 Select에만"을 "Select와 Dialog에"로 넓힌다.
- `shared/ui/dialog`가 Base UI를 감싼 공용 껍데기(배경, 484 너비 팝업, 라운드 20, 제목 행과 닫기 버튼, 본문 슬롯, 열림·닫힘 전환)를 제공한다. 각 모달의 내용과 동작은 그 모달을 소유한 `features` 슬라이스가 만든다. ADR-0017이 이 항목을 대체한다.
- 모달의 열림 상태는 여는 쪽 컴포넌트의 `useState`에 두고, 전역 아톰이나 URL에 두지 않는다. 새글쓰기 모달처럼 페이지 이동으로 끝나는 모달은 이동 시 닫힌다.
- Esc, 닫기 버튼, 배경 클릭으로 닫힌다. 진행 중인 요청이 있는 확인 다이얼로그는 배경 클릭을 막을 수 있게 옵션을 둔다.

## Consequences

**좋은 점**

- 포커스 가두기, 스크롤 잠금, 접근성 속성을 검증된 프리미티브가 맡고, Select와 같은 전환 규칙을 쓴다.

**나쁜 점과 감수하는 위험**

- Base UI에 대한 의존이 Dialog까지 늘어난다. 1.x 안에서 API가 바뀌면 껍데기 한 곳만 고친다.
- 네이티브 `<dialog>`의 top layer를 쓰지 않으므로 z-index 관리를 껍데기가 맡는다.
