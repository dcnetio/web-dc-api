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
 */
let id = 0;
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/dc/ipfs/')) {
    event.respondWith( ipfsProxy(event));
  }
});

async function ipfsProxy(fetchEvent) {
  const msgId = ++id;
  const request = fetchEvent.request;
  const range = request.headers.get('Range');

  console.log('***********IPFS Proxy:', msgId, request.url, range);
  const pathname = new URL(request.url).pathname;

  // 信道通信
  const channel = new MessageChannel();
  const promise = new Promise((resolve, reject) => {
    channel.port1.onmessage = msgEvent => {
      const {success, data, error, status, headers = {}} = msgEvent.data;
      if(success) {
        // 根据请求的后缀名设置响应头
        const ext = pathname.split('.').pop();
        const mimeType = MimeTypes['.' + ext] || MimeTypes[ext] || 'application/octet-stream';
        headers['Content-Type'] = mimeType;
        headers['Access-Control-Allow-Origin']= "*"
        headers['Content-Disposition'] = `inline; filename="${pathname.split('/').pop()}"`;
        headers['Accept-Ranges'] = 'bytes';

        // 处理 Range 请求
        let responseStatus = status || 200;
        if (range) {
          responseStatus = 206; // Partial Content
        }


        resolve(new Response(data ? new Uint8Array(data) : null, {
          status: responseStatus,
          headers: new Headers(headers)
        }));
      } else reject(error || 'IPFS fetch failed');
    };
  });

  // 获取客户端列表
  const clients = await self.clients.matchAll();
  console.log('***********IPFS Proxy: clients', msgId, clients);
  // 尝试找到发起请求的客户端
  const client = clients.find(c => c.id === fetchEvent.clientId) || clients[0];
  if (!client) {
    return new Response('No active client', { status: 404 });
  }

  // 发送消息给正确的客户端
  client.postMessage(
    {type: 'ipfs-fetch', id: msgId, pathname, range},
    [channel.port2]);
  return promise;
}


const MimeTypes = {
    "hixpm": "image/x-xpixmap",
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
