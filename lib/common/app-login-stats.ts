export interface AppLoginStats {
  appId: string;
  loginTimes: string;
  rewardedStash: string | null;
  blockHeight: number;
}

export interface AppLoginStatsSnapshotLoader {
  (blockHeight: number): Promise<AppLoginStats>;
  loadCalendarBoundary?: (
    boundaryKey: string,
    estimatedBlockHeight: number,
  ) => Promise<AppLoginStats>;
}

export interface AppLoginDailyStatsOptions {
  endDate?: Date;
}

export type AppLoginStatsSnapshotFetcher = (
  appId: string,
  blockHeight: number,
) => Promise<AppLoginStats>;

export interface AppLoginStatsStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

interface AppLoginStatsCacheEntry {
  snapshot: AppLoginStats;
  cachedAt: number;
}

interface AppLoginStatsCacheData {
  version: 2;
  entries: Record<string, AppLoginStatsCacheEntry>;
  boundaries: Record<string, AppLoginStatsCacheEntry>;
}

const APP_LOGIN_STATS_CACHE_PREFIX = "dc_app_login_stats_v2";

export interface AppDailyLoginStats {
  startBlock: number;
  endBlock: number;
  loginTimes: string;
  discontinuous: boolean;
}

export interface SimulatedDayBoundaries {
  asOfBlock: number;
  todayStartBlock: number;
  blocksSinceMidnight: number;
  boundaries: number[];
}

export interface AppLoginPeriodStats {
  startBlock: number;
  endBlock: number;
  loginTimes: string;
  discontinuous: boolean;
}

export interface AppLoginMonthComparison {
  appId: string;
  asOfBlock: number;
  blocksPerDay: number;
  asOfLocalDate: string;
  currentMonthLabel: string;
  previousMonthLabel: string;
  comparableDays: number;
  currentMonthToDate: AppLoginPeriodStats;
  previousMonthToDate: AppLoginPeriodStats;
  previousFullMonth: AppLoginPeriodStats;
  recentMonths: AppLoginMonthPeriod[];
  calendarBasis: "simulated-local-calendar";
  boundaryAccuracy: "approximate";
}

export interface AppLoginMonthPeriod extends AppLoginPeriodStats {
  monthLabel: string;
  partial: boolean;
  incomplete: boolean;
}

export interface AppLoginMonthComparisonOptions {
  blocksPerDay?: number;
  now?: Date;
  currentStats?: AppLoginStats;
  loadSnapshot?: AppLoginStatsSnapshotLoader;
  endDate?: Date;
  historyMonths?: number;
}

export interface AppLoginYearPeriod extends AppLoginPeriodStats {
  yearLabel: string;
  partial: boolean;
  incomplete: boolean;
}

export interface AppLoginYearComparison {
  appId: string;
  asOfBlock: number;
  blocksPerDay: number;
  asOfLocalDate: string;
  currentYearLabel: string;
  previousYearLabel: string;
  comparableDays: number;
  currentYearToDate: AppLoginPeriodStats;
  previousYearToDate: AppLoginPeriodStats;
  previousFullYear: AppLoginPeriodStats;
  recentYears: AppLoginYearPeriod[];
  calendarBasis: "simulated-local-calendar";
  boundaryAccuracy: "approximate";
}

export interface AppLoginYearComparisonOptions {
  blocksPerDay?: number;
  now?: Date;
  currentStats?: AppLoginStats;
  loadSnapshot?: AppLoginStatsSnapshotLoader;
}

export interface SimulatedYearBoundaries {
  asOfBlock: number;
  todayStartBlock: number;
  currentYearStartBlock: number;
  previousYearStartBlock: number;
  previousComparableEndBlock: number;
  asOfLocalDate: string;
  currentYearLabel: string;
  previousYearLabel: string;
  comparableDays: number;
  recentYears: Array<{
    yearLabel: string;
    startBlock: number;
    endBlock: number;
    partial: boolean;
    incomplete: boolean;
  }>;
}

export interface SimulatedMonthBoundaries {
  asOfBlock: number;
  todayStartBlock: number;
  currentMonthStartBlock: number;
  previousMonthStartBlock: number;
  previousComparableEndBlock: number;
  asOfLocalDate: string;
  currentMonthLabel: string;
  previousMonthLabel: string;
  comparableDays: number;
  recentMonths: Array<{
    monthLabel: string;
    startBlock: number;
    endBlock: number;
    partial: boolean;
    incomplete: boolean;
  }>;
}

export function codecDecimal(value: unknown): string {
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value >= 0 ? String(value) : "0";
  }
  const text = typeof value === "string"
    ? value
    : value && typeof (value as any).toString === "function"
      ? (value as any).toString()
      : "0";
  const normalized = text.replace(/,/g, "");
  return /^\d+$/.test(normalized) ? normalized : "0";
}

export function createAppLoginStatsSnapshotLoader(
  appId: string,
  currentStats: AppLoginStats,
  fetchSnapshot: AppLoginStatsSnapshotFetcher,
  concurrency: number = 2,
): AppLoginStatsSnapshotLoader {
  if (currentStats.appId !== appId) {
    throw new Error("currentStats appId does not match the requested appId");
  }
  if (!Number.isSafeInteger(concurrency) || concurrency < 1) {
    throw new RangeError("concurrency must be a positive safe integer");
  }
  const snapshots = new Map<number, Promise<AppLoginStats>>([
    [currentStats.blockHeight, Promise.resolve(currentStats)],
  ]);
  const queue: Array<() => void> = [];
  let active = 0;

  const schedule = <T>(operation: () => Promise<T>): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      const run = () => {
        active += 1;
        operation().then(resolve, reject).finally(() => {
          active -= 1;
          queue.shift()?.();
        });
      };
      if (active < concurrency) run();
      else queue.push(run);
    });

  return (blockHeight: number) => {
    if (!Number.isSafeInteger(blockHeight) || blockHeight < 0) {
      return Promise.reject(new RangeError("blockHeight must be a non-negative safe integer"));
    }
    if (blockHeight > currentStats.blockHeight) {
      return Promise.reject(new RangeError("blockHeight cannot exceed the finalized head"));
    }
    const cached = snapshots.get(blockHeight);
    if (cached) return cached;

    const pending = schedule(() => fetchSnapshot(appId, blockHeight)).then((snapshot) => {
      if (snapshot.appId !== appId || snapshot.blockHeight !== blockHeight) {
        throw new Error("Historical app login snapshot does not match the request");
      }
      return snapshot;
    });
    snapshots.set(blockHeight, pending);
    return pending;
  };
}

function isValidCachedSnapshot(
  snapshot: unknown,
  appId: string,
  blockHeight: number,
): snapshot is AppLoginStats {
  const value = snapshot as AppLoginStats | null;
  return !!value
    && value.appId === appId
    && value.blockHeight === blockHeight
    && typeof value.loginTimes === "string"
    && /^\d+$/.test(value.loginTimes)
    && (value.rewardedStash === null || typeof value.rewardedStash === "string");
}

export function createPersistentAppLoginStatsSnapshotLoader(
  chainIdentity: string,
  appId: string,
  currentStats: AppLoginStats,
  fetchSnapshot: AppLoginStatsSnapshotFetcher,
  storage?: AppLoginStatsStorage,
  maxEntries: number = 128,
): AppLoginStatsSnapshotLoader {
  if (!chainIdentity) throw new Error("chainIdentity is required");
  if (!Number.isSafeInteger(maxEntries) || maxEntries < 1) {
    throw new RangeError("maxEntries must be a positive safe integer");
  }
  if (!storage) {
    return createAppLoginStatsSnapshotLoader(appId, currentStats, fetchSnapshot);
  }

  const cacheKey = `${APP_LOGIN_STATS_CACHE_PREFIX}:${encodeURIComponent(chainIdentity)}:${encodeURIComponent(appId)}`;
  let cache: AppLoginStatsCacheData = { version: 2, entries: {}, boundaries: {} };
  try {
    const raw = storage.getItem(cacheKey);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed?.version === 2
      && parsed.entries && typeof parsed.entries === "object"
      && parsed.boundaries && typeof parsed.boundaries === "object") {
      cache = parsed;
    }
  } catch (_) {
    cache = { version: 2, entries: {}, boundaries: {} };
  }

  const persist = () => {
    const entries = Object.entries(cache.entries)
      .sort((left, right) => right[1].cachedAt - left[1].cachedAt)
      .slice(0, maxEntries);
    const boundaries = Object.entries(cache.boundaries)
      .sort((left, right) => right[1].cachedAt - left[1].cachedAt)
      .slice(0, maxEntries);
    cache.entries = Object.fromEntries(entries);
    cache.boundaries = Object.fromEntries(boundaries);
    try {
      storage.setItem(cacheKey, JSON.stringify(cache));
    } catch (_) {
      // localStorage can be disabled or full; chain reads remain the fallback.
    }
  };

  const loader = createAppLoginStatsSnapshotLoader(
    appId,
    currentStats,
    async (targetAppId, blockHeight) => {
      const entry = cache.entries[String(blockHeight)];
      if (entry && isValidCachedSnapshot(entry.snapshot, targetAppId, blockHeight)) {
        entry.cachedAt = Date.now();
        persist();
        return entry.snapshot;
      }
      const snapshot = await fetchSnapshot(targetAppId, blockHeight);
      if (blockHeight < currentStats.blockHeight) {
        cache.entries[String(blockHeight)] = { snapshot, cachedAt: Date.now() };
        persist();
      }
      return snapshot;
    },
  );
  loader.loadCalendarBoundary = async (
    boundaryKey: string,
    estimatedBlockHeight: number,
  ) => {
    const entry = cache.boundaries[boundaryKey];
    if (entry && entry.snapshot.appId === appId && /^\d+$/.test(entry.snapshot.loginTimes)) {
      entry.cachedAt = Date.now();
      persist();
      return entry.snapshot;
    }
    const snapshot = await loader(estimatedBlockHeight);
    cache.boundaries[boundaryKey] = { snapshot, cachedAt: Date.now() };
    persist();
    return snapshot;
  };
  return loader;
}

function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex length");
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    const value = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
    if (Number.isNaN(value)) throw new Error("Invalid hex value");
    bytes[index] = value;
  }
  return bytes;
}

function decodeAppId(value: unknown): string {
  const text = String(value || "");
  if (!text.startsWith("0x")) return text;
  try {
    return new TextDecoder().decode(hexToBytes(text.slice(2)));
  } catch (_) {
    return text;
  }
}

export function findAppLoginInfo(value: any, appId: string): any | undefined {
  const json = typeof value?.toJSON === "function" ? value.toJSON() : value;
  const entries: Array<[unknown, any]> = Array.isArray(json)
    ? json
    : Object.entries(json || {});
  return entries.find(([key]) => decodeAppId(key) === appId)?.[1];
}

export function calculateAppLoginIntervals(
  snapshots: AppLoginStats[],
): AppDailyLoginStats[] {
  return snapshots.slice(1).map((snapshot, index) => {
    const previous = snapshots[index];
    const currentCount = BigInt(snapshot.loginTimes);
    const previousCount = BigInt(previous.loginTimes);
    const discontinuous = currentCount < previousCount;
    return {
      startBlock: previous.blockHeight,
      endBlock: snapshot.blockHeight,
      loginTimes: discontinuous ? "0" : (currentCount - previousCount).toString(),
      discontinuous,
    };
  });
}

function localDatePart(value: number): string {
  return String(value).padStart(2, "0");
}

export function localCalendarBoundaryKey(date: Date): string {
  if (Number.isNaN(date.getTime())) throw new RangeError("date must be valid");
  let timeZone = "local";
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || timeZone;
  } catch (_) {
    // Keep the local fallback in runtimes without Intl time-zone support.
  }
  return `${timeZone}:${date.getFullYear()}-${localDatePart(date.getMonth() + 1)}-${localDatePart(date.getDate())}`;
}

export function loadAppLoginCalendarBoundary(
  loader: AppLoginStatsSnapshotLoader,
  date: Date,
  estimatedBlockHeight: number,
): Promise<AppLoginStats> {
  return loader.loadCalendarBoundary
    ? loader.loadCalendarBoundary(localCalendarBoundaryKey(date), estimatedBlockHeight)
    : loader(estimatedBlockHeight);
}

function validateBoundaryInput(
  asOfBlock: number,
  blocksPerDay: number,
  now: Date,
): void {
  if (!Number.isSafeInteger(asOfBlock) || asOfBlock < 0) {
    throw new RangeError("asOfBlock must be a non-negative safe integer");
  }
  if (!Number.isSafeInteger(blocksPerDay) || blocksPerDay < 1) {
    throw new RangeError("blocksPerDay must be a positive safe integer");
  }
  if (Number.isNaN(now.getTime())) throw new RangeError("now must be a valid date");
}

export function buildSimulatedDayBoundaries(
  asOfBlock: number,
  blocksPerDay: number,
  days: number,
  now: Date = new Date(),
): SimulatedDayBoundaries {
  validateBoundaryInput(asOfBlock, blocksPerDay, now);
  if (!Number.isSafeInteger(days) || days < 1 || days > 31) {
    throw new RangeError("days must be an integer between 1 and 31");
  }
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const elapsedMilliseconds = now.getTime() - midnight.getTime();
  const blocksSinceMidnight = Math.floor(
    (elapsedMilliseconds * blocksPerDay) / 86400000,
  );
  const todayStartBlock = Math.max(0, asOfBlock - blocksSinceMidnight);
  const boundaries = Array.from({ length: days }, (_, index) =>
    Math.max(0, todayStartBlock - (days - 1 - index) * blocksPerDay)
  );
  boundaries.push(asOfBlock);

  return {
    asOfBlock,
    todayStartBlock,
    blocksSinceMidnight,
    boundaries,
  };
}

export function buildSimulatedMonthBoundaries(
  asOfBlock: number,
  blocksPerDay: number,
  now: Date = new Date(),
  historyMonths: number = 6,
): SimulatedMonthBoundaries {
  validateBoundaryInput(asOfBlock, blocksPerDay, now);
  if (!Number.isSafeInteger(historyMonths) || historyMonths < 2 || historyMonths > 12) {
    throw new RangeError("historyMonths must be an integer between 2 and 12");
  }
  const currentDay = now.getDate();
  const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  const comparableDays = Math.min(currentDay, previousMonthDays);
  const dayBoundaries = buildSimulatedDayBoundaries(asOfBlock, blocksPerDay, 1, now);
  const currentMonthStartBlock = Math.max(
    0,
    dayBoundaries.todayStartBlock - (currentDay - 1) * blocksPerDay,
  );
  const previousMonthStartBlock = Math.max(
    0,
    currentMonthStartBlock - previousMonthDays * blocksPerDay,
  );
  const previousComparableEndBlock = Math.min(
    currentMonthStartBlock,
    previousMonthStartBlock + (comparableDays - 1) * blocksPerDay,
  );
  const recentMonths = [{
    monthLabel: `${now.getFullYear()}-${localDatePart(now.getMonth() + 1)}`,
    startBlock: currentMonthStartBlock,
    endBlock: asOfBlock,
    partial: true,
    incomplete: currentMonthStartBlock === 0,
  }];
  let nextMonthStartBlock = currentMonthStartBlock;
  for (let offset = 1; offset < historyMonths; offset += 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const daysInMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      0,
    ).getDate();
    const monthStartBlock = Math.max(
      0,
      nextMonthStartBlock - daysInMonth * blocksPerDay,
    );
    recentMonths.push({
      monthLabel: `${monthDate.getFullYear()}-${localDatePart(monthDate.getMonth() + 1)}`,
      startBlock: monthStartBlock,
      endBlock: nextMonthStartBlock,
      partial: false,
      incomplete: monthStartBlock === 0,
    });
    nextMonthStartBlock = monthStartBlock;
  }

  return {
    asOfBlock,
    todayStartBlock: dayBoundaries.todayStartBlock,
    currentMonthStartBlock,
    previousMonthStartBlock,
    previousComparableEndBlock,
    asOfLocalDate: `${now.getFullYear()}-${localDatePart(now.getMonth() + 1)}-${localDatePart(currentDay)}`,
    currentMonthLabel: `${now.getFullYear()}-${localDatePart(now.getMonth() + 1)}`,
    previousMonthLabel: `${previousMonthDate.getFullYear()}-${localDatePart(previousMonthDate.getMonth() + 1)}`,
    comparableDays,
    recentMonths: recentMonths.reverse(),
  };
}

export function calculateAppLoginPeriod(
  start: AppLoginStats,
  end: AppLoginStats,
): AppLoginPeriodStats {
  const startCount = BigInt(start.loginTimes);
  const endCount = BigInt(end.loginTimes);
  const discontinuous = endCount < startCount;
  return {
    startBlock: start.blockHeight,
    endBlock: end.blockHeight,
    loginTimes: discontinuous ? "0" : (endCount - startCount).toString(),
    discontinuous,
  };
}

function dayOfYear(date: Date): number {
  const yearStart = Date.UTC(date.getFullYear(), 0, 1);
  const currentDay = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((currentDay - yearStart) / 86400000) + 1;
}

function daysInYear(year: number): number {
  return new Date(year, 1, 29).getMonth() === 1 ? 366 : 365;
}

export function buildSimulatedYearBoundaries(
  asOfBlock: number,
  blocksPerDay: number,
  now: Date = new Date(),
  historyYears: number = 5,
): SimulatedYearBoundaries {
  validateBoundaryInput(asOfBlock, blocksPerDay, now);
  if (!Number.isSafeInteger(historyYears) || historyYears < 2 || historyYears > 10) {
    throw new RangeError("historyYears must be an integer between 2 and 10");
  }
  const currentYear = now.getFullYear();
  const previousYear = currentYear - 1;
  const elapsedDays = dayOfYear(now);
  const previousYearDays = daysInYear(previousYear);
  const previousComparableDate = new Date(
    previousYear,
    now.getMonth(),
    Math.min(
      now.getDate(),
      new Date(previousYear, now.getMonth() + 1, 0).getDate(),
    ),
  );
  const comparableDays = dayOfYear(previousComparableDate);
  const dayBoundaries = buildSimulatedDayBoundaries(asOfBlock, blocksPerDay, 1, now);
  const currentYearStartBlock = Math.max(
    0,
    dayBoundaries.todayStartBlock - (elapsedDays - 1) * blocksPerDay,
  );
  const previousYearStartBlock = Math.max(
    0,
    currentYearStartBlock - previousYearDays * blocksPerDay,
  );
  const previousComparableEndBlock = Math.min(
    currentYearStartBlock,
    previousYearStartBlock + (comparableDays - 1) * blocksPerDay,
  );
  const recentYears = [{
    yearLabel: String(currentYear),
    startBlock: currentYearStartBlock,
    endBlock: asOfBlock,
    partial: true,
    incomplete: currentYearStartBlock === 0,
  }];
  let nextYearStartBlock = currentYearStartBlock;
  for (let offset = 1; offset < historyYears; offset += 1) {
    const year = currentYear - offset;
    const yearStartBlock = Math.max(
      0,
      nextYearStartBlock - daysInYear(year) * blocksPerDay,
    );
    recentYears.push({
      yearLabel: String(year),
      startBlock: yearStartBlock,
      endBlock: nextYearStartBlock,
      partial: false,
      incomplete: yearStartBlock === 0,
    });
    nextYearStartBlock = yearStartBlock;
  }

  return {
    asOfBlock,
    todayStartBlock: dayBoundaries.todayStartBlock,
    currentYearStartBlock,
    previousYearStartBlock,
    previousComparableEndBlock,
    asOfLocalDate: `${currentYear}-${localDatePart(now.getMonth() + 1)}-${localDatePart(now.getDate())}`,
    currentYearLabel: String(currentYear),
    previousYearLabel: String(previousYear),
    comparableDays,
    recentYears: recentYears.reverse(),
  };
}