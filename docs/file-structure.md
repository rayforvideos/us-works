# 파일 구조와 이름 규칙

모듈을 디렉토리로 묶는 방식과 파일 이름 규칙을 정한다. 파일이나 디렉토리를 새로 만들 때 읽는다.

## 모듈은 디렉토리다

구현 파일 하나가 아니라 디렉토리 하나가 모듈 단위다. 구현, 테스트, 공개 진입점이 항상 같은 디렉토리에 있다.

```
header/
├── header.tsx        # 구현
├── header.test.tsx   # 테스트
├── types.ts          # 외부가 쓰는 타입 (있을 때만)
├── constants.ts      # 외부나 테스트가 쓰는 상수 (있을 때만)
└── index.ts          # 공개 진입점
```

- 외부에서는 `index.ts`를 통해서만 import한다. 디렉토리 안의 파일 경로를 직접 참조하지 않는다.
- `index.ts`는 named re-export만 한다. `export *`는 쓰지 않는다.
- 테스트 파일은 대상 파일과 같은 이름에 `.test`를 붙인다. 별도 `__tests__` 디렉토리를 만들지 않는다.
- 모듈에 딸린 타입, 상수, 보조 함수도 같은 디렉토리에 둔다. 다른 모듈이 쓰기 시작하면 상위 레이어나 `shared`로 올린다.
- 외부 라이브러리 타입을 넓히는 모듈 확장은 모듈 디렉토리 안의 `<라이브러리>.d.ts`(예: `axios.d.ts`)에 둔다.
- 다른 모듈이나 테스트가 import하는 타입은 `types.ts`에, 상수는 `constants.ts`에 둔다. 구현 파일 안에서만 쓰는 타입과 상수는 구현 파일에 그대로 둔다. 파일명은 `types.ts`, `constants.ts`로 고정하고 모듈 이름을 붙이지 않는다.
- 대소문자만 바뀌는 이름 변경(`App.tsx` → `app.tsx`)은 반드시 `git mv`로 한다. macOS는 대소문자를 구분하지 않아 파일만 바꾸면 git에 기록되지 않고, Linux에서 import가 깨진다.

## 이름 규칙

| 대상                     | 규칙           | 예                                          |
| ------------------------ | -------------- | ------------------------------------------- |
| 디렉토리                 | kebab-case     | `publish-modal/`, `content-list/`           |
| 컴포넌트 파일            | kebab-case     | `publish-modal.tsx`                         |
| 일반 모듈 파일           | kebab-case     | `format-date.ts`, `api-client.ts`           |
| 훅 파일과 훅 디렉토리    | camelCase      | `useAuth/useAuth.ts`, `useAuth.test.ts`     |
| 테스트 파일              | 대상 + `.test` | `publish-modal.test.tsx`, `useAuth.test.ts` |
| 공개 진입점              | 고정           | `index.ts`                                  |
| export되는 컴포넌트 이름 | PascalCase     | `export function PublishModal()`            |
| export되는 훅 이름       | camelCase      | `export function useAuth()`                 |

파일 이름과 export 이름은 다를 수 있다. `publish-modal.tsx`가 `PublishModal`을 export한다.

## FSD 세그먼트 아래에서의 적용

세그먼트(`ui`, `model`, `api`, `lib`) 바로 아래에 모듈 디렉토리를 둔다. 슬라이스의 `index.ts`는 세그먼트 안의 모듈 `index.ts`를 다시 export한다.

```
features/publish-content/
├── ui/
│   └── publish-modal/
│       ├── publish-modal.tsx
│       ├── publish-modal.test.tsx
│       └── index.ts
├── model/
│   └── usePublishForm/
│       ├── usePublishForm.ts
│       ├── usePublishForm.test.ts
│       └── index.ts
└── index.ts
```

`shared/ui`, `shared/lib`도 같은 구조이며 세그먼트 단위의 `index.ts`는 두지 않고 모듈 디렉토리마다 둔다. 반면 `shared/api`, `shared/config`는 세그먼트 `index.ts`를 공개 API로 두고 외부는 `@/shared/api`처럼 세그먼트 경로로 import한다. steiger의 `no-public-api-sidestep` 규칙이 이를 검사한다.

## 예외

- `app` 레이어 루트의 진입점(`main.tsx`), 라우터, 프로바이더처럼 테스트가 없는 연결 파일은 디렉토리로 묶지 않는다. 테스트가 있는 모듈은 `app` 레이어라도 예외 없이 디렉토리로 묶는다(`app/initialize-system/`).
- 설정 파일(`vite.config.ts`, `eslint.config.js` 등)과 `shared/config`의 셋업 파일은 이 규칙의 대상이 아니다.
