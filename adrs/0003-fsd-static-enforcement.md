# ADR-0003: Enforce FSD Boundaries Statically

## Status

Accepted

## Context

ADR-0002에서 Feature-Sliced Design(FSD) 2.1 구조를 채택하면서 레이어 import 방향, 슬라이스 간 격리, 공개 API 원칙을 정했다. 그러나 이 규칙은 문서에만 있고, 위반 여부는 코드 리뷰나 자체 점검에 의존한다.

FSD의 장점은 의존 방향이 한 방향으로 고정된다는 데 있다. 이 보장이 코드 레벨에서 강제되지 않으면 구조는 폴더 이름만 남은 관습이 되고, 평가자에게 아키텍처 기준을 보여준다는 목적도 약해진다.

FSD 2.1은 같은 레이어의 슬라이스끼리 참조가 불가피할 때를 위해 `@x` 표기법을 정의한다. 슬라이스가 `@x/<소비자 슬라이스>.ts` 파일로 특정 소비자에게만 공개하는 방식이며, 공식 문서는 이 표기법을 Entities 레이어에만 권장한다. 이 예외를 정확히 허용하면서 나머지 교차 참조는 막아야 한다.

사용 가능한 도구로는 FSD 공식 린터 steiger, 범용 아키텍처 경계 검사기 eslint-plugin-boundaries, FSD 전용 ESLint 플러그인 @conarti/eslint-plugin-feature-sliced가 있다. steiger는 폴더 구조 자체를 검사하고, ESLint 플러그인은 파일 단위 import를 검사해 에디터에서 즉시 피드백을 준다. eslint-plugin-boundaries는 7.x에서 `element-types`, `entry-point` 등 개별 규칙을 deprecated로 돌리고, 단일 `dependencies` 규칙에 selector 기반 정책을 선언하는 방식으로 바뀌었다.

## Decision

- FSD 규칙을 문서 컨벤션이 아니라 정적 검사로 강제한다. 위반은 린트 실패로 취급하며, 린트가 실패하면 빌드와 커밋을 진행하지 않는다.
- import 경계 검사 도구로 eslint-plugin-boundaries 7을 사용한다. ESLint 10 flat config에서 동작하고, 레이어와 슬라이스를 element로 모델링한 뒤 `boundaries/dependencies` 규칙의 정책으로 다음 세 가지를 선언한다.
  - 레이어 방향: 각 레이어는 자신보다 아래 레이어만 import한다.
  - 슬라이스 격리: 같은 레이어의 다른 슬라이스는 import하지 않는다.
  - 공개 API: 다른 슬라이스는 `index.ts`를 통해서만 import하고 내부 파일 경로를 직접 참조하지 않는다.
- 구조 검사 도구로 FSD 공식 린터 steiger를 사용한다. 공개 API 우회, 금지된 import, 세그먼트 없는 슬라이스, 과도한 슬라이스 분할, 의미 없는 슬라이스 등 폴더 구조 수준의 위반을 검사한다.
- 같은 레이어의 슬라이스 간 참조는 `@x` 표기법으로만 허용한다. 공개하는 슬라이스에 `@x/<소비자 슬라이스>.ts`를 두고, 소비자는 `@/entities/<슬라이스>/@x/<소비자>`로만 import한다. eslint-plugin-boundaries의 `dependencies` 정책에서 이 경로를 허용 대상으로 등록하고, steiger의 `forbidden-imports` 규칙도 `@x` 경로를 허용하므로 두 도구가 같은 예외를 공유한다.
- `@x` 교차 참조는 `entities` 레이어에만 허용한다. FSD 2.1 공식 권장과 같으며, `features`나 `widgets` 사이에 참조가 필요해지면 상위 레이어로 올리거나 `entities`로 내린다.
- `shared/ui`와 `shared/lib`는 FSD 공식 권장대로 레이어 단일 index 대신 컴포넌트, 모듈별 `index.ts`를 둔다. steiger의 `fsd/public-api` 규칙은 `shared` 하위에서 끄고, boundaries 정책에서는 `shared`를 파일 단위 import 허용 대상으로 둔다.
- 슬라이스 내부 import는 상대 경로를, 레이어 간 import는 `@/` 별칭 절대 경로를 사용한다. 선언된 element 밖에 있는 파일은 `boundaries/no-unknown-files`로 잡는다.
- npm 스크립트에 `lint:fsd`(steiger 실행)를 추가하고, `lint`는 ESLint와 steiger를 함께 실행한다. `check` 스크립트로 `typecheck`, `lint`, `test:run`을 묶어 한 명령으로 전체 검증을 수행한다.
- @conarti/eslint-plugin-feature-sliced는 사용하지 않는다. 기능이 eslint-plugin-boundaries와 겹치고, boundaries 쪽이 `@x` 진입점 같은 세부 규칙을 selector와 템플릿으로 더 유연하게 표현한다.

## Consequences

**좋은 점**

- 레이어 역전, 슬라이스 교차 참조, 공개 API 우회가 에디터에서 즉시 빨간 줄로 드러나고 린트 단계에서 차단된다.
- `@x` 표기법으로 교차 참조가 파일 이름에 명시되어, 어떤 슬라이스가 어떤 슬라이스에 의존하는지 폴더만 봐도 알 수 있다.
- steiger가 구조 수준 문제(세그먼트 없는 슬라이스, 불필요한 슬라이스)를 잡아 FSD를 형식적으로만 따르는 상태를 막는다.
- 평가자가 ESLint 설정만 봐도 아키텍처 규칙이 무엇이고 어떻게 강제되는지 알 수 있다.

**나쁜 점과 감수하는 위험**

- 개발 의존성이 세 개(eslint-plugin-boundaries, steiger, @feature-sliced/steiger-plugin) 늘고, ESLint 설정이 길어진다.
- boundaries 7의 selector 문법(`fileInternalPath`, `relationship`, 템플릿)이 실제 폴더 구조와 어긋나면 오탐이나 미탐이 생긴다. 초기 스캐폴딩 직후 의도적인 위반 코드를 넣어 정책이 실제로 잡히는지 확인한다.
- steiger 0.x는 아직 안정 버전이 아니라 규칙 이름이나 설정 형식이 바뀔 수 있다. 문제가 생기면 버전을 고정한다.
- 규칙이 엄격해 초기 개발 속도가 다소 느려진다. 구조가 잡힌 뒤에는 오히려 판단 비용이 줄어 상쇄된다.
- 커밋 전 자동 실행(git hook)과 CI 실행은 이 ADR 범위에 넣지 않았다. git hook은 ADR-0004에서, CI는 GitHub Actions 도입 ADR에서 결정한다.
