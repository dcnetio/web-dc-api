// Standalone copy of getBlocksCountFromStats from manager.ts for isolated testing
function getBlocksCountFromStats(stats: any): number {
  try {
    const maybeBlocks = (stats as any).blocks;
    if (maybeBlocks && Number(maybeBlocks) > 0) {
      return Number(maybeBlocks);
    }

    // Try unixfs.fileSize() if available
    let bytes = 0;
    if (stats && stats.unixfs && typeof stats.unixfs.fileSize === 'function') {
      try {
        bytes = Number(stats.unixfs.fileSize());
      } catch (e) {
        bytes = 0;
      }
    }

    // fallback size fields
    if (!bytes && (stats as any).size) {
      bytes = Number((stats as any).size || 0);
    }
    if (!bytes && (stats as any).localDagSize) {
      bytes = Number((stats as any).localDagSize || 0);
    }

    if (bytes > 0) {
      const blockBytes = 256 * 1024; // conservative shard threshold used elsewhere
      return Math.max(1, Math.ceil(bytes / blockBytes));
    }

    return 0;
  } catch (err) {
    console.warn('getBlocksCountFromStats fallback error:', err);
    return 0;
  }
}

const cases: Array<[string, any]> = [
  ['has blocks', { blocks: 5 }],
  ['unixfs.fileSize 1MB', { unixfs: { fileSize: () => 1024 * 1024 } }],
  ['size field 100 bytes', { size: 100 }],
  ['localDagSize 600KB', { localDagSize: 600 * 1024 }],
  ['empty stats', {}],
];

for (const [name, stats] of cases) {
  try {
    const v = getBlocksCountFromStats(stats);
    console.log(`${name}:`, v);
  } catch (e) {
    console.error(`${name} error:`, e);
  }
}
