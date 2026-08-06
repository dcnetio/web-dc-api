export interface ByteRange {
  start: number;
  end: number;
}

/**
 * Parse one HTTP byte range and cap the returned chunk size.
 * Invalid, unsatisfiable and multi-range requests return null.
 */
export function parseRangeHeader(
  header: string,
  fileSize: number,
  maxChunkSize: number,
): ByteRange | null {
  if (
    !Number.isSafeInteger(fileSize) ||
    fileSize <= 0 ||
    !Number.isSafeInteger(maxChunkSize) ||
    maxChunkSize <= 0
  ) {
    return null;
  }

  const match = /^bytes=(\d*)-(\d*)$/i.exec(header.trim());
  if (!match || (!match[1] && !match[2])) return null;

  const startText = match[1] ?? "";
  const endText = match[2] ?? "";

  if (!startText) {
    const suffixLength = Number(endText);
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) return null;

    const length = Math.min(suffixLength, fileSize, maxChunkSize);
    return { start: fileSize - length, end: fileSize - 1 };
  }

  const start = Number(startText);
  if (!Number.isSafeInteger(start) || start < 0 || start >= fileSize) {
    return null;
  }

  // Keep the addition within Number.MAX_SAFE_INTEGER even for synthetic huge files.
  const maxEnd =
    start + Math.min(maxChunkSize - 1, fileSize - 1 - start);
  if (!endText) return { start, end: maxEnd };

  const requestedEnd = Number(endText);
  if (!Number.isSafeInteger(requestedEnd) || requestedEnd < start) return null;

  return { start, end: Math.min(requestedEnd, maxEnd) };
}
