# ADR-0012: Route Structure, Session Storage and Auth Guard

## Status

Accepted

## Context

첫 화면(로그인, 회원가입)을 만들면서 라우트 구조, 세션 보관 위치, 보호 경로 처리를 정해야 한다. 인증 API는 로그인과 회원가입 모두 access token(15분), refresh token(7일), 만료 시각, 사용자 정보를 응답 본문으로 준다. 쿠키는 설정하지 않고 `Authorization: Bearer` 헤더를 요구하므로 토큰 보관은 클라이언트 몫이다. `shared/api`의 HTTP 클라이언트는 이미 `getAccessToken`, `refreshAccessToken`, `onUnauthorized` 세 훅으로 만료 확인과 401 재시도를 처리한다(ADR-0006).

## Decision

- 공개 경로는 `/login`, `/register` 둘이다. 나머지는 모두 로그인 필수 레이아웃 아래에 두며 경로는 다음과 같다.
  - `/`: 콘텐츠 목록
  - `/alarms`: 알람 목록
  - `/contents/new`, `/contents/:id`: 콘텐츠 작성과 수정
  - `/alarms/new`, `/alarms/:id`: 알람 작성과 수정
- 세션은 `entities/session/model`의 Jotai 아톰에 둔다. access token과 그 만료 시각은 메모리에만 있고, refresh token과 그 만료 시각, 사용자는 localStorage에 저장한다. 새로고침 뒤에는 저장된 refresh token으로 access token을 다시 받는다.
- `initializeSystem()`이 HTTP 클라이언트의 `auth` 훅을 이 아톰에 연결한다. `getAccessToken`은 아톰을 읽고, `refreshAccessToken`은 `POST /api/v1/auth/refresh`로 갱신해 아톰을 쓰고, `onUnauthorized`는 아톰을 비운다.
- 보호는 라우터에서 한다. `app/router.tsx`의 레이아웃 라우트가 세션이 없으면 `/login`으로 보내며 원래 경로를 `state`로 넘기고, 로그인 후 그 경로로 돌아간다. 세션이 있는 상태로 `/login`, `/register`에 오면 `/`로 보낸다.
- 로그인과 회원가입은 성공 응답의 토큰으로 바로 세션을 만든다. 회원가입 뒤 별도 로그인은 없다.
- 인증 화면의 오류 문구는 `ApiError.kind`별 한국어 고정 문구를 쓴다. 서버 문구는 영어라 화면에 쓰지 않으며, 형식 오류는 클라이언트 검증으로 먼저 막는다. `docs/api.md`의 오류 규격을 이에 맞게 고친다.
- 토큰을 스크립트가 읽을 수 있는 저장소에 두므로 XSS 취약점을 만들지 않는 것을 전제로 한다. HTML을 문자열로 주입하지 않고(`dangerouslySetInnerHTML` 금지, ESLint `react/no-danger`), 사용자 입력과 서버 문구는 React 텍스트 노드로만 렌더링하며, 외부에서 받은 링크는 `http(s)` 스킴만 허용하고 `rel="noopener noreferrer"`로 연다.
- 이 결정은 ADR-0006의 "`validation`과 `conflict`만 서버 문구를 그대로 쓴다"를 대체한다. 모든 `kind`는 `getErrorMessage`의 한국어 고정 문구를 쓰고 기능이 필요하면 `kind`별로 덮어쓴다.
- 임시 화면 `app.tsx`는 첫 페이지와 함께 삭제한다. 로그인 뒤 착지 페이지 `/`는 콘텐츠 목록 이슈 전까지 제목만 있는 빈 페이지다.

## Consequences

**좋은 점**

- 보호 판단이 라우터 한 곳에 있고, 세션 갱신은 클라이언트 훅이 맡아 화면은 토큰을 다루지 않는다.

**나쁜 점과 감수하는 위험**

- 브라우저의 어떤 저장 위치도 XSS 취약점 자체를 막지 못한다(IETF OAuth for Browser-Based Apps). 그래서 위 예방 규칙이 전제이고, 저장은 노출 표면을 줄이는 방향으로 나눈다. access token(15분)은 메모리에만 두어 저장소에 남지 않고, refresh token은 새로고침 유지에 필요해 저장한다. sessionStorage는 탭을 닫으면 세션이 끊기고 탭 간 공유가 안 되며, 메모리만 쓰면 새로고침마다 로그인이 풀려 7일 refresh token이 의미를 잃으므로 localStorage를 고른다.
