/**
 * DCAPI Service Worker
 * ====================
 *
 * 此 Service Worker 拦截以 `/dc/ipfs/` 开头的资源请求，并将其转发至主线程处理。
 * 通过 MessageChannel 实现与主线程的通信，支持视频跳转等高级功能。
 *
 * 请求格式：
 *   /dc/ipfs/<ipfs-hash>[_<key>]/<filename>.<ext>
 *
 * 示例：
 *   /dc/ipfs/bafkreihd3v4x5z6g7h7_222/video.mp4
 *   /dc/ipfs/QmaSfSQ5pQFGZeLu7D1Q3YcMRDoJ3QT5B6Boq4J7Bz9AUC/document.pdf
 *
 * 特性：
 * - 支持所有常见文件类型的 MIME 类型自动识别
 * - 支持 HTTP Range 请求，实现视频跳转和断点续传
 * - 为视频/音频提供流式传输支持
 * - 自动处理跨线程通信和响应构建
 * - 仅缓存未加密、小于等于 5 MiB 的完整响应
 */
const IPFS_PATH_PREFIX = '/dc/ipfs/';
const MAX_CACHE_BYTES = 5 << 20;
const RESPONSE_TIMEOUT_MS = 60_000;

let id = 0;

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (
    event.request.method === 'GET' &&
    url.origin === self.location.origin &&
    url.pathname.startsWith(IPFS_PATH_PREFIX)
  ) {
    event.respondWith(ipfsProxy(event));
  }
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

async function ipfsProxy(fetchEvent) {
  const msgId = ++id;
  const request = fetchEvent.request;
  const range = request.headers.get('Range');

  console.log('***********IPFS Proxy:', msgId, request.url, range);
  const pathname = new URL(request.url).pathname;
  const encryptedRequest = hasDecryptKey(pathname);

  // 只缓存无 Range 且不含解密密钥的完整响应，避免把解密后的内容持久化到 IndexedDB。
  if (!range && !encryptedRequest) {
    try {
      const cached = await idbGet(pathname);
      if (cached && cached.blob) {
        const hdrs = new Headers(cached.headers || {});
        if (!hdrs.has('Content-Type')) {
          // 回退 MIME
          const ext = pathname.split('.').pop().toLowerCase();
          const mimeType = MimeTypes['.' + ext] || MimeTypes[ext] || 'application/octet-stream';
          hdrs.set('Content-Type', mimeType);
        }
        hdrs.set('Access-Control-Allow-Origin', '*');
        hdrs.set('Accept-Ranges', 'bytes');
        hdrs.set('X-Cache', 'IPFS-IndexedDB');
        return new Response(cached.blob, { status: 200, headers: hdrs });
      }
    } catch (e) {
      console.error('IndexedDB cache read failed:', e);
    }
  }

  // 状态控制
  let responseFlag = false;   // 任意反馈即置为 true
  let settled = false;        // Response 是否已返回
  let resendTimer = null;     // 重发计时器
  let responseTimer = null;   // 最终响应超时计时器

  // 先获取客户端
  let client = null;
  if (fetchEvent.clientId) {
    try { client = await self.clients.get(fetchEvent.clientId); } catch (e) {
      console.error('Failed to get client:', e);
    }
  }
  if (!client) {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    client = windows.find(c => c.visibilityState === 'visible') || windows[0];
  }
  if (!client) {
    return textResponse('No active client to handle ipfs-fetch', 503);
  }
  console.log('Found client for IPFS fetch:', client.id);

  // 建立一个可解析的 Promise
  let resolveResp;
  const responsePromise = new Promise((resolve) => {
    resolveResp = resolve;
  });

  // 发送一次请求：每次都新建 MessageChannel 并携带 port2，避免首次丢失
  const sendOnce = () => {
    try {
      const channel = new MessageChannel();
      channel.port1.onmessage = (msgEvent) => {
        if (settled) return;
        const { type, success, data, error, status, headers = {} } = msgEvent.data || {};

        // 页面已反馈（ack 或数据），停止重发
        responseFlag = true;
        if (resendTimer) {
          clearInterval(resendTimer);
          resendTimer = null;
        }

        // ack / 中间态：继续等待最终数据
        if (type === 'ipfs-ack' || status === 999) {
          return;
        }

        if (success) {
          // 构建响应头
          const ext = pathname.split('.').pop().toLowerCase();
          const mimeType = MimeTypes['.' + ext] || MimeTypes[ext] || 'application/octet-stream';
          headers['Content-Type'] = headers['Content-Type'] || mimeType;
          headers['Access-Control-Allow-Origin'] = '*';
          headers['Content-Disposition'] = `inline; filename="${pathname.split('/').pop()}"`;
          headers['Accept-Ranges'] = 'bytes';
          removeNullishHeaders(headers);

          let responseStatus = status || 200;
          if (range && responseStatus === 200) responseStatus = 206;

          // 仅缓存不含解密密钥、大小不超过 5 MiB 的完整响应。
          if (!range && !encryptedRequest && responseStatus === 200 && data && data.byteLength <= MAX_CACHE_BYTES) {
            const blob = new Blob([new Uint8Array(data)], { type: headers['Content-Type'] });
            idbPut(pathname, blob, headers).catch(e => {
              console.error('IndexedDB cache write failed:', e);
            });
          }

          settled = true;
          if (responseTimer) clearTimeout(responseTimer);
          resolveResp(new Response(data ? new Uint8Array(data) : null, {
            status: responseStatus,
            headers: new Headers(headers)
          }));
        } else {
          settled = true;
          if (responseTimer) clearTimeout(responseTimer);
          const errorStatus = Number.isInteger(status) && status >= 400 && status <= 599
            ? status
            : 502;
          resolveResp(textResponse(error || 'IPFS fetch failed', errorStatus, headers));
        }
      };

      // 携带新的 port2 发送
      client.postMessage(
        { type: 'ipfs-fetch', id: msgId, pathname, range },
        [channel.port2]
      );
    } catch (e) {
      console.error('postMessage failed:', e);
    }
  };

  // 首次发送
  sendOnce();

  // 每秒检查一次，如无反馈则重新创建新通道并重发，直到页面反馈
  resendTimer = setInterval(() => {
    if (responseFlag || settled) {
      clearInterval(resendTimer);
      resendTimer = null;
      return;
    }
    sendOnce();
  }, 1000);

  responseTimer = setTimeout(() => {
    if (settled) return;
    settled = true;
    if (resendTimer) clearInterval(resendTimer);
    resolveResp(textResponse('IPFS fetch timed out', 504));
  }, RESPONSE_TIMEOUT_MS);

  return responsePromise;
}

function textResponse(message, status, headers = {}) {
  const responseHeaders = new Headers(headers);
  if (!responseHeaders.has('Content-Type')) {
    responseHeaders.set('Content-Type', 'text/plain; charset=utf-8');
  }
  return new Response(String(message), {
    status,
    headers: responseHeaders
  });
}

function removeNullishHeaders(headers) {
  for (const [name, value] of Object.entries(headers)) {
    if (value === undefined || value === null) {
      delete headers[name];
    }
  }
}

function hasDecryptKey(pathname) {
  const resource = pathname.split('/')[3] || '';
  return resource.includes('_');
}

const IDB_DB_NAME = 'dc-ipfs-cache';
const IDB_STORE = 'files';
const IDB_VERSION = 1;

let idbDbPromise = null;

function idbOpen() {
  if (idbDbPromise) return idbDbPromise;
  idbDbPromise = new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open(IDB_DB_NAME, IDB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          const store = db.createObjectStore(IDB_STORE, { keyPath: 'key' });
          store.createIndex('ts', 'ts', { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('IndexedDB open failed'));
    } catch (e) {
      reject(e);
    }
  });
  return idbDbPromise;
}

async function idbGet(key) {
  try {
    const db = await idbOpen();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.error('idbGet error:', e);
    return null;
  }
}

async function idbPut(key, blob, headers) {
  try {
    const db = await idbOpen();
    const record = { key, blob, headers, ts: Date.now(), size: blob.size || 0 };
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.put(record);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.error('idbPut error:', e);
    return false;
  }
}

const MimeTypes = {
    ".xpm": "image/x-xpixmap",
    ".7z": "application/x-7z-compressed",
    ".zip": "application/zip",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".epub": "application/epub+zip",
    ".jar": "application/jar",
    ".odt": "application/vnd.oasis.opendocument.text",
    ".ott": "application/vnd.oasis.opendocument.text-template",
    ".ods": "application/vnd.oasis.opendocument.spreadsheet",
    ".ots": "application/vnd.oasis.opendocument.spreadsheet-template",
    ".odp": "application/vnd.oasis.opendocument.presentation",
    ".otp": "application/vnd.oasis.opendocument.presentation-template",
    ".odg": "application/vnd.oasis.opendocument.graphics",
    ".otg": "application/vnd.oasis.opendocument.graphics-template",
    ".odf": "application/vnd.oasis.opendocument.formula",
    ".odc": "application/vnd.oasis.opendocument.chart",
    ".sxc": "application/vnd.sun.xml.calc",
    ".pdf": "application/pdf",
    ".fdf": "application/vnd.fdf",
    ".msi": "application/x-ms-installer",
    ".aaf": "application/octet-stream",
    ".msg": "application/vnd.ms-outlook",
    ".xls": "application/vnd.ms-excel",
    ".pub": "application/vnd.ms-publisher",
    ".ppt": "application/vnd.ms-powerpoint",
    ".doc": "application/msword",
    ".ps": "application/postscript",
    ".psd": "image/vnd.adobe.photoshop",
    ".p7s": "application/pkcs7-signature",
    ".ogg": "application/ogg",
    ".oga": "audio/ogg",
    ".ogv": "video/ogg",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".jxl": "image/jxl",
    ".jp2": "image/jp2",
    ".jpf": "image/jpx",
    ".jpm": "image/jpm",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".a": "application/x-archive",
    ".deb": "application/vnd.debian.binary-package",
    ".tar": "application/x-tar",
    ".xar": "application/x-xar",
    ".bz2": "application/x-bzip2",
    ".fits": "application/fits",
    ".tiff": "image/tiff",
    ".bmp": "image/bmp",
    ".ico": "image/x-icon",
    ".mp3": "audio/mpeg",
    ".flac": "audio/flac",
    ".midi": "audio/midi",
    ".ape": "audio/ape",
    ".mpc": "audio/musepack",
    ".amr": "audio/amr",
    ".wav": "audio/wav",
    ".aiff": "audio/aiff",
    ".au": "audio/basic",
    ".mpeg": "video/mpeg",
    ".mov": "video/quicktime",
    ".mqv": "video/quicktime",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".3gp": "video/3gpp",
    ".3g2": "video/3gpp2",
    ".avi": "video/x-msvideo",
    ".flv": "video/x-flv",
    ".mkv": "video/x-matroska",
    ".asf": "video/x-ms-asf",
    ".aac": "audio/aac",
    ".voc": "audio/x-unknown",
    ".m4a": "audio/x-m4a",
    ".m3u": "application/vnd.apple.mpegurl",
    ".m4v": "video/x-m4v",
    ".rmvb": "application/vnd.rn-realmedia-vbr",
    ".gz": "application/gzip",
    ".class": "application/x-java-applet",
    ".swf": "application/x-shockwave-flash",
    ".crx": "application/x-chrome-extension",
    ".ttf": "font/ttf",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".otf": "font/otf",
    ".ttc": "font/collection",
    ".eot": "application/vnd.ms-fontobject",
    ".wasm": "application/wasm",
    ".shx": "application/octet-stream",
    ".shp": "application/octet-stream",
    ".dbf": "application/x-dbf",
    ".dcm": "application/dicom",
    ".rar": "application/x-rar-compressed",
    ".djvu": "image/vnd.djvu",
    ".mobi": "application/x-mobipocket-ebook",
    ".lit": "application/x-ms-reader",
    ".bpg": "image/bpg",
    ".sqlite": "application/vnd.sqlite3",
    ".dwg": "image/vnd.dwg",
    ".nes": "application/vnd.nintendo.snes.rom",
    ".lnk": "application/x-ms-shortcut",
    ".macho": "application/x-mach-binary",
    ".qcp": "audio/qcelp",
    ".icns": "image/x-icns",
    ".heic": "image/heic",
    ".heif": "image/heif",
    ".hdr": "image/vnd.radiance",
    ".mrc": "application/marc",
    ".mdb": "application/x-msaccess",
    ".accdb": "application/x-msaccess",
    ".zst": "application/zstd",
    ".cab": "application/vnd.ms-cab-compressed",
    ".rpm": "application/x-rpm",
    ".xz": "application/x-xz",
    ".lz": "application/lzip",
    ".torrent": "application/x-bittorrent",
    ".cpio": "application/x-cpio",
    ".xcf": "image/x-xcf",
    ".pat": "image/x-gimp-pat",
    ".gbr": "image/x-gimp-gbr",
    ".glb": "model/gltf-binary",
    ".avif": "image/avif",
    ".txt": "text/plain",
    ".html": "text/html",
    ".svg": "image/svg+xml",
    ".xml": "text/xml",
    ".rss": "application/rss+xml",
    ".atom": "application/atom+xml",
    ".x3d": "model/x3d+xml",
    ".kml": "application/vnd.google-earth.kml+xml",
    ".xlf": "application/x-xliff+xml",
    ".dae": "model/vnd.collada+xml",
    ".gml": "application/gml+xml",
    ".gpx": "application/gpx+xml",
    ".tcx": "application/vnd.garmin.tcx+xml",
    ".amf": "application/x-amf",
    ".3mf": "application/vnd.ms-package.3dmanufacturing-3dmodel+xml",
    ".xfdf": "application/vnd.adobe.xfdf",
    ".owl": "application/owl+xml",
    ".php": "text/x-php",
    ".js": "application/javascript",
    ".lua": "text/x-lua",
    ".pl": "text/x-perl",
    ".py": "application/x-python",
    ".json": "application/json",
    ".geojson": "application/geo+json",
    ".har": "application/json",
    ".ndjson": "application/x-ndjson",
    ".rtf": "text/rtf",
    ".srt": "application/x-subrip",
    ".tcl": "text/x-tcl",
    ".csv": "text/csv",
    ".tsv": "text/tab-separated-values",
    ".vcf": "text/vcard",
    ".ics": "text/calendar",
    ".warc": "application/warc",
    ".vtt": "text/vtt",
  };
