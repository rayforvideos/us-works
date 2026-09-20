const MARKER_PATTERN = /^\*\n \* @(types|constants)\n $/;
const CONSTANT_NAME_PATTERN = /^[A-Z][A-Z0-9_]*$/;
const TYPE_DECLARATIONS = new Set([
  "TSTypeAliasDeclaration",
  "TSInterfaceDeclaration",
  "TSEnumDeclaration",
]);

function unwrapExport(statement) {
  if (statement.type === "ExportNamedDeclaration" && statement.declaration) {
    return statement.declaration;
  }
  return statement;
}

function isConstantDeclaration(node) {
  return (
    node.type === "VariableDeclaration" &&
    node.kind === "const" &&
    node.declarations.every(
      (declarator) =>
        declarator.id.type === "Identifier" && CONSTANT_NAME_PATTERN.test(declarator.id.name),
    )
  );
}

function classify(statement) {
  if (statement.type === "ImportDeclaration") {
    return "import";
  }
  const node = unwrapExport(statement);
  if (TYPE_DECLARATIONS.has(node.type)) {
    return "type";
  }
  if (isConstantDeclaration(node)) {
    return "constant";
  }
  return "code";
}

function readMarker(comment) {
  if (comment.type !== "Block") {
    return null;
  }
  const match = MARKER_PATTERN.exec(comment.value);
  return match ? match[1] : null;
}

function collectSections(statements) {
  const sections = { firstType: null, firstConstant: null, outOfSection: [] };
  let seenConstant = false;
  let seenCode = false;
  for (const statement of statements) {
    const kind = classify(statement);
    if (kind === "type") {
      if (seenConstant || seenCode) {
        sections.outOfSection.push({ statement, messageId: "typeOutOfSection" });
      }
      sections.firstType ??= statement;
    } else if (kind === "constant") {
      if (seenCode) {
        sections.outOfSection.push({ statement, messageId: "constantOutOfSection" });
      }
      seenConstant = true;
      sections.firstConstant ??= statement;
    } else if (kind === "code") {
      seenCode = true;
    }
  }
  return sections;
}

export const sectionMarkers = {
  meta: {
    type: "problem",
    docs: {
      description:
        "구현 파일의 타입과 UPPER_CASE 상수를 import 아래 구역에 모으고 세 줄 JSDoc @types, @constants로 표시한다.",
    },
    schema: [],
    messages: {
      typeOutOfSection: "타입 선언은 import 바로 아래 @types 구역에 모아 둔다.",
      constantOutOfSection: "UPPER_CASE 상수는 @types 구역 아래 @constants 구역에 모아 둔다.",
      missingMarker: "구역의 첫 선언 위에 세 줄 JSDoc @{{ name }} 표시가 필요하다.",
      strayMarker: "@types, @constants 표시는 구역의 첫 선언 위에만 둔다.",
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    return {
      Program(program) {
        const sections = collectSections(program.body);
        for (const { statement, messageId } of sections.outOfSection) {
          context.report({ node: statement, messageId });
        }

        const expected = [
          [sections.firstType, "types"],
          [sections.firstConstant, "constants"],
        ].filter(([statement]) => statement !== null);
        const allowedMarkers = new Set();
        for (const [statement, name] of expected) {
          const marker = sourceCode
            .getCommentsBefore(statement)
            .find((comment) => readMarker(comment) === name);
          if (marker) {
            allowedMarkers.add(marker);
          } else {
            context.report({ node: statement, messageId: "missingMarker", data: { name } });
          }
        }

        for (const comment of sourceCode.getAllComments()) {
          if (readMarker(comment) !== null && !allowedMarkers.has(comment)) {
            context.report({ loc: comment.loc, messageId: "strayMarker" });
          }
        }
      },
    };
  },
};
