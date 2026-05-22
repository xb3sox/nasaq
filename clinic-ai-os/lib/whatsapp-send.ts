/**
 * WhatsApp send adapter.
 *
 * Two modes:
 * - Mock: for demos and tests; no real HTTP calls.
 * - Cloud API: official Meta WhatsApp Business Cloud API.
 *
 * Usage:
 *   const sender = getWhatsAppSender(process.env);
 *   const result = await sender.send({ to: "+966501234567", body: "مرحباً" });
 */

export type SendInput = {
  to: string;
  body: string;
};

export type WhatsAppSendResult =
  | { ok: true; messageId: string }
  | { ok: false; error: string };

export type WhatsAppSender = {
  send(input: SendInput): Promise<WhatsAppSendResult>;
};

// ─── Mock sender ─────────────────────────────────────────────────────────────

export function createMockWhatsAppSender(): WhatsAppSender {
  return {
    async send(input) {
      if (!input.to) {
        return { ok: false, error: "Recipient phone (to) is required" };
      }
      if (!input.body) {
        return { ok: false, error: "Message body is required" };
      }
      return {
        ok: true,
        messageId: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      };
    },
  };
}

// ─── Cloud API sender ─────────────────────────────────────────────────────────

type FetchFn = (url: string, init: RequestInit) => Promise<{ ok: boolean; status?: number; json(): Promise<unknown> }>;

export function createCloudApiWhatsAppSender(options: {
  phoneNumberId: string;
  accessToken: string;
  fetch?: FetchFn;
}): WhatsAppSender {
  const fetchFn: FetchFn = options.fetch ?? (globalThis.fetch as unknown as FetchFn);
  const url = `https://graph.facebook.com/v19.0/${options.phoneNumberId}/messages`;

  return {
    async send(input) {
      if (!input.to) {
        return { ok: false, error: "Recipient phone (to) is required" };
      }
      if (!input.body) {
        return { ok: false, error: "Message body is required" };
      }

      try {
        const response = await fetchFn(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${options.accessToken}`,
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: input.to,
            type: "text",
            text: { body: input.body },
          }),
        });

        const json = (await response.json()) as {
          messages?: Array<{ id: string }>;
          error?: { message?: string };
        };

        if (!response.ok) {
          const errMsg = json.error?.message ?? `HTTP ${response.status ?? "unknown"}`;
          return { ok: false, error: errMsg };
        }

        const messageId = json.messages?.[0]?.id ?? `cloud-${Date.now()}`;
        return { ok: true, messageId };
      } catch (err) {
        const error = err instanceof Error ? err.message : "Unknown send error";
        return { ok: false, error };
      }
    },
  };
}

// ─── Factory (env-aware) ──────────────────────────────────────────────────────

type SendEnv = {
  WHATSAPP_PHONE_NUMBER_ID?: string;
  WHATSAPP_ACCESS_TOKEN?: string;
};

export function getWhatsAppSender(env: SendEnv = process.env as SendEnv): WhatsAppSender {
  if (env.WHATSAPP_PHONE_NUMBER_ID && env.WHATSAPP_ACCESS_TOKEN) {
    return createCloudApiWhatsAppSender({
      phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID,
      accessToken: env.WHATSAPP_ACCESS_TOKEN,
    });
  }
  return createMockWhatsAppSender();
}
