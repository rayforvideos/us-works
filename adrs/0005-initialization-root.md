# ADR-0005: Compose App Dependencies in an Initialization Root

## Status

Accepted

## Context

앱에는 React 컴포넌트 트리 바깥에서 만들어지고 서로 연결되어야 하는 객체가 있다. TanStack Query의 QueryClient, Jotai 스토어, 그리고 HTTP 클라이언트다. 특히 인증 요구사항 때문에 연결이 필요하다. Access Token은 15분 뒤 만료되고, 401 응답을 받으면 Refresh Token으로 재발급한 뒤 원 요청을 재시도해야 한다. 이 로직은 `shared/api`의 HTTP 클라이언트 안에 있어야 하는데, 토큰 상태는 상위 레이어(`entities`)에 있다.

ADR-0002의 FSD 레이어 규칙에서 `shared`는 `entities`를 import할 수 없다. HTTP 클라이언트가 토큰을 읽고 갱신하려면 두 레이어를 모두 볼 수 있는 `app` 레이어가 연결해 줘야 한다. 이 연결 코드를 어디에 두고 어떤 형태로 쓸지 정하지 않으면 `main.tsx`와 프로바이더 컴포넌트에 흩어진다.

현재 코드는 `app-providers.tsx`가 모듈 최상위에서 `new QueryClient()`를 만드는 싱글턴 방식이다. 이 방식은 짧지만 테스트마다 같은 인스턴스를 공유해 캐시가 새고, 기본 옵션이 프로바이더 컴포넌트 안에 숨는다. 앞으로 개발용 목 서버처럼 렌더 전에 await해야 하는 비동기 초기화가 추가될 가능성도 있다.

## Decision

- 앱 의존성은 `src/app/initialize-system.ts`의 `initializeSystem()` 함수 한 곳에서 만들고 연결한다. 이 파일이 앱의 composition root다.
- `initializeSystem()`은 인스턴스를 생성하고 연결만 한다. 순서는 Jotai 스토어, HTTP 클라이언트에 토큰 접근자와 갱신 핸들러 주입, QueryClient 생성이며, 필요 시 개발용 목 서버 시작을 마지막에 await한다. 비즈니스 로직, DOM 접근, 라우팅은 넣지 않는다.
- `initializeSystem()`은 만든 인스턴스를 반환값으로 돌려주고 모듈 전역에 저장하지 않는다. `main.tsx`가 결과를 `AppProviders`의 props로 넘기고, 컴포넌트는 `useQueryClient()`, `useAtomValue()`처럼 Provider를 통해서만 접근한다.
- 다른 레이어는 `initialize-system.ts`를 import하지 않는다. `app` 레이어만 모든 레이어를 볼 수 있으므로 연결 코드는 여기에만 존재한다.
- QueryClient는 `shared/api/query-client/`의 `createQueryClient()` 팩토리로 만든다. 기본 옵션(retry, staleTime, refetchOnWindowFocus)은 팩토리에 두고, 호출자가 일부를 덮어쓸 수 있게 한다.
- HTTP 클라이언트는 토큰을 직접 import하지 않고 주입받는다. `shared/api`에는 토큰 접근자와 갱신 핸들러를 받는 설정 함수를 두고, 실제 토큰 상태는 상위 레이어에 둔다.
- 테스트는 같은 `initializeSystem()` 또는 개별 팩토리를 호출해 격리된 인스턴스를 얻는다. 테스트용 QueryClient는 `retry: false`로 만든다.
- 모듈 최상위에서 QueryClient, 스토어, HTTP 클라이언트 인스턴스를 만들어 export하는 싱글턴 방식은 쓰지 않는다.

## Consequences

**좋은 점**

- 의존성 생성 순서와 연결 관계가 파일 하나에서 읽힌다.
- 테스트마다 새 인스턴스를 얻어 QueryClient 캐시와 토큰 상태가 테스트 사이에 새지 않는다.
- FSD 레이어 규칙을 어기지 않고 `shared`의 HTTP 클라이언트가 상위 레이어의 토큰 상태를 쓸 수 있다.
- 비동기 초기화가 추가될 때 `main.tsx`가 아니라 `initializeSystem()`만 바뀐다.
- 평가자에게 의존성 방향을 통제하고 있다는 신호가 된다.

**나쁜 점과 감수하는 위험**

- 싱글턴 방식보다 코드가 길다. 인스턴스를 props로 넘기는 보일러플레이트가 생긴다.
- `initializeSystem()`에 초기화 외의 코드는 안된다. 인스턴스 생성과 연결만 한다는 제약을 코드 리뷰에서 지켜야 한다.
- HTTP 클라이언트가 주입식이라 설정 함수를 호출하기 전에 쓰면 토큰 없이 요청이 나간다. 미설정 상태에서 호출되면 명시적으로 오류를 던지게 한다.
- 현재 `app-providers.tsx`의 싱글턴 QueryClient를 이 구조로 옮기는 리팩터링이 필요하다.
