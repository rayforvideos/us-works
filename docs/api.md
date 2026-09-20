# API 연동 규약

HTTP 클라이언트의 동작과 API 호출 코드의 배치를 정한다. API를 호출하는 코드를 쓰거나 고칠 때 읽는다. 라이브러리, 갱신 전략, 오류 규격의 근거는 ADR-0006에 있다.

## 위치와 역할

- HTTP 클라이언트는 `shared/api/http-client/`에 있고 `createHttpClient()` 팩토리가 axios 인스턴스를 만들어 반환한다. 도메인 지식이 없고 엔드포인트를 모른다.
- 엔드포인트별 요청 함수와 응답 타입은 해당 엔티티의 `entities/<엔티티>/api/`에 둔다. 요청 함수는 클라이언트 인스턴스를 인자로 받는다.
- TanStack Query 훅은 요청 함수를 감싸며 같은 `api` 세그먼트에 둔다. 쿼리 키는 `[엔티티, 동작, 파라미터]` 배열이다. 예: `["contents", "list", { page: 1, status: "public" }]`.
- 클라이언트 인스턴스는 `initializeSystem()`이 만들어 주입한다(ADR-0005). 모듈 최상위에서 만들지 않는다.

## 모듈 구성

`shared/api` 아래 모듈과 역할이다. 각 모듈은 자기 계약만 테스트한다.

| 모듈               | 역할                                                                       | 테스트가 덮는 계약                                 |
| ------------------ | -------------------------------------------------------------------------- | -------------------------------------------------- |
| `api-error`        | `ApiError` 클래스, 상태 코드 → `kind` 분류, axios 오류를 `ApiError`로 변환 | 분류표, 네트워크와 취소, 공통 응답 형식 아닌 본문  |
| `token-refresher`  | 갱신 단일 실행, 진행 중 Promise 조회, 실패 시 `onUnauthorized` 1회 알림    | 동시 호출 1회 실행, 실패와 예외 처리, 알림 초기화  |
| `auth-interceptor` | 인증 요청에 헤더 부착, 만료 확인, 갱신 대기, 401 재시도                    | 인증 흐름 전체와 동시 요청 시나리오                |
| `http-client`      | axios 인스턴스 생성과 인터셉터 조립. 응답 데이터 추출과 오류 정규화        | 기본 동작, 공통 응답 형식 처리, 인터셉터 등록 순서 |
| `query-client`     | `QueryClient` 팩토리와 `kind` 기반 재시도 정책                             | 기본 옵션, 덮어쓰기, 재시도 대상 분류              |

`http-client`는 인터셉터를 두 함수로 나눠 등록한다. axios 응답 인터셉터는 등록 순서대로 실행되므로 순서를 바꾸면 401 처리가 깨진다.

1. `attachAuthInterceptors`: `shared/api/auth-interceptor/`에 있고 `auth` 옵션이 있을 때만 등록한다. 요청 인터셉터는 `runWhen`으로 `skipAuth` 요청을 건너뛰고, 만료 확인과 헤더 부착을 한다. 응답 오류 인터셉터는 원본 axios 오류의 401을 보고 갱신과 재시도를 한다. 요청 설정을 넓히는 `axios.d.ts`도 이 모듈에 있다.
2. `attachResponseInterceptors`: `shared/api/http-client/`에 있고 항상 등록한다. 공통 응답 형식에서 `data`를 추출하고, 남은 오류를 `ApiError`로 정규화한다. 인증 인터셉터보다 뒤에 있어야 401 판단 시점에 원본 오류가 남아 있다.

`auth`가 없는 클라이언트는 2번만 가진다.

## 기본 동작

- 기본 URL은 환경 변수 `VITE_API_BASE_URL`에서 읽어 팩토리에 넘긴다. `.env.example`에 값을 적어두고 `.env`는 커밋하지 않는다.
- 경로는 `/api/v1/...`처럼 기본 URL 뒤에 붙는 절대 경로로 쓴다.
- 쿼리 파라미터는 axios `params`로 넘긴다. 값이 `undefined`인 키는 axios가 생략한다.
- 요청 본문은 axios 기본 동작대로 JSON으로 직렬화한다.
- 취소는 axios `signal` 옵션으로 `AbortSignal`을 넘긴다. TanStack Query가 넘기는 신호가 그대로 동작한다.
- 테스트는 팩토리의 `adapter` 옵션에 가짜 어댑터를, `now` 옵션에 고정 시각 함수를 넘겨 네트워크와 실제 시계 없이 검증한다.

## 공통 응답 형식

서버의 모든 응답은 `{ success, data, error }` 형태다. 응답 인터셉터가 처리한다.

- 2xx이고 `success`가 true면 응답의 `data`를 공통 응답 형식 안의 `data`로 바꾼다. 호출자는 `response.data`로 실제 데이터를 받고 공통 응답 형식을 직접 다루지 않는다.
- 그 외에는 아래 오류 규격의 `ApiError`를 던진다.

## 오류 규격

클라이언트를 통과한 모든 실패는 `ApiError` 하나다. `ApiError`와 분류 함수는 `shared/api/api-error/`에 있고, 화면은 axios 오류나 공통 응답 형식을 직접 다루지 않는다.

| 필드            | 타입             | 내용                                                                   |
| --------------- | ---------------- | ---------------------------------------------------------------------- |
| `kind`          | 아래 표의 값     | 분류. 화면은 이 값으로만 분기한다                                      |
| `status`        | `number \| null` | HTTP 상태 코드. 응답이 없으면 `null`                                   |
| `serverMessage` | `string \| null` | 응답의 `error` 필드. 없거나 공통 응답 형식이 아니면 `null`             |
| `message`       | `string`         | `Error.message`. 개발자용 요약(`kind`와 상태 코드). 화면에 쓰지 않는다 |
| `cause`         | `unknown`        | 원본 axios 오류                                                        |

`kind`는 HTTP 상태 코드로 정한다.

| kind           | 조건                          | 화면의 기본 처리                                                        |
| -------------- | ----------------------------- | ----------------------------------------------------------------------- |
| `network`      | 응답 없음(오프라인, 타임아웃) | "네트워크 연결을 확인해주세요."                                         |
| `canceled`     | `AbortSignal`로 취소          | 무시한다. 문구가 필요하면 공통 문구                                     |
| `unauthorized` | 401, 갱신까지 실패            | 클라이언트가 `onUnauthorized`를 호출한다. 문구는 "로그인이 필요합니다." |
| `forbidden`    | 403                           | "권한이 없습니다."                                                      |
| `not_found`    | 404                           | "요청한 내용을 찾을 수 없습니다."                                       |
| `conflict`     | 409                           | "이미 처리된 요청입니다."                                               |
| `validation`   | 400                           | "입력값을 확인해주세요."                                                |
| `server`       | 5xx                           | "잠시 후 다시 시도해주세요."                                            |
| `unknown`      | 그 외                         | 공통 문구                                                               |

- 사용자에게 보이는 문구는 `shared/lib/error-message/`의 `getErrorMessage(error)` 한 곳에서 만든다. 모든 `kind`가 위 표의 고정 한국어 문구를 쓰며, `canceled`와 `unknown`, `ApiError`가 아닌 오류는 공통 문구 "오류가 발생했습니다. 잠시 후 다시 시도해주세요."를 쓴다. 기능은 필요한 `kind`만 자기 고정 문구로 덮어쓴다(예: 인증 화면의 `unauthorized`, `conflict`). 서버 문구는 영어라 화면에 쓰지 않으며, 화면은 `serverMessage`나 `message`를 직접 출력하지 않는다.
- TanStack Query 재시도는 `kind`가 `network` 또는 `server`일 때만 한다. 나머지는 재시도하지 않는다. 이 정책은 `createQueryClient()`의 기본 `retry` 함수에 있다.

## 인증

팩토리는 `auth` 옵션으로 세 함수를 받는다.

- `getAccessToken(): { token: string; expiresAt: string } | null`. 요청마다 호출한다. 값이 있으면 `Authorization: Bearer <token>` 헤더를 붙이고 `expiresAt`(ISO 8601)으로 만료를 확인한다.
- `refreshAccessToken(): Promise<boolean>`. 갱신에 성공하면 true를 돌려주고, 그 뒤 `getAccessToken()`이 새 토큰과 만료 시각을 반환해야 한다.
- `onUnauthorized(): void`. 갱신이 실패했을 때 호출된다. 세션 정리와 로그인 화면 이동은 이 함수를 넘긴 쪽(app)이 담당한다.

`auth` 옵션 없이 만든 클라이언트는 헤더를 붙이지 않고 만료 확인도 하지 않으며, 401을 `unauthorized` `ApiError`로 던진다.

### 만료 확인

1. 인증 요청을 보내기 직전에 `expiresAt`과 현재 시각을 비교한다. 이미 지났거나 60초 안에 만료되면 갱신을 먼저 실행한다.
2. 갱신이 성공하면 새 토큰으로 요청을 보낸다.
3. 만료 확인은 요청당 한 번만 한다. 갱신 뒤에도 만료로 판정되면 그대로 보내고 결과는 401 처리에 맡긴다.
4. 타이머로 미리 갱신하지 않는다. 비교는 요청 시점에만 일어난다.

### 401 처리

1. 인증 요청이 401을 받으면 만료 확인 결과와 무관하게 `refreshAccessToken()`을 호출한다.
2. true가 돌아오면 원 요청을 새 토큰으로 한 번만 재시도한다.
3. 재시도 응답이 다시 401이거나, 갱신이 false를 반환하거나 예외를 던지면 `onUnauthorized()`를 호출하고 `unauthorized` `ApiError`를 던진다.

### 동시 요청 처리

토큰 만료 순간 여러 요청이 함께 갱신을 필요로 하는 상황을 반드시 다음처럼 처리한다. 만료 확인에서 시작된 갱신과 401에서 시작된 갱신은 같은 규칙을 따른다. 이 규칙은 테스트로 증명한다.

- 갱신은 항상 단일 실행이다. 갱신이 진행 중일 때 다른 요청이 갱신을 필요로 하면 새 갱신을 시작하지 않고 진행 중인 갱신 Promise를 함께 기다린다.
- 갱신이 끝나면 대기하던 모든 요청이 각자 새 토큰으로 한 번씩 보낸다.
- 갱신이 진행 중일 때 새로 시작되는 인증 요청은 서버로 보내기 전에 갱신 완료를 기다린 뒤 새 토큰으로 보낸다.
- 갱신이 실패하면 대기 중이던 모든 요청은 `unauthorized` `ApiError`로 실패하고 `onUnauthorized()`는 정확히 한 번만 호출된다.
- 진행 중 갱신 Promise는 클라이언트 인스턴스 안에 둔다. 모듈 전역 변수로 두지 않는다.
- 테스트 케이스: 동시 N개 요청이 401을 받을 때 `refreshAccessToken` 호출 1회, 각 요청 재시도 1회, 모두 성공. 갱신 실패 시 모든 요청이 `unauthorized`, `onUnauthorized` 호출 1회. 갱신 중 시작된 새 요청은 갱신 완료 후 새 토큰으로 1회만 전송. 만료 60초 전 요청은 서버 호출 전에 갱신 1회 후 새 토큰으로 전송.

### 인증 제외 요청

- 로그인, 회원가입, 토큰 갱신 요청은 요청 설정에 `skipAuth: true`를 단다.
- `skipAuth`와 내부 플래그(`authRetried`, `authExpiryChecked`)는 `shared/api/auth-interceptor/axios.d.ts`에서 axios의 `AxiosRequestConfig`를 모듈 확장으로 넓혀 추가한다. 모듈 확장은 원본과 같은 선언 형태(`interface`, 제네릭 `D = any`)를 써야 하므로 ESLint는 `**/*.d.ts`에 한해 `consistent-type-definitions`, `no-explicit-any`, `no-unused-vars`를 끈다. 내부 플래그를 설정 객체에 실어 보내는 이유는 axios가 재시도 시 설정을 새 객체로 복사하면서 알려지지 않은 키를 유지하기 때문이다.
- `skipAuth` 요청은 헤더를 붙이지 않고, 만료 확인과 갱신 대기에 들어가지 않으며, 401을 받아도 갱신을 시도하지 않고 `unauthorized` `ApiError`로 던진다.

## 서버 제약

Swagger 기준으로 클라이언트에서 먼저 막아야 하는 값이다. 검증 로직은 각 기능의 `model`에 두고, 이 표는 기준값이다.

| 대상                    | 제약                                                      |
| ----------------------- | --------------------------------------------------------- |
| 비밀번호                | 6자 이상                                                  |
| 콘텐츠 제목             | 1자 이상 50자 이하                                        |
| 콘텐츠 본문             | 1자 이상 500자 이하                                       |
| 콘텐츠 카테고리         | 1개 이상. 화면 사양상 최대 3개                            |
| 링크                    | URI 형식. 수정 시 빈 문자열을 보내면 삭제                 |
| 알림 제목               | 1자 이상 50자 이하                                        |
| 알림                    | 콘텐츠당 1개. 이미 있으면 409                             |
| 예약 시각               | 타임존 포함 ISO 8601(`2025-12-20T10:00:00+09:00`), 미래   |
| 카테고리 값             | 영문 enum 11개. 한글 라벨 매핑은 `entities/content/model` |
| 콘텐츠 `publish_status` | `draft`(비공개), `scheduled`(예약), `published`(공개)     |
| 알림 `send_status`      | `pending`(예약), `sent`(발송), `failed`(실패)             |
| 알림 `target_type`      | `all`, `follower`, `member`                               |
