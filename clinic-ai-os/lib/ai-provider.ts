/**
 * AI Provider interface + three implementations:
 *
 * 1. Deterministic — fast demo, no API calls needed.
 * 2. OpenAI — GPT-4o-mini with JSON mode + safety schema.
 * 3. Gemini — Gemini-2.0-flash with structured output.
 *
 * Usage:
 *   const provider = getAiProvider(process.env);
 *   const decision = await provider.analyze("بكم تنظيف الأسنان؟");
 */

import type { ClinicAiDecision } from "./clinic-workflow.ts";

// ─── Interface ─────────────────────────────────────────────────────────────────

export type AiProvider = {
  analyze(message: string): Promise<ClinicAiDecision>;
};

// ─── Deterministic (demo) ─────────────────────────────────────────────────────

export function createDeterministicProvider(): AiProvider {
  return {
    async analyze(message: string): Promise<ClinicAiDecision> {
      const text = message.trim().toLowerCase();

      if (containsAny(text, ["نزيف", "ألم شديد", "الم شديد", "طوارئ", "علاج", "دواء", "تشخيص"])) {
        return {
          intent: "medical_triage",
          confidence: 0.94,
          humanNeeded: true,
          nextAction: "human_handoff",
          reply: "سلامتك تهمنا. هذه الحالة تحتاج مراجعة طبيب، وسأحوّل المحادثة للفريق المختص.",
        };
      }

      if (containsAny(text, ["الغاء", "إلغاء", "ألغي", "الغي"])) {
        return {
          intent: "cancel",
          confidence: 0.88,
          humanNeeded: false,
          nextAction: "cancel_booking",
          reply: "تم استلام طلب الإلغاء. أرسل رقم جوالك أو وقت الموعد حتى نؤكد.",
        };
      }

      if (containsAny(text, ["غير", "تغيير", "إعادة جدولة", "اعادة جدولة"])) {
        return {
          intent: "reschedule",
          confidence: 0.86,
          humanNeeded: false,
          nextAction: "reschedule_booking",
          reply: "أكيد. أرسل الوقت المناسب لك وسنقترح أقرب المواعيد.",
        };
      }

      const wantsBooking = containsAny(text, ["موعد", "حجز", "اليوم", "متاح", "فاضي"]);

      if (containsAny(text, ["تنظيف", "اسنان", "أسنان", "سعر", "بكم"])) {
        return {
          intent: wantsBooking ? "booking" : "pricing",
          serviceCode: "DENT_CLEAN",
          serviceName: "تنظيف أسنان",
          confidence: 0.91,
          humanNeeded: false,
          nextAction: wantsBooking ? "offer_slots" : "answer_price",
          availableSlots: DENTAL_CLEANING_SLOTS,
          reply: wantsBooking
            ? "أهلاً بك. سعر تنظيف الأسنان 250 ريال. متاح اليوم 4:00 مساء أو 7:00 مساء مع د. ريم السيف. أي وقت يناسبك؟"
            : "سعر تنظيف الأسنان 250 ريال. هل تريد حجز موعد؟",
        };
      }

      return {
        intent: "unknown",
        confidence: 0.52,
        humanNeeded: true,
        nextAction: "ask_clarifying_question",
        reply: "أهلاً بك. هل ترغب بحجز موعد، معرفة الأسعار، أو التواصل مع موظف الاستقبال؟",
      };
    },
  };
}

const DENTAL_CLEANING_SLOTS = [
  { label: "اليوم 4:00 مساء", startsAt: "2026-05-22T16:00:00+03:00", doctorName: "د. ريم السيف" },
  { label: "اليوم 7:00 مساء", startsAt: "2026-05-22T19:00:00+03:00", doctorName: "د. ريم السيف" },
];

// ─── OpenAI ────────────────────────────────────────────────────────────────────

type FetchFn = (url: string, init: RequestInit) => Promise<{ ok: boolean; json(): Promise<unknown> }>;

export function createOpenAiProvider(options: {
  apiKey: string;
  model?: string;
  fetch?: FetchFn;
}): AiProvider {
  const fetchFn: FetchFn = options.fetch ?? (globalThis.fetch as unknown as FetchFn);
  const model = options.model ?? "gpt-4o-mini";
  const systemPrompt = SYSTEM_PROMPT;

  return {
    async analyze(message: string): Promise<ClinicAiDecision> {
      const response = await fetchFn("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${options.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          response_format: { type: "json_object" },
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response}`);
      }

      const json = (await response.json()) as {
        choices: Array<{ message: { content: string } }>;
      };

      const raw = json.choices[0]?.message?.content ?? "{}";
      return safeParseDecision(raw);
    },
  };
}

// ─── Gemini ───────────────────────────────────────────────────────────────────

export function createGeminiProvider(options: {
  apiKey: string;
  model?: string;
  fetch?: FetchFn;
}): AiProvider {
  const fetchFn: FetchFn = options.fetch ?? (globalThis.fetch as unknown as FetchFn);
  const model = options.model ?? "gemini-2.0-flash";
  const systemInstruction = SYSTEM_PROMPT;

  return {
    async analyze(message: string): Promise<ClinicAiDecision> {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${options.apiKey}`;
      const response = await fetchFn(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response}`);
      }

      const json = (await response.json()) as {
        candidates: Array<{
          content: { parts: Array<{ text: string }> };
        }>;
      };

      const raw = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
      return safeParseDecision(raw);
    },
  };
}

// ─── Factory ──────────────────────────────────────────────────────────────────

type AiEnv = {
  AI_PROVIDER?: "openai" | "gemini" | "deterministic";
  OPENAI_API_KEY?: string;
  GEMINI_API_KEY?: string;
};

export function getAiProvider(env: AiEnv = process.env as AiEnv): AiProvider {
  if (env.AI_PROVIDER === "openai" && env.OPENAI_API_KEY) {
    return createOpenAiProvider({ apiKey: env.OPENAI_API_KEY });
  }
  if (env.AI_PROVIDER === "gemini" && env.GEMINI_API_KEY) {
    return createGeminiProvider({ apiKey: env.GEMINI_API_KEY });
  }
  return createDeterministicProvider();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function containsAny(text: string, needles: string[]) {
  return needles.some((n) => text.includes(n.toLowerCase()));
}

const DEFAULT_DECISION: ClinicAiDecision = {
  intent: "unknown",
  confidence: 0,
  humanNeeded: true,
  nextAction: "ask_clarifying_question",
  reply: "عذراً، لم أتمكن من فهم طلبك. هل يمكنك إعادة المحاولة؟",
};

function safeParseDecision(raw: string): ClinicAiDecision {
  try {
    const parsed = JSON.parse(raw);
    return {
      intent: parsed.intent ?? "unknown",
      confidence: Number(parsed.confidence) || 0,
      humanNeeded: Boolean(parsed.humanNeeded),
      nextAction: parsed.nextAction ?? "ask_clarifying_question",
      reply: parsed.reply ?? DEFAULT_DECISION.reply,
      serviceCode: parsed.serviceCode,
      serviceName: parsed.serviceName,
      availableSlots: parsed.availableSlots,
    };
  } catch {
    return DEFAULT_DECISION;
  }
}

// ─── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a bilingual (Arabic + English) clinic AI assistant for a Riyadh dental/medical clinic.

Your job is to analyze patient WhatsApp messages and return a structured JSON decision.

Rules:
- NEVER give medical diagnosis, treatment advice, or medication recommendations
- ALWAYS route medical questions to human staff
- NEVER claim to be a doctor
- Be polite, brief, and professional in Arabic
- Confidence below 0.75 should always set humanNeeded: true

Intent categories:
- booking: Patient wants to book an appointment
- pricing: Patient wants price information
- cancel: Patient wants to cancel an appointment
- reschedule: Patient wants to change appointment time
- medical_triage: Patient describes symptoms, pain, or asks for medical advice
- unknown: Cannot determine intent

Return JSON with this shape:
{
  "intent": "booking|pricing|cancel|reschedule|medical_triage|unknown",
  "serviceCode": "DENT_CLEAN|...",
  "serviceName": "تنظيف أسنان|...",
  "confidence": 0.0-1.0,
  "humanNeeded": true|false,
  "nextAction": "offer_slots|answer_price|cancel_booking|reschedule_booking|human_handoff|ask_clarifying_question",
  "reply": "Arabic reply to send to patient (be helpful, brief, and safe)",
  "availableSlots": [{ "label": "اليوم 4:00 مساء", "startsAt": "ISO8601", "doctorName": "د. ..." }]
}

Available services:
- DENT_CLEAN: تنظيف أسنان (250 SAR)
- DENT_CHECKUP: فحص أسنان (150 SAR)
- DENT_WHITENING: تبييض أسنان (800 SAR)
- DENT_FILLING: حشوة أسنان (300 SAR)`;