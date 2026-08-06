export interface FileCacheClearTarget {
  paths: string[];
  decryptKey?: string;
}

export function buildDirectoryCachePath(
  rootCid: string,
  filePath: string,
): string {
  const normalizedPath = filePath.replace(/^\/+|\/+$/g, "");
  return normalizedPath ? `${rootCid}/${normalizedPath}` : rootCid;
}

export function resolveFileCacheClearTarget(
  pathname: string,
): FileCacheClearTarget {
  if (!pathname.startsWith("/dc/ipfs/")) {
    return { paths: [pathname] };
  }

  const pathParts = pathname.split("/");
  const resource = pathParts[3] ?? "";
  const separator = resource.indexOf("_");
  const ipfsPath = separator >= 0 ? resource.slice(0, separator) : resource;
  const decryptKey = separator >= 0 ? resource.slice(separator + 1) : "";
  if (!ipfsPath) return { paths: [], decryptKey };

  const paths = [ipfsPath];
  if (pathParts.length > 4) {
    const encodedSubPath = pathParts.slice(4).join("/");
    let subPath = encodedSubPath;
    try {
      subPath = decodeURIComponent(encodedSubPath);
    } catch {
      // The direct CID target is still useful when the subpath is malformed.
    }
    if (subPath) paths.push(buildDirectoryCachePath(ipfsPath, subPath));
  }

  return { paths, decryptKey };
}
