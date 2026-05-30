import cryptoNode from "node:crypto";

const DEFAULT_DEV_WEBHOOK_VERIFY_TOKEN = "mock_verify_token";

export function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

export function getBoundedString(
  value: unknown,
  options: { min?: number; max?: number } = {},
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  const min = options.min ?? 1;
  const max = options.max ?? 4096;

  if (trimmed.length < min || trimmed.length > max) {
    return null;
  }

  return trimmed;
}

export function extractLastMessageContent(value: unknown): string | null {
  const body = asObject(value);
  const messages = body?.messages;

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
    return null;
  }

  const lastMessage = asObject(messages[messages.length - 1]);
  return getBoundedString(lastMessage?.content);
}

export function getWhatsAppVerifyToken(
  env: { NODE_ENV?: string; WHATSAPP_VERIFY_TOKEN?: string } = process.env,
): string | null {
  const configuredToken = getBoundedString(env.WHATSAPP_VERIFY_TOKEN, { max: 256 });

  if (configuredToken) {
    return configuredToken;
  }

  if (env.NODE_ENV === "production") {
    return null;
  }

  return DEFAULT_DEV_WEBHOOK_VERIFY_TOKEN;
}

export function isUnauthenticatedDemoApiAllowed(
  env: { NODE_ENV?: string; ENABLE_UNAUTHENTICATED_DEMO_API?: string } = process.env,
) {
  return env.NODE_ENV !== "production" || env.ENABLE_UNAUTHENTICATED_DEMO_API === "true";
}

export async function verifyMetaWebhookSignature(input: {
  rawBody: string;
  signatureHeader: string | null;
  appSecret?: string;
}) {
  const appSecret = getBoundedString(input.appSecret, { max: 512 });

  if (!appSecret || !input.signatureHeader?.startsWith("sha256=")) {
    return false;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(appSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(input.rawBody));
  const expected = `sha256=${Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("")}`;

  return timingSafeEqual(expected, input.signatureHeader);
}

function timingSafeEqual(a: string, b: string) {
  try {
    const aHash = cryptoNode.createHash("sha256").update(a).digest();
    const bHash = cryptoNode.createHash("sha256").update(b).digest();
    return cryptoNode.timingSafeEqual(aHash, bHash);
  } catch {
    return false;
  }
}
