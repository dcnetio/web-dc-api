import type {
  AIProxyMediaInputPolicy,
  AIProxyMediaInputSource,
} from "../../common/types/types";

const bytesToBase64 = (bytes: Uint8Array): string => {
  if (typeof btoa !== "undefined") {
    let binary = "";
    const chunkSize = 0x8000;
    for (let index = 0; index < bytes.length; index += chunkSize) {
      const chunk = bytes.subarray(index, Math.min(index + chunkSize, bytes.length));
      binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
    }
    return btoa(binary);
  }
  return Buffer.from(bytes).toString("base64");
};

const blobToDataUri = async (blob: Blob): Promise<string> => {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  return `data:${blob.type || "application/octet-stream"};base64,${bytesToBase64(bytes)}`;
};

const normalizeMediaBlob = async (
  blob: Blob,
  policy: AIProxyMediaInputPolicy,
): Promise<string> => {
  if (!blob.type.startsWith("image/")) {
    throw new Error(`AI media input must be an image, received ${blob.type || "unknown MIME type"}`);
  }
  if (
    typeof document === "undefined" ||
    typeof Image === "undefined" ||
    typeof URL === "undefined" ||
    typeof URL.createObjectURL !== "function"
  ) {
    return blobToDataUri(blob);
  }

  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("Unable to decode local AI media image"));
      element.src = objectUrl;
    });
    const maxDimension = Math.max(1, policy.maxImageDimension ?? 1024);
    const quality = Math.min(1, Math.max(0.1, policy.imageQuality ?? 0.82));
    const width = image.naturalWidth || image.width;
    const height = image.naturalHeight || image.height;
    if (!width || !height) return blobToDataUri(blob);

    const scale = Math.min(1, maxDimension / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const canvasContext = canvas.getContext("2d");
    if (!canvasContext) return blobToDataUri(blob);
    canvasContext.fillStyle = "#ffffff";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const normalizeAIProxyMediaSource = async (
  source: AIProxyMediaInputSource,
  inputPolicy: AIProxyMediaInputPolicy = {},
): Promise<string> => {
  const transport = inputPolicy.transport || "https_url";
  const policy = {
    normalizeLocalImages: transport !== "https_url",
    allowRemoteUrls: transport !== "data_uri",
    allowDataUris: transport !== "https_url",
    ...inputPolicy,
  };

  if (typeof source !== "string") {
    if (!policy.normalizeLocalImages || transport === "https_url") {
      throw new Error("This AI media service requires an HTTPS image URL; upload the local image before calling it");
    }
    return normalizeMediaBlob(source, policy);
  }

  const value = source.trim();
  if (!value) throw new Error("AI media image source cannot be empty");
  if (value.startsWith("data:")) {
    if (!policy.allowDataUris) throw new Error("Data URI images are disabled by input policy");
    if (!/^data:image\//i.test(value)) throw new Error("AI media data URI must contain an image");
    return value;
  }
  if (/^https?:\/\//i.test(value)) {
    if (!policy.allowRemoteUrls) throw new Error("Remote image URLs are disabled by input policy");
    return value;
  }
  if (value.startsWith("blob:")) {
    if (!policy.normalizeLocalImages || transport === "https_url") {
      throw new Error("blob: URLs are browser-local; this AI media service requires an HTTPS image URL");
    }
    const response = await fetch(value);
    if (!response.ok) throw new Error(`Unable to read local AI media image (HTTP ${response.status})`);
    return normalizeMediaBlob(await response.blob(), policy);
  }
  throw new Error(`Unsupported AI media image source: ${value.slice(0, 32)}`);
};

export const buildDashScopeMediaRequestBody = (
  prompt: string,
  imageSources: string[],
  parameters: Record<string, unknown> = {},
): string => {
  const normalizedPrompt = prompt.trim();
  if (!normalizedPrompt) throw new Error("DashScope Media prompt cannot be empty");
  if (imageSources.length === 0) throw new Error("DashScope Media requires at least one image");
  return JSON.stringify({
    input: {
      messages: [{
        role: "user",
        content: [
          ...imageSources.map((image) => ({ image })),
          { text: normalizedPrompt },
        ],
      }],
    },
    parameters,
  });
};