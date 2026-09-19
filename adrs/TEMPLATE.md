# ADR-NNNN: Decision Title in English

## Status

Accepted

## Context

어떤 상황이고 왜 결정이 필요한가. 제약 조건, 요구사항, 팀 상황을 서술형 문단으로 쓴다. 주어진 사실을 나열할 때만 글머리 목록을 쓴다.

## Decision

- 무엇을 하기로 했는지 능동태 문장으로 쓴다. 각 항목은 "…로 X를 사용한다", "…를 …에 둔다"처럼 결정 대상과 동사로 끝낸다.
- 항목 하나에 결정 한 문장과 근거 최대 두 문장을 쓴다.
- 고정된 항목을 열거할 때만 한 단계 들여쓴 하위 목록을 쓰고, 각 항목은 `이름`: 설명 형식으로 쓴다.
- 굵은 글씨는 쓰지 않는다. 코드, 경로, 식별자만 백틱으로 감싼다.

## Consequences

**좋은 점**

- 이 결정으로 얻는 것.

**나쁜 점과 감수하는 위험**

- 이 결정으로 잃는 것, 감수하는 위험, 완화 방법.

---

작성 규칙

- 파일명은 `NNNN-kebab-case-title.md`이며 번호는 네 자리로 순차 부여한다.
- 제목은 영어로 쓰고(`# ADR-NNNN: English Title`), 섹션 헤더도 영어 그대로 둔다. 본문은 한글로 쓴다.
- 섹션은 위 네 개만 쓰고 추가하지 않는다. 대안 비교, 후속 과제 등은 Context나 Consequences 문장 안에 녹인다.
- Status는 `Proposed`, `Accepted`, `Deprecated`, `Superseded by ADR-NNNN` 중 하나만 쓴다.
- 이미 승인된 ADR의 내용은 고치지 않는다. 결정이 바뀌면 새 ADR을 쓰고 이전 ADR의 Status를 `Superseded by`로 바꾼다.
- 다른 ADR을 언급할 때는 `ADR-NNNN` 표기를 쓴다.
