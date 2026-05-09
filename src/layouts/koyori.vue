<template>
  <div class="font-[Manrope] bg-koyori-bg min-h-screen flex">
    <!-- Sidebar -->
    <aside
      class="w-60 min-w-60 bg-white border-r border-koyori-border flex flex-col h-screen sticky top-0 overflow-y-auto"
    >
      <!-- Brand -->
      <div class="px-4 pt-5 pb-4">
        <div class="flex items-center gap-2.5 mb-1">
          <div
            class="w-8 h-8 rounded-[9px] shrink-0 bg-gradient-to-br from-koyori-pink-300 to-koyori-pink-500 shadow-koyori-pink flex items-center justify-center text-white font-extrabold text-lg leading-none"
          >
            k
          </div>
          <div>
            <div class="font-bold text-[15px] text-koyori-ink leading-tight">
              {{ t("koyori.app.name") }}
            </div>
            <div class="text-[11px] text-koyori-ink-4 leading-tight">
              {{ t("koyori.app.tagline") }}
            </div>
          </div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-2 py-2">
        <!-- Browse section -->
        <div
          class="px-2 pt-2 pb-1 text-[11px] font-semibold tracking-[0.06em] uppercase text-koyori-ink-4"
        >
          {{ t("koyori.nav.browse") }}
        </div>
        <NuxtLink
          to="/"
          class="flex items-center gap-2 px-2.5 py-[7px] rounded-lg text-[13.5px] font-medium text-koyori-ink-2 no-underline transition-colors duration-150 mb-px hover:bg-koyori-surface-2 hover:text-koyori-ink"
          :class="{
            'bg-koyori-pink-100 !text-koyori-pink-700 font-semibold':
              route.path === '/',
          }"
        >
          <i class="pi pi-th-large text-[14px]"></i>
          {{ t("koyori.nav.library") }}
        </NuxtLink>
        <NuxtLink
          to="/search"
          class="flex items-center gap-2 px-2.5 py-[7px] rounded-lg text-[13.5px] font-medium text-koyori-ink-2 no-underline transition-colors duration-150 mb-px hover:bg-koyori-surface-2 hover:text-koyori-ink"
          :class="{
            'bg-koyori-pink-100 !text-koyori-pink-700 font-semibold':
              route.path === '/search',
          }"
        >
          <i class="pi pi-search text-[14px]"></i>
          {{ t("koyori.nav.search") }}
        </NuxtLink>
        <NuxtLink
          to="/chat"
          class="flex items-center gap-2 px-2.5 py-[7px] rounded-lg text-[13.5px] font-medium text-koyori-ink-2 no-underline transition-colors duration-150 mb-px hover:bg-koyori-surface-2 hover:text-koyori-ink"
          :class="{
            'bg-koyori-pink-100 !text-koyori-pink-700 font-semibold':
              route.path === '/chat',
          }"
        >
          <i class="pi pi-sparkles text-[14px]"></i>
          {{ t("koyori.nav.chat") }}
        </NuxtLink>

        <!-- Process section -->
        <div
          class="px-2 pt-4 pb-1 text-[11px] font-semibold tracking-[0.06em] uppercase text-koyori-ink-4"
        >
          {{ t("koyori.nav.process") }}
        </div>
        <NuxtLink
          to="/add"
          class="flex items-center gap-2 px-2.5 py-[7px] rounded-lg text-[13.5px] font-medium text-koyori-ink-2 no-underline transition-colors duration-150 mb-px hover:bg-koyori-surface-2 hover:text-koyori-ink"
          :class="{
            'bg-koyori-pink-100 !text-koyori-pink-700 font-semibold':
              route.path === '/add',
          }"
        >
          <i class="pi pi-plus-circle text-[14px]"></i>
          {{ t("koyori.nav.add") }}
        </NuxtLink>
        <NuxtLink
          to="/jobs"
          class="flex items-center gap-2 px-2.5 py-[7px] rounded-lg text-[13.5px] font-medium text-koyori-ink-2 no-underline transition-colors duration-150 mb-px hover:bg-koyori-surface-2 hover:text-koyori-ink"
          :class="{
            'bg-koyori-pink-100 !text-koyori-pink-700 font-semibold':
              route.path.startsWith('/jobs'),
          }"
        >
          <i class="pi pi-cog text-[14px]"></i>
          {{ t("koyori.nav.jobs") }}
          <span
            v-if="activeJobCount > 0"
            class="ml-auto bg-koyori-pink-400 text-white rounded-[10px] px-[7px] py-px text-[11px] font-semibold"
            >{{ activeJobCount }}</span
          >
        </NuxtLink>
      </nav>

      <!-- Language switcher -->
      <div class="px-4 pb-4 pt-3 border-t border-koyori-border">
        <div class="flex bg-koyori-surface-2 rounded-full p-[3px] gap-0.5">
          <button
            v-for="code in localeCodes"
            :key="code"
            class="flex-1 px-2 py-1 rounded-2xl border-none text-[11px] cursor-pointer transition-all duration-150 font-[inherit]"
            :class="
              currentLocale === code
                ? 'bg-white text-koyori-ink font-semibold shadow-koyori-sm'
                : 'bg-transparent text-koyori-ink-3 font-normal'
            "
            @click="setLocale(code as 'en' | 'ja')"
          >
            {{ code.toUpperCase() }}
          </button>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 min-w-0 h-screen overflow-y-auto flex flex-col">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { DUMMY_JOBS } from "~/composables/koyori-data";

const route = useRoute();
const { t, locale: currentLocale, setLocale } = useI18n();

const localeCodes = ["en", "ja"] as const;

const activeJobCount = computed(
  () =>
    DUMMY_JOBS.filter(
      (j) =>
        j.stage === "transcribing" ||
        j.stage === "summarizing" ||
        j.stage === "queued",
    ).length,
);
</script>
