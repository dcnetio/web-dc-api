import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = ts.createSourceFile(
  "aiproxy-module.ts",
  readFileSync(new URL("../../lib/modules/aiproxy-module.ts", import.meta.url), "utf8"),
  ts.ScriptTarget.Latest,
  true,
);
let extractMethod;
function visit(node) {
  if (ts.isMethodDeclaration(node) && node.name.getText(source) === "ExtractAIResourceResult") {
    extractMethod = node.getText(source);
  }
  ts.forEachChild(node, visit);
}
visit(source);
assert.ok(extractMethod);
const compiled = ts.transpileModule(`class Extractor { ${extractMethod} }`, {
  compilerOptions: { target: ts.ScriptTarget.ES2020 },
}).outputText;
const extractor = new Function(`${compiled}; return new Extractor();`)();

test("OpenAI base64 images are classified without an expected media hint", () => {
  for (const [data, mime] of [
    ["iVBORw0KGgo=", "image/png"],
    ["/9j/4AAQ", "image/jpeg"],
    ["UklGR123", "image/webp"],
  ]) {
    const result = extractor.ExtractAIResourceResult(JSON.stringify({ data: [{ b64_json: data }] }));
    assert.deepEqual(result.imagelist, [{ "data[0].b64_json": `data:${mime};base64,${data}` }]);
    assert.equal(result.doclist.length, 0);
  }
});

test("OpenAI empty images, URL responses and Gemini responses retain their behavior", () => {
  assert.equal(extractor.ExtractAIResourceResult('{"data":[{"b64_json":""}]}').imagelist.length, 0);
  assert.equal(extractor.ExtractAIResourceResult('{"data":[{"url":"https://example.com/image.png"}]}').imagelist.length, 1);
  assert.equal(extractor.ExtractAIResourceResult('{"inlineData":{"mimeType":"image/png","data":"AA=="}}').imagelist.length, 1);
  assert.equal(extractor.ExtractAIResourceResult('not-json').imagelist.length, 0);
});