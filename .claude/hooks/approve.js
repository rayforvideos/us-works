import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";

/**
 * @constants
 */
const APPROVE_FILE = ".claude/approve";
const APPROVE_WORDS = /^(승인|approve|ok)$/i;
const CHECKPOINT_HEADER = /체크포인트/;
const APPROVE_LABEL = "승인";

function isApprovedByPrompt(input) {
  return APPROVE_WORDS.test(String(input.prompt ?? "").trim());
}

function isApprovedByQuestion(input) {
  if (input.tool_name !== "AskUserQuestion") {
    return false;
  }
  const questions = input.tool_response?.questions ?? [];
  const answers = input.tool_response?.answers ?? {};
  return questions.some(
    (question) =>
      CHECKPOINT_HEADER.test(String(question.header ?? "")) &&
      String(answers[question.question] ?? "").trim() === APPROVE_LABEL,
  );
}

function writeToken(projectDir) {
  const tokenPath = join(projectDir, APPROVE_FILE);
  mkdirSync(dirname(tokenPath), { recursive: true });
  writeFileSync(tokenPath, `${new Date().toISOString()}\n`);
}

function main() {
  const input = JSON.parse(readFileSync(0, "utf8"));
  const approved =
    input.hook_event_name === "UserPromptSubmit"
      ? isApprovedByPrompt(input)
      : isApprovedByQuestion(input);
  if (!approved) {
    return;
  }
  writeToken(process.env.CLAUDE_PROJECT_DIR ?? input.cwd);
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: input.hook_event_name,
        additionalContext:
          "✅ 사용자가 체크포인트를 승인해 토큰이 생겼습니다. 보고한 커밋 분할대로 커밋, 푸시, PR 생성을 진행하세요. 합병 체크포인트였다면 merge commit으로 합치세요.",
      },
    }),
  );
}

main();
