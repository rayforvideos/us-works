# ADR-0001: Frontend Tech Stack Selection

## Status

Accepted

## Context

프론트엔드 과제를 구현한다. Figma로 제공된 디자인을 웹 화면으로 옮기는 과제로, 폼과 어드민 성격의 화면이 있고 대시보드 형태의 화면이 포함될 수 있다. SSR이나 SEO 요구는 없다. 평가자가 코드를 읽고 실행하므로 구조가 명확하고 셋업이 단순해야 한다.

JD에 명시된 현재 사용 기술은 다음과 같다.

- 코어: React, TypeScript, Next.js (App Router), Flutter
- 상태 관리: TanStack Query, Jotai
- 스타일링: Tailwind CSS, shadcn/ui
- 패키지 매니저: pnpm
- 빌드: Webpack, SWC, Vite
- CI/CD: GitHub Actions
- 테스트: Vitest, Storybook
- 모니터링: Sentry

JD와의 정합성을 우선 기준으로 삼되, 과제 범위에 불필요한 기술은 제외한다.

## Decision

- 프레임워크와 빌드 도구로 React 19 + Vite 8을 사용한다. JD에 Next.js도 있지만 어드민 페이지는 SEO와 SSR이 크게 필요 없어 서버 컴포넌트와 캐싱 계층이 불필요한 복잡도가 되므로, 역시 JD에 있는 Vite를 택한다.
- React Compiler를 켠다. babel-plugin-react-compiler가 1.0으로 안정화되었고 React 19에서는 추가 런타임 패키지가 필요 없다. @vitejs/plugin-react 6의 Babel 경로(`@rolldown/plugin-babel` + `reactCompilerPreset`)로 적용하며, 같은 플러그인의 `compiler: true` 옵션이 쓰는 Rust 구현(oxc-transform-react)은 experimental이라 쓰지 않는다.
- 언어로 TypeScript 6.0.x를 `strict` 모드로 사용한다. 7.x는 Go 네이티브 컴파일러로 프로그램 API를 제공하지 않아 typescript-eslint(지원 범위 `<6.1.0`)가 동작하지 않으므로, 도구 체인이 7.1 이후 API를 지원할 때까지 6.x를 유지한다.
- 스타일링으로 Tailwind CSS 4를 사용한다. Figma 디자인 토큰은 `@theme` 블록의 CSS 변수로 매핑한다.
- 서버 상태 관리로 TanStack Query 5를 사용한다.
- 클라이언트 전역 상태 관리로 Jotai를 사용한다. JD에 명시된 라이브러리이면서, 폼과 어드민 화면의 필드 값, 필터 조건, 선택된 행처럼 독립적인 상태 조각이 많고 대시보드라면 위젯마다 다른 상태를 구독하는 과제 특성에 맞는다. 아톰 단위로 선언하고 필요한 컴포넌트만 구독하게 하므로 Zustand처럼 단일 스토어를 슬라이스로 나누는 방식보다 결합도가 낮고, 파생 아톰으로 유효성 검증과 집계 값을 선언적으로 표현할 수 있다.
- 패키지 매니저로 pnpm을 사용하고, `packageManager` 필드와 corepack으로 버전을 고정한다.
- 테스트 도구로 Vitest와 Testing Library를 사용한다.
- 린트와 포맷 도구로 ESLint(flat config)와 Prettier를 사용한다.
- JD에 있는 shadcn/ui, Storybook, GitHub Actions는 초기 셋업에 포함하지 않는다. Figma 컴포넌트 구성, 컴포넌트 수, 원격 저장소를 확인 후 각각 별도 ADR로 도입을 결정한다.

## Consequences

**좋은 점**

- 채택한 모든 기술이 JD에 있어 평가자가 익숙한 코드로 읽을 수 있다.
- 셋업이 단순해 평가자가 `pnpm install`과 `pnpm dev`만으로 실행할 수 있다.
- Vite, Vitest, Tailwind가 하나의 설정 체계를 공유해 도구 간 마찰이 적다.
- 아톰 단위 상태 모델로 폼 필드와 대시보드 위젯이 필요한 상태만 구독하므로 불필요한 리렌더링이 줄어든다.
- React Compiler가 자동 메모이제이션을 수행해 `useMemo`, `useCallback`, `memo`를 수동으로 관리하는 코드가 줄고, 컴파일러 규칙을 따르는 코드 작성 경험을 보여줄 수 있다.

**나쁜 점과 감수하는 위험**

- Tailwind 유틸리티 클래스가 길어지면 JSX 가독성이 떨어진다. 반복 조합은 컴포넌트로 추출해 완화한다.
- Jotai 아톰이 여러 파일에 흩어지면 상태 흐름을 추적하기 어려워질 수 있다. 아톰의 배치 규칙은 ADR-0002에서 정한다.
- pnpm이 로컬에 없으면 corepack 활성화 단계가 하나 추가된다.
- React Compiler를 Babel 경로로 적용하면 Vite 8의 네이티브 변환 파이프라인에 Babel이 끼어 개발 서버 변환이 다소 느려진다. 과제 규모에서 허용한다. 컴파일러는 React 규칙을 위반한 컴포넌트를 조용히 건너뛰므로, eslint-plugin-react-hooks 7의 컴파일러 규칙으로 위반을 린트 단계에서 드러낸다.
- Tailwind 4, Vite 8, Jotai 3(2026-09-08 릴리스), React Router 8은 비교적 최신 메이저 버전이라 일부 플러그인 호환 문제가 생길 수 있다. 문제가 발생하면 해당 도구만 한 단계 낮은 메이저로 고정하고 새 ADR로 기록한다.
