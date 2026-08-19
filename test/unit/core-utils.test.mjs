import assert from "node:assert/strict";
import test from "node:test";

import { parseRangeHeader } from "../../lib/common/http-range.ts";
import {
  buildDirectoryCachePath,
  resolveFileCacheClearTarget,
} from "../../lib/implements/file/file-cache-key.ts";
import { BrowserLineReader, readLine } from "../../lib/util/BrowserLineReader.ts";
import { base64Decode, base64Encode } from "../../lib/util/base64.ts";
import { BaseEntity } from "../../lib/serverless/base_entity.ts";

test("parseRangeHeader parses, bounds, and rejects HTTP byte ranges", () => {
  assert.deepEqual(parseRangeHeader("bytes=10-30", 100, 8), {
    start: 10,
    end: 17,
  });
  assert.deepEqual(parseRangeHeader("bytes=95-", 100, 8), {
    start: 95,
    end: 99,
  });
  assert.deepEqual(parseRangeHeader("bytes=-12", 100, 8), {
    start: 92,
    end: 99,
  });
  assert.deepEqual(parseRangeHeader(" bytes=-1000 ", 100, 8), {
    start: 92,
    end: 99,
  });

  for (const header of [
    "bytes=",
    "bytes=0-1,4-5",
    "bytes=100-",
    "bytes=9-8",
    "items=0-1",
    "bytes=-0",
  ]) {
    assert.equal(parseRangeHeader(header, 100, 8), null, header);
  }
  assert.equal(parseRangeHeader("bytes=0-1", 0, 8), null);
  assert.equal(parseRangeHeader("bytes=0-1", 100, 0), null);
});

test("file cache paths preserve CID targets and decode directory paths", () => {
  assert.equal(buildDirectoryCachePath("bafy-root", "/photos/2026/"), "bafy-root/photos/2026");
  assert.equal(buildDirectoryCachePath("bafy-root", "/"), "bafy-root");

  assert.deepEqual(
    resolveFileCacheClearTarget("/dc/ipfs/bafy-root_secret/photos%2F2026%2Fcover.jpg"),
    {
      paths: ["bafy-root", "bafy-root/photos/2026/cover.jpg"],
      decryptKey: "secret",
    },
  );
  assert.deepEqual(resolveFileCacheClearTarget("/plain/path"), {
    paths: ["/plain/path"],
  });
  assert.deepEqual(resolveFileCacheClearTarget("/dc/ipfs/_secret"), {
    paths: [],
    decryptKey: "secret",
  });
});

test("custom Base64 codec round-trips arbitrary byte lengths", () => {
  for (const bytes of [
    new Uint8Array(),
    new Uint8Array([0]),
    new Uint8Array([0, 255]),
    new Uint8Array([0, 1, 2, 253, 254, 255]),
  ]) {
    const encoded = base64Encode(bytes);
    const decoded = base64Decode(new TextEncoder().encode(encoded));
    assert.deepEqual(decoded, bytes);
  }
});

test("BrowserLineReader handles LF, CRLF, trailing lines, and EOF", () => {
  const reader = new BrowserLineReader("first\r\nsecond\n");
  const decode = new TextDecoder();

  assert.equal(decode.decode(readLine(reader).line), "first");
  assert.equal(decode.decode(readLine(reader).line), "second");
  assert.equal(decode.decode(readLine(reader).line), "");

  const eof = readLine(reader);
  assert.equal(eof.line.length, 0);
  assert.equal(eof.error?.message, "EOF");
});

class TestEntity extends BaseEntity {
  constructor(id) {
    super();
    this.id = id;
  }
}

test("BaseEntity accepts zero keys and trims string primary keys", () => {
  const zeroId = new TestEntity(0);
  assert.equal(zeroId.getPrimaryKey(), "0");

  const stringId = new TestEntity("  record-1  ");
  assert.equal(stringId.getPrimaryKey(), "record-1");
  assert.equal(stringId.touch("user-a", 1234), stringId);
  assert.deepEqual(stringId.toJSON(), {
    id: "  record-1  ",
    dc_timestamp: 1234,
    dc_opuser: "user-a",
  });

  assert.throws(() => new TestEntity("   ").getPrimaryKey(), /cannot be empty/);
  assert.throws(() => new TestEntity(Number.NaN).getPrimaryKey(), /cannot be NaN/);
});
