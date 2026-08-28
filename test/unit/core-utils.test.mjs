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
import { isExpectedThreadDBAbsence } from "../../lib/implements/threaddb/db-absence.ts";
import { subscribeRoomTopicWithRetry } from "../../lib/implements/rtc/rtm-topic-subscription.ts";
import {
  encodeRuntimeBytes,
  generateVirtualAccountRaw,
  hashEthExtrinsicPayload,
} from "../../lib/common/virtual-account.ts";
import { keccak_256 } from "@noble/hashes/sha3.js";
import {
  buildSimulatedDayBoundaries,
  buildSimulatedMonthBoundaries,
  buildSimulatedYearBoundaries,
  calculateAppLoginPeriod,
  calculateAppLoginIntervals,
  codecDecimal,
  createAppLoginStatsSnapshotLoader,
  createPersistentAppLoginStatsSnapshotLoader,
  findAppLoginInfo,
} from "../../lib/common/app-login-stats.ts";

test("virtual accounts use the dcsdk-compatible raw key format", () => {
  const first = generateVirtualAccountRaw();
  const second = generateVirtualAccountRaw();

  assert.equal(first.length, 32);
  assert.equal(new TextDecoder().decode(first.subarray(0, 5)), "$vir$");
  assert.notDeepEqual(first, second);
});

test("virtual account runtime Bytes use UTF-8 hex encoding", () => {
  assert.equal(encodeRuntimeBytes("asset-测试"), "0x61737365742de6b58be8af95");
});

test("Ethereum extrinsic payloads are directly Keccak hashed at any length", () => {
  const payload = Uint8Array.from({ length: 300 }, (_, index) => index & 0xff);
  assert.deepEqual(hashEthExtrinsicPayload(payload), keccak_256(payload));
});

test("ThreadDB absence classifier only matches expected recovery probes", () => {
  assert.equal(isExpectedThreadDBAbsence(new Error("db not found")), true);
  assert.equal(isExpectedThreadDBAbsence(new Error("thread not found")), true);
  assert.equal(isExpectedThreadDBAbsence(new Error("DB NOT FOUND")), true);
  assert.equal(
    isExpectedThreadDBAbsence(new Error("failed to restore: thread not found")),
    false,
  );
  assert.equal(isExpectedThreadDBAbsence(new Error("decrypt failed")), false);
  assert.equal(isExpectedThreadDBAbsence(new Error("connect to obj nodes failed")), false);
});

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

test("RTC room topic subscription retries transient failures", async () => {
  const calls = [];
  const delays = [];
  const client = {
    async subscribe(options) {
      calls.push(options);
      if (calls.length < 3) throw new Error("temporary topic failure");
    },
  };

  await subscribeRoomTopicWithRetry(client, "room-1", {
    attempts: 3,
    retryDelayMs: 25,
    delay: async (delayMs) => delays.push(delayMs),
  });

  assert.deepEqual(calls, [
    { topic: "room-1" },
    { topic: "room-1" },
    { topic: "room-1" },
  ]);
  assert.deepEqual(delays, [25, 25]);
});

test("RTC room topic subscription rejects after its bounded retry budget", async () => {
  let attempts = 0;
  await assert.rejects(
    subscribeRoomTopicWithRetry(
      {
        async subscribe() {
          attempts += 1;
          throw new Error("room topic unavailable");
        },
      },
      "room-2",
      { attempts: 2, retryDelayMs: 0 },
    ),
    /room topic unavailable/,
  );
  assert.equal(attempts, 2);
  await assert.rejects(
    subscribeRoomTopicWithRetry({ subscribe: async () => {} }, "  "),
    /topic is empty/,
  );
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

function appLoginCodec(loginTimes) {
  const appIdHex = `0x${Buffer.from("sample-app", "utf8").toString("hex")}`;
  return {
    toJSON: () => ({
      [appIdHex]: {
        rewardedStash: "5RewardAccount",
        loginTimes: String(loginTimes),
      },
    }),
  };
}

test("app login helpers read encoded app ids and preserve u64 counters", () => {
  const info = findAppLoginInfo(appLoginCodec("18446744073709551615"), "sample-app");
  assert.equal(info.rewardedStash, "5RewardAccount");
  assert.equal(codecDecimal(info.loginTimes), "18446744073709551615");
  assert.equal(codecDecimal("1,234"), "1234");
  assert.equal(codecDecimal(Number.MAX_SAFE_INTEGER + 1), "0");
});

test("app login helpers calculate interval increments", () => {
  const snapshots = [
    { appId: "sample-app", loginTimes: "3", rewardedStash: null, blockHeight: 14400 },
    { appId: "sample-app", loginTimes: "8", rewardedStash: null, blockHeight: 28800 },
    { appId: "sample-app", loginTimes: "10", rewardedStash: null, blockHeight: 43200 },
  ];
  assert.deepEqual(calculateAppLoginIntervals(snapshots), [
    { startBlock: 14400, endBlock: 28800, loginTimes: "5", discontinuous: false },
    { startBlock: 28800, endBlock: 43200, loginTimes: "2", discontinuous: false },
  ]);
});

test("app login helpers expose counter resets", () => {
  assert.deepEqual(calculateAppLoginIntervals([
    { appId: "sample-app", loginTimes: "18446744073709551615", rewardedStash: null, blockHeight: 14400 },
    { appId: "sample-app", loginTimes: "2", rewardedStash: null, blockHeight: 28800 },
  ]), [
    {
      startBlock: 14400,
      endBlock: 28800,
      loginTimes: "0",
      discontinuous: true,
    },
  ]);
});

test("simulated day boundaries anchor to local midnight", () => {
  const boundaries = buildSimulatedDayBoundaries(
    1_000_000,
    14400,
    7,
    new Date(2026, 7, 23, 12, 0, 0),
  );
  assert.equal(boundaries.blocksSinceMidnight, 7200);
  assert.equal(boundaries.todayStartBlock, 992800);
  assert.deepEqual(boundaries.boundaries, [
    906400,
    920800,
    935200,
    949600,
    964000,
    978400,
    992800,
    1_000_000,
  ]);
});

test("simulated day boundaries preserve Today at exact midnight", () => {
  const boundaries = buildSimulatedDayBoundaries(
    1_000_000,
    14400,
    7,
    new Date(2026, 7, 23, 0, 0, 0),
  );
  assert.equal(boundaries.boundaries.length, 8);
  assert.equal(boundaries.boundaries.at(-2), 1_000_000);
  assert.equal(boundaries.boundaries.at(-1), 1_000_000);
});

test("simulated month boundaries handle month length and leap years", () => {
  const march = buildSimulatedMonthBoundaries(
    2_000_000,
    14400,
    new Date(2028, 2, 31, 12),
  );
  assert.equal(march.currentMonthLabel, "2028-03");
  assert.equal(march.previousMonthLabel, "2028-02");
  assert.equal(march.comparableDays, 29);
  assert.equal(march.todayStartBlock, 1_992_800);
  assert.equal(march.currentMonthStartBlock, 1_560_800);
  assert.equal(march.previousMonthStartBlock, 1_143_200);
  assert.equal(march.previousComparableEndBlock, 1_546_400);
  assert.deepEqual(march.recentMonths.map((month) => month.monthLabel), [
    "2027-10",
    "2027-11",
    "2027-12",
    "2028-01",
    "2028-02",
    "2028-03",
  ]);
  assert.equal(march.recentMonths.at(-1).partial, true);
  assert.equal(march.recentMonths.at(-2).partial, false);
  assert.equal(march.recentMonths.at(-2).incomplete, false);

  const nearGenesis = buildSimulatedMonthBoundaries(
    1000,
    14400,
    new Date(2026, 0, 1, 12),
  );
  assert.equal(nearGenesis.currentMonthStartBlock, 0);
  assert.equal(nearGenesis.previousMonthStartBlock, 0);
  assert.equal(nearGenesis.previousComparableEndBlock, 0);
  assert.equal(nearGenesis.recentMonths[0].incomplete, true);
});

test("monthly period calculations preserve bigint values and resets", () => {
  const start = {
    appId: "sample-app",
    loginTimes: "9007199254740993",
    rewardedStash: null,
    blockHeight: 100,
  };
  assert.deepEqual(calculateAppLoginPeriod(start, {
    ...start,
    loginTimes: "9007199254741003",
    blockHeight: 200,
  }), {
    startBlock: 100,
    endBlock: 200,
    loginTimes: "10",
    discontinuous: false,
  });
  assert.equal(calculateAppLoginPeriod(start, {
    ...start,
    loginTimes: "1",
    blockHeight: 200,
  }).discontinuous, true);
});

test("simulated month boundaries reject invalid numeric inputs", () => {
  assert.throws(() => buildSimulatedMonthBoundaries(100, Number.NaN), RangeError);
  assert.throws(() => buildSimulatedMonthBoundaries(100, 0), RangeError);
  assert.throws(() => buildSimulatedMonthBoundaries(1.5, 14400), RangeError);
  assert.throws(() => buildSimulatedMonthBoundaries(100, 14400, new Date("invalid")), RangeError);
  assert.throws(() => buildSimulatedMonthBoundaries(100, 14400, new Date(), 1), RangeError);
});

test("simulated year boundaries handle leap years and five-year trends", () => {
  const boundaries = buildSimulatedYearBoundaries(
    40_000_000,
    14400,
    new Date(2028, 2, 1, 12),
  );
  assert.equal(boundaries.currentYearLabel, "2028");
  assert.equal(boundaries.previousYearLabel, "2027");
  assert.equal(boundaries.comparableDays, 60);
  assert.deepEqual(boundaries.recentYears.map((year) => year.yearLabel), [
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
  ]);
  assert.equal(boundaries.recentYears.at(-1).partial, true);
  assert.equal(boundaries.recentYears.at(-2).partial, false);
  assert.equal(boundaries.recentYears.at(-2).incomplete, false);
  assert.equal(
    boundaries.currentYearStartBlock,
    40_000_000 - 60 * 14400 - 7200,
  );
  assert.equal(
    boundaries.previousYearStartBlock,
    boundaries.currentYearStartBlock - 365 * 14400,
  );

  const nearGenesis = buildSimulatedYearBoundaries(
    1000,
    14400,
    new Date(2026, 0, 1, 12),
  );
  assert.equal(nearGenesis.currentYearStartBlock, 0);
  assert.equal(nearGenesis.previousYearStartBlock, 0);
  assert.equal(nearGenesis.previousComparableEndBlock, 0);
  assert.equal(nearGenesis.recentYears[0].incomplete, true);
});

test("year comparison uses the same calendar date across leap years", () => {
  const march = buildSimulatedYearBoundaries(
    40_000_000,
    14400,
    new Date(2028, 2, 1, 12),
  );
  assert.equal(march.comparableDays, 60);
  assert.equal(
    march.previousComparableEndBlock,
    march.previousYearStartBlock + 59 * 14400,
  );

  const leapDay = buildSimulatedYearBoundaries(
    40_000_000,
    14400,
    new Date(2028, 1, 29, 12),
  );
  assert.equal(leapDay.comparableDays, 59);
});

test("simulated year boundaries reject invalid inputs", () => {
  assert.throws(() => buildSimulatedYearBoundaries(-1, 14400), RangeError);
  assert.throws(() => buildSimulatedYearBoundaries(100, 0), RangeError);
  assert.throws(() => buildSimulatedYearBoundaries(100, 14400, new Date("invalid")), RangeError);
  assert.throws(() => buildSimulatedYearBoundaries(100, 14400, new Date(), 1), RangeError);
});

test("simulated day boundaries reject invalid inputs", () => {
  assert.throws(() => buildSimulatedDayBoundaries(100, 14400, 0), RangeError);
  assert.throws(() => buildSimulatedDayBoundaries(100, 14400, 32), RangeError);
  assert.throws(() => buildSimulatedDayBoundaries(100, 14400, 7, new Date("invalid")), RangeError);
});

test("snapshot loader deduplicates concurrent historical reads", async () => {
  const current = {
    appId: "sample-app",
    loginTimes: "10",
    rewardedStash: null,
    blockHeight: 1000,
  };
  let fetchCount = 0;
  const loader = createAppLoginStatsSnapshotLoader(
    "sample-app",
    current,
    async (appId, blockHeight) => {
      fetchCount += 1;
      return { ...current, appId, blockHeight, loginTimes: String(blockHeight) };
    },
  );

  assert.equal(await loader(1000), current);
  const snapshots = await Promise.all([loader(900), loader(900), loader(800), loader(800)]);
  assert.equal(fetchCount, 2);
  assert.equal(snapshots[0], snapshots[1]);
  assert.equal(snapshots[2], snapshots[3]);
});

test("snapshot loader validates request and response identity", async () => {
  const current = {
    appId: "sample-app",
    loginTimes: "10",
    rewardedStash: null,
    blockHeight: 1000,
  };
  assert.throws(
    () => createAppLoginStatsSnapshotLoader("other-app", current, async () => current),
    /appId/,
  );
  const loader = createAppLoginStatsSnapshotLoader(
    "sample-app",
    current,
    async () => ({ ...current, appId: "wrong-app", blockHeight: 900 }),
  );
  await assert.rejects(loader(-1), RangeError);
  await assert.rejects(loader(1001), RangeError);
  await assert.rejects(loader(900), /does not match/);
});

test("snapshot loader limits distinct historical reads globally", async () => {
  const current = {
    appId: "sample-app",
    loginTimes: "10",
    rewardedStash: null,
    blockHeight: 1000,
  };
  let active = 0;
  let maxActive = 0;
  const resolvers = [];
  const loader = createAppLoginStatsSnapshotLoader(
    "sample-app",
    current,
    (appId, blockHeight) => new Promise((resolve) => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      resolvers.push(() => {
        active -= 1;
        resolve({ ...current, appId, blockHeight });
      });
    }),
    2,
  );
  const pending = Promise.all([loader(900), loader(800), loader(700), loader(600)]);
  assert.equal(active, 2);
  while (resolvers.length > 0) {
    resolvers.shift()();
    await new Promise((resolve) => setImmediate(resolve));
  }
  await pending;
  assert.equal(maxActive, 2);
});

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    values,
  };
}

test("persistent snapshot loader reuses completed historical heights", async () => {
  const storage = memoryStorage();
  const current = {
    appId: "sample-app",
    loginTimes: "100",
    rewardedStash: null,
    blockHeight: 1000,
  };
  let fetchCount = 0;
  const fetcher = async (appId, blockHeight) => {
    fetchCount += 1;
    return { ...current, appId, blockHeight, loginTimes: String(blockHeight) };
  };
  const first = createPersistentAppLoginStatsSnapshotLoader(
    "chain-a",
    "sample-app",
    current,
    fetcher,
    storage,
  );
  assert.equal((await first(900)).loginTimes, "900");
  assert.equal(fetchCount, 1);

  const second = createPersistentAppLoginStatsSnapshotLoader(
    "chain-a",
    "sample-app",
    current,
    fetcher,
    storage,
  );
  assert.equal((await second(900)).loginTimes, "900");
  assert.equal(fetchCount, 1);
  assert.equal(await second(1000), current);
});

test("persistent snapshot cache isolates chains and apps", async () => {
  const storage = memoryStorage();
  const current = {
    appId: "app-a",
    loginTimes: "100",
    rewardedStash: null,
    blockHeight: 1000,
  };
  let fetchCount = 0;
  const fetcher = async (appId, blockHeight) => {
    fetchCount += 1;
    return { ...current, appId, blockHeight };
  };
  await createPersistentAppLoginStatsSnapshotLoader(
    "chain-a", "app-a", current, fetcher, storage,
  )(900);
  await createPersistentAppLoginStatsSnapshotLoader(
    "chain-b", "app-a", current, fetcher, storage,
  )(900);
  await createPersistentAppLoginStatsSnapshotLoader(
    "chain-a", "app-b", { ...current, appId: "app-b" }, fetcher, storage,
  )(900);
  assert.equal(fetchCount, 3);
});

test("persistent snapshot cache recovers from corruption and stays bounded", async () => {
  const storage = memoryStorage({
    "dc_app_login_stats_v1:chain-a:sample-app": "{invalid",
  });
  const current = {
    appId: "sample-app",
    loginTimes: "100",
    rewardedStash: null,
    blockHeight: 1000,
  };
  let fetchCount = 0;
  const loader = createPersistentAppLoginStatsSnapshotLoader(
    "chain-a",
    "sample-app",
    current,
    async (appId, blockHeight) => {
      fetchCount += 1;
      return { ...current, appId, blockHeight };
    },
    storage,
    2,
  );
  await loader(900);
  await loader(800);
  await loader(700);
  assert.equal(fetchCount, 3);
  const persistedRaw = Array.from(storage.values.values()).find((value) =>
    value.includes('"version":2')
  );
  const persisted = JSON.parse(persistedRaw);
  assert.equal(Object.keys(persisted.entries).length, 2);
});

test("calendar boundary cache survives estimated midnight height drift", async () => {
  const storage = memoryStorage();
  const current = {
    appId: "sample-app",
    loginTimes: "100",
    rewardedStash: null,
    blockHeight: 1000,
  };
  let fetchCount = 0;
  const fetcher = async (appId, blockHeight) => {
    fetchCount += 1;
    return { ...current, appId, blockHeight, loginTimes: String(blockHeight) };
  };
  const first = createPersistentAppLoginStatsSnapshotLoader(
    "chain-a", "sample-app", current, fetcher, storage,
  );
  const firstSnapshot = await first.loadCalendarBoundary("Asia/Shanghai:2026-08-23", 900);
  assert.equal(firstSnapshot.blockHeight, 900);

  const second = createPersistentAppLoginStatsSnapshotLoader(
    "chain-a", "sample-app", current, fetcher, storage,
  );
  const cachedSnapshot = await second.loadCalendarBoundary("Asia/Shanghai:2026-08-23", 897);
  assert.equal(cachedSnapshot.blockHeight, 900);
  assert.equal(fetchCount, 1);
});
