// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxt/icon",
    "@nuxtjs/seo",
    "@vueuse/nuxt",
    "@nuxt/ui",
    "@pinia/nuxt",
  ],
  runtimeConfig: {
    public: {
      openAIKey: process.env.OPEN_AI_KEY,
      affiliateCode: "2231",
      googleApiKey: process.env.GOOGLE_API_KEY
    },
  },
});