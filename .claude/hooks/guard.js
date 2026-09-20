import { execSync } from "node:child_process";
import { existsSync, readFileSync, statSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

/**
 * @constants
 */
const APPROVE_FILE = ".claude/approve";
const APPROVE_TTL_MS = 30 * 60 * 1000;

const DENY_RULES = [
  { pattern: /--no-verify\b/, reason: "훅 검사를 건너뛰는 --no-verify는 쓰지 않습니다." },
  { pattern: /\bgit\s+push\b[^|;&]*\s(--force|-f)\b/, reason: "강제 푸시는 쓰지 않습니다." },
  {
    pattern: /\bgh\s+pr\s+(merge|close)\b[^|;&]*--delete-branch/,
    reason:
      "로컬 브랜치까지 지우는 --delete-branch는 쓰지 않습니다. 원격 브랜치는 저장소 설정이 자동으로 지웁니다.",
  },
  {
    pattern: /\.claude\/approve\b/,
    reason: "승인 토큰은 사용자만 만듭니다. 변경 내용을 보고하고 사용자의 `승인`을 기다리세요.",
  },
];

const GUARDED_RULES = [
  { pattern: /\bgit\s+commit\b/, label: "커밋", consumes: false },
  { pattern: /\bgit\s+push\b/, label: "푸시", consumes: false },
  { pattern: /\bgit\s+reset\b/, label: "리셋", consumes: false },
  { pattern: /\bgit\s+branch\s+-[dD]\b/, label: "브랜치 삭제", consumes: false },
  { pattern: /\bgh\s+pr\s+create\b/, label: "PR 생성", consumes: true },
  { pattern: /\bgh\s+pr\s+merge\b/, label: "PR 합병", consumes: true },
  { pattern: /\bgh\s+pr\s+close\b/, label: "PR 닫기", consumes: true },
];

function readCurrentBranch(cwd) {
  try {
    return execSync("git branch --show-current", { cwd, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return "";
  }
}

function respond(decision, reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: decision,
        permissionDecisionReason: reason,
      },
    }),
  );
}

function hasValidToken(tokenPath) {
  if (!existsSync(tokenPath)) {
    return false;
  }
  const ageMs = Date.now() - statSync(tokenPath).mtimeMs;
  if (ageMs > APPROVE_TTL_MS) {
    unlinkSync(tokenPath);
    return false;
  }
  return true;
}

function guardFileTools(input) {
  const filePath = String(input.tool_input?.file_path ?? "");
  if (filePath.endsWith(APPROVE_FILE)) {
    respond("deny", "🚫 차단 · 승인 토큰은 사용자만 만듭니다.");
  }
}

function guardBash(input, projectDir) {
  const command = String(input.tool_input?.command ?? "");

  const denied = DENY_RULES.find((rule) => rule.pattern.test(command));
  if (denied) {
    respond("deny", `🚫 차단 · ${denied.reason}`);
    return;
  }

  const matched = GUARDED_RULES.filter((rule) => rule.pattern.test(command));
  if (matched.length === 0) {
    return;
  }

  const labels = matched.map((rule) => rule.label).join(", ");
  const tokenPath = join(projectDir, APPROVE_FILE);
  if (hasValidToken(tokenPath)) {
    if (matched.some((rule) => rule.consumes)) {
      unlinkSync(tokenPath);
      respond("allow", `✅ 승인 확인 · ${labels}. 체크포인트를 통과해 토큰을 닫았습니다.`);
      return;
    }
    respond("allow", `✅ 승인 확인 · ${labels}`);
    return;
  }

  const branch = readCurrentBranch(input.cwd);
  const lines = [
    `🔒 승인 필요 · ${labels}`,
    branch ? `현재 브랜치: ${branch}` : null,
    describeCheckpoint(matched),
    "AskUserQuestion(header `🔒 체크포인트`, 선택지 `승인` / `수정 필요`)을 띄우세요. 질문 첫 줄에 어떤 체크포인트인지와 승인 시 실행되는 명령을 적습니다. 사용자가 승인을 고르면 토큰이 생기고, PR 생성·합병·닫기에서 닫힙니다.",
  ].filter(Boolean);
  respond("deny", lines.join("\n"));
}

function describeCheckpoint(matched) {
  const labels = new Set(matched.map((rule) => rule.label));
  if (labels.has("PR 합병")) {
    return "합병 체크포인트입니다. CI 결과를 보고하고 멈추세요.";
  }
  if (labels.has("PR 닫기")) {
    return "PR 닫기는 사용자가 지시했을 때만 합니다. 이유를 보고하고 멈추세요.";
  }
  if (labels.has("리셋") || labels.has("브랜치 삭제")) {
    return "이력을 되돌리거나 브랜치를 지우는 작업입니다. 무엇을 왜 되돌리는지 보고하고 멈추세요.";
  }
  return "커밋 전 체크포인트입니다. 변경 파일, 검증 방법, 커밋 분할과 메시지를 보고하고 멈추세요.";
}

function main() {
  const input = JSON.parse(readFileSync(0, "utf8"));
  const projectDir = process.env.CLAUDE_PROJECT_DIR ?? input.cwd;
  if (input.tool_name === "Bash") {
    guardBash(input, projectDir);
    return;
  }
  guardFileTools(input);
}

main();
