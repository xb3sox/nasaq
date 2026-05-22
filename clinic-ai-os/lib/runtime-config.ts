export type RuntimeConfigEnv = {
  NODE_ENV?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  WHATSAPP_ACCESS_TOKEN?: string;
  WHATSAPP_PHONE_NUMBER_ID?: string;
  WHATSAPP_VERIFY_TOKEN?: string;
  WHATSAPP_APP_SECRET?: string;
  AI_PROVIDER?: string;
  OPENAI_API_KEY?: string;
  GEMINI_API_KEY?: string;
  ENABLE_UNAUTHENTICATED_DEMO_API?: string;
};

export type RuntimeConfigStatus = {
  environment: "development" | "test" | "production";
  supabase: {
    ready: boolean;
    missing: string[];
  };
  whatsapp: {
    ready: boolean;
    mode: "mock" | "cloud";
    missing: string[];
  };
  ai: {
    ready: boolean;
    provider: "deterministic" | "openai" | "gemini";
    missing: string[];
  };
  demoApi: {
    exposed: boolean;
  };
};

export function getRuntimeConfigStatus(env: RuntimeConfigEnv = process.env): RuntimeConfigStatus {
  const environment = normalizeEnvironment(env.NODE_ENV);
  const supabaseMissing = missingKeys(env, ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);
  const whatsappMissing = missingKeys(env, [
    "WHATSAPP_ACCESS_TOKEN",
    "WHATSAPP_PHONE_NUMBER_ID",
    "WHATSAPP_VERIFY_TOKEN",
    "WHATSAPP_APP_SECRET",
  ]);
  const ai = getAiStatus(env);

  return {
    environment,
    supabase: {
      ready: supabaseMissing.length === 0,
      missing: supabaseMissing,
    },
    whatsapp: {
      ready: whatsappMissing.length === 0,
      mode: whatsappMissing.length === 0 ? "cloud" : "mock",
      missing: whatsappMissing,
    },
    ai,
    demoApi: {
      exposed: environment !== "production" || env.ENABLE_UNAUTHENTICATED_DEMO_API === "true",
    },
  };
}

function getAiStatus(env: RuntimeConfigEnv): RuntimeConfigStatus["ai"] {
  if (env.AI_PROVIDER === "openai") {
    const missing = missingKeys(env, ["OPENAI_API_KEY"]);
    return {
      ready: missing.length === 0,
      provider: missing.length === 0 ? "openai" : "deterministic",
      missing,
    };
  }

  if (env.AI_PROVIDER === "gemini") {
    const missing = missingKeys(env, ["GEMINI_API_KEY"]);
    return {
      ready: missing.length === 0,
      provider: missing.length === 0 ? "gemini" : "deterministic",
      missing,
    };
  }

  return {
    ready: false,
    provider: "deterministic",
    missing: [],
  };
}

function normalizeEnvironment(value: string | undefined): RuntimeConfigStatus["environment"] {
  if (value === "production" || value === "test") {
    return value;
  }
  return "development";
}

function missingKeys(env: RuntimeConfigEnv, keys: string[]) {
  return keys.filter((key) => !env[key as keyof RuntimeConfigEnv]);
}
