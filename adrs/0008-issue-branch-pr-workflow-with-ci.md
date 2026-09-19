# ADR-0008: Work in Issue Branches and Merge through Pull Requests Gated by GitHub Actions

## Status

Accepted

## Context

프로젝트 셋업이 끝나고 기능 화면 작업이 시작된다. 지금까지는 `main`에 직접 커밋했고, 검사는 로컬 훅(`pre-commit`의 lint-staged, `pre-push`의 `pnpm check`)에만 의존한다. 훅은 `--no-verify`로 건너뛸 수 있고, 어떤 작업이 왜 이루어졌는지는 커밋 메시지 외에 남지 않는다.

## Decision

- 기능 하나마다 GitHub Issue를 만들고 이슈 번호를 티켓 코드로 쓴다. 본문에는 대상 화면, 사용하는 엔드포인트, 스펙 링크, 슬라이스 단위의 작업 목록을 적고, 작업 목록은 코드를 쓰기 전에 확인을 받는다.
- `feat` 이슈는 착수 전에 스펙 문서를 `specs/TEMPLATE.md` 형식으로 `specs/<이슈번호>-<이름>.md`에 쓴다. 구현은 스펙의 규칙(`R-xx`)과 흐름(`S-xx`)을 따르고 테스트 이름에 그 ID를 쓴다. `[확인 필요]`가 남아 있으면 구현을 시작하지 않는다. `fix`, `chore`는 이슈 본문으로 대신한다.
- 브랜치 이름은 `<이슈번호>-<짧은-영문-설명>`(예: `12-login-page`)으로 하고 이슈 하나의 작업은 그 브랜치에서만 한다. GitHub가 이슈에서 만들어 주는 브랜치 형식과 같다.
- 커밋 메시지에는 이슈 번호를 넣지 않는다. 브랜치 이름이 이미 티켓을 가리킨다.
- 작업이 끝나면 `main`으로 PR을 하나 올리고 본문 첫 줄에 `Closes #<이슈번호>`를 적는다. PR 템플릿은 `.github/pull_request_template.md`에 두고 변경 내용, 확인 방법, 화면, 완료 체크리스트(모든 `S-xx`에 테스트가 있다, 화면 상태를 모두 다뤘다, 스펙에 `[확인 필요]`가 없다)를 받는다. 체크하지 못하는 항목이 있으면 PR을 올리지 않는다.
- 합병은 merge commit으로 하고 커밋 이력을 보존한다. squash와 rebase 합병은 저장소 설정에서 끄고, 합병된 브랜치는 자동 삭제한다.
- GitHub Actions 워크플로 `.github/workflows/ci.yml` 하나를 두고 PR과 `main` 푸시에서 실행한다. `.nvmrc`의 Node와 `packageManager`의 pnpm으로 `pnpm install --frozen-lockfile` 뒤 `pnpm check`를 실행하며, 같은 브랜치의 이전 실행은 취소한다. 로컬 훅과 CI가 같은 명령을 쓰므로 검사 목록이 갈라지지 않는다.
- `main`은 브랜치 보호로 직접 푸시를 막고 PR과 CI 통과를 필수로 하며 관리자에게도 적용한다. 혼자 작업하므로 승인 리뷰는 요구하지 않는다.

## Consequences

**좋은 점**

- 이슈, 스펙, 브랜치, PR이 한 번호로 이어져 평가자가 기능 단위로 이력을 따라갈 수 있다.
- 훅을 건너뛴 커밋도 `main`에는 CI를 통과해야 들어간다.

**나쁜 점과 감수하는 위험**

- 작은 수정도 이슈와 PR을 거쳐야 해서 한 줄 고치는 데 단계가 늘어난다.
