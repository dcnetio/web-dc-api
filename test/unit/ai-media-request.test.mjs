import assert from "node:assert/strict";
import test from "node:test";

import {
  buildDashScopeMediaRequestBody,
  normalizeAIProxyMediaSource,
} from "../../lib/implements/aiproxy/media-request.ts";
import { getAITaskStatusState } from "../../lib/modules/aiproxy/task-status.ts";

test("async task polling keeps pending responses pending even when they echo a media URL", () => {
  assert.equal(
    getAITaskStatusState({
      output: {
        task_status: "PENDING",
        video_url: "https://example.com/video.mp4",
      },
    }),
    "pending",
  );
  assert.equal(
    getAITaskStatusState({ output: { task_status: "SUCCEEDED" } }),
    "success",
  );
  assert.equal(
    getAITaskStatusState({ output: { task_status: "FAILED" } }),
    "failed",
  );
});

test("DashScope media adapter builds input.messages from semantic input", () => {
  const body = JSON.parse(
    buildDashScopeMediaRequestBody(
      "edit the first image",
      ["https://example.com/source.jpg", "data:image/png;base64,AA=="],
      { n: 1 },
    ),
  );

  assert.deepEqual(body, {
    input: {
      messages: [{
        role: "user",
        content: [
          { image: "https://example.com/source.jpg" },
          { image: "data:image/png;base64,AA==" },
          { text: "edit the first image" },
        ],
      }],
    },
    parameters: { n: 1 },
  });
});

test("HTTPS transport rejects browser-local media instead of leaking blob URLs", async () => {
  await assert.rejects(
    normalizeAIProxyMediaSource(
      new Blob([Uint8Array.of(0xff, 0xd8, 0xff)], { type: "image/jpeg" }),
      { transport: "https_url" },
    ),
    /requires an HTTPS image URL/,
  );
});

test("data URI transport converts local image blobs before proxy submission", async () => {
  const result = await normalizeAIProxyMediaSource(
    new Blob([Uint8Array.of(0xff, 0xd8, 0xff)], { type: "image/jpeg" }),
    { transport: "data_uri" },
  );

  assert.match(result, /^data:image\/jpeg;base64,/);
});

test("default transport remains HTTPS-compatible with the app market flow", async () => {
  assert.equal(
    await normalizeAIProxyMediaSource("https://nowcode.vip/ipfs/cid/photo.jpg"),
    "https://nowcode.vip/ipfs/cid/photo.jpg",
  );
  await assert.rejects(
    normalizeAIProxyMediaSource("data:image/png;base64,AA=="),
    /Data URI images are disabled/,
  );
});