// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2026-10-02",
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.BACKEND_URL ?? "http://localhost:8000",
    },
  },
  devtools: { enabled: true },
  srcDir: "src",
  css: ["primeicons/primeicons.css", "@/assets/main.css"],
  modules: [
    "@nuxt/eslint",
    "@nuxtjs/seo",
    "@nuxt/image",
    "nuxt-security",
    "@nuxtjs/i18n",
    "@peterbud/nuxt-query",
    "@pinia/nuxt",
    "@primevue/nuxt-module",
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "dayjs", // CJS
        "dayjs/plugin/utc", // CJS
        "dayjs/plugin/timezone", // CJS
        "dayjs/plugin/relativeTime", // CJS
        "dayjs/plugin/customParseFormat", // CJS
        "dayjs/plugin/localizedFormat", // CJS
        "dayjs/locale/en", // CJS
        "dayjs/locale/fr", // CJS
        "tailwind-merge",
      ],
    },
  },
  primevue: {
    components: {
      include: [],
    },
    options: {
      theme: {
        options: {
          darkModeSelector: ".my-app-dark",
        },
      },
    },
  },
  imports: {
    presets: [
      {
        from: "@tanstack/vue-query",
        imports: ["useQuery", "useMutation", "useQueryClient"],
      },
    ],
  },
  components: {
    dirs: [{ path: "~/volt", prefix: "P" }],
  },
  site: {
    indexable: process.env.IS_PRODUCTION === "true",
    url: process.env.SITE_URL,
    name: "koyo-ai-lab-fe",
  },
  i18n: {
    locales: [
      {
        code: "en",
        language: "en-US",
        name: "English",
        file: "en.json",
      },
      {
        code: "ja",
        language: "ja-JP",
        name: "日本語",
        file: "ja.json",
      },
    ],
    defaultLocale: "en",
    langDir: "../i18n/locales/",
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
    vueI18n: "../i18n/i18n.config.ts",
    compilation: {
      strictMessage: false,
    },
  },
  ogImage: { zeroRuntime: true },
  security: {
    removeLoggers: process.env.IS_PRODUCTION === "true",
    rateLimiter: false,
    headers: {
      crossOriginEmbedderPolicy: "unsafe-none",
      contentSecurityPolicy: {
        "img-src": ["'self'", "data:", "https:"],
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        "frame-src": [
          "'self'",
          // Add other allowed frame URLs here
        ],
        "connect-src": [
          "'self'",
          "https:",
          "wss:",
          ...(process.env.BACKEND_URL ? [process.env.BACKEND_URL] : []),
        ],
        "worker-src": ["'self'", "blob:"],
        "base-uri": ["'none'"],
        "object-src": ["'none'"],
        "script-src-attr": ["'none'"],
        "form-action": ["'self'"],
        "frame-ancestors": [
          "'self'",
          // Add other allowed frame URLs here
        ],
        "upgrade-insecure-requests": true,
      },
    },
    corsHandler: {
      origin: process.env.SITE_URL ? [process.env.SITE_URL] : "*",
      methods: ["GET", "POST", "OPTIONS"],
    },
    ssg: false,
    sri: true,
  },
});
