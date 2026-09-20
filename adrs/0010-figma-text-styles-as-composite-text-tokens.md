# ADR-0010: Map Figma Text Styles to Composite Text Tokens

## Status

Accepted

## Context

ADR-0007은 텍스트를 크기 토큰(`--text-12`~`--text-18`)과 Tailwind `font-*` 굵기 클래스의 조합으로 표현하기로 했다. 그런데 Tailwind 4는 `--text-<이름>--line-height`, `--text-<이름>--font-weight` 하위 속성으로 크기, 행간, 굵기를 한 유틸리티에 담을 수 있다. Figma 텍스트 스타일(`Pr_16_SB600`)은 이미 그 세 값의 묶음이라, 조합 방식은 Figma에 없는 굵기 조합을 허용하고 클래스에서 스타일 이름을 역산하기 어렵다.

## Decision

- Figma 텍스트 스타일 하나를 `--text-<크기>-<굵기 약어><굵기>` 토큰 하나로 옮긴다(`Pr_16_SB600` → `--text-16-sb600`, 클래스 `text-16-sb600`). 행간과 굵기는 하위 속성으로 함께 정의한다.
- `--font-weight-*: initial`로 Tailwind 굵기 클래스를 비운다. 텍스트 스타일은 토큰으로만 쓴다.
- 이름 없는 Figma 텍스트(라벨 12px 600, GNB 제목 18px 700)도 같은 규칙으로 이름을 붙여 토큰으로 둔다.
- 토큰은 `src/app/styles/theme/`에 색(`colors.css`), 텍스트(`typography.css`), 형태(`shape.css`)로 나눠 두고, 요소 기본값은 `base.css`, `globals.css`는 import만 가진다. Figma 변수 그룹과 파일이 1:1이다.

## Consequences

**좋은 점**

- 클래스 하나가 Figma 스타일 하나에 대응해 검수가 클래스 이름으로 끝나고, Figma에 없는 텍스트 스타일은 쓸 수 없다.

**나쁜 점과 감수하는 위험**

- 같은 크기의 다른 굵기가 필요하면 토큰을 추가해야 한다. Figma에 스타일이 추가됐다는 뜻이므로 그때 함께 늘린다.
