<template>
  <div class="flex flex-col min-h-full">
    <!-- Topbar -->
    <div
      class="flex items-center justify-between px-8 py-4 border-b border-koyori-border bg-white sticky top-0 z-10 shrink-0"
    >
      <div>
        <h2 class="text-[18px] font-bold text-koyori-ink m-0 leading-tight">
          Search
        </h2>
        <p class="text-[13px] text-koyori-ink-3 m-0 mt-0.5">
          Across 89 streams · 24h 12m of audio [Dummy]
        </p>
      </div>
      <div class="flex gap-2">
        <NuxtLink to="/chat">
          <PGhostButton
            label="Ask the corpus →"
            size="small"
            icon="pi pi-sparkles"
          />
        </NuxtLink>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 p-6 px-8 max-w-[1100px] w-full">
      <div
        class="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-[12.5px] font-medium px-3 py-2 rounded-lg mb-5"
      >
        <i class="pi pi-exclamation-triangle text-[13px]"></i>
        Showing dummy data — backend not yet connected
      </div>

      <!-- Search input -->
      <div class="relative mb-5">
        <i
          class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-koyori-ink-3 text-[16px] pointer-events-none"
        ></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search across all streams… e.g. Lui-nee laughing"
          class="w-full pl-11 py-3.5 pr-4 border-[1.5px] rounded-xl text-[15px] bg-white outline-none text-koyori-ink font-[inherit] box-border shadow-koyori-sm transition-colors duration-150"
          :class="
            inputFocused ? 'border-koyori-pink-400' : 'border-koyori-border'
          "
          @focus="inputFocused = true"
          @blur="inputFocused = false"
        />
      </div>

      <!-- Filter row -->
      <div class="flex items-center gap-3 mb-6 flex-wrap">
        <!-- Topic filter -->
        <div
          class="flex bg-koyori-surface-2 rounded-full p-0.5 gap-0.5 shrink-0"
        >
          <button
            v-for="topic in topicFilters"
            :key="topic"
            class="px-3 py-1 rounded-full text-[12px] text-koyori-ink-3 bg-transparent border-none cursor-pointer font-[inherit] transition-all duration-150"
            :class="
              activeTopic === topic
                ? '!bg-white !text-koyori-ink !font-semibold shadow-koyori-sm'
                : ''
            "
            @click="activeTopic = topic"
          >
            {{ topic }}
          </button>
        </div>
        <!-- Date range -->
        <div
          class="flex bg-koyori-surface-2 rounded-full p-0.5 gap-0.5 shrink-0"
        >
          <button
            v-for="dr in dateRanges"
            :key="dr"
            class="px-3 py-1 rounded-full text-[12px] text-koyori-ink-3 bg-transparent border-none cursor-pointer font-[inherit] transition-all duration-150"
            :class="
              activeDateRange === dr
                ? '!bg-white !text-koyori-ink !font-semibold shadow-koyori-sm'
                : ''
            "
            @click="activeDateRange = dr"
          >
            {{ dr }}
          </button>
        </div>
        <!-- Min score -->
        <div class="flex items-center gap-2 ml-auto">
          <span class="text-[12px] text-koyori-ink-3 whitespace-nowrap"
            >Min score: {{ minScore }}%</span
          >
          <input
            v-model.number="minScore"
            type="range"
            min="0"
            max="100"
            step="5"
            class="w-[100px] accent-pink-400"
          />
        </div>
      </div>

      <!-- Loading state -->
      <template v-if="devState === 'Loading'">
        <div class="flex flex-col gap-3">
          <div
            v-for="i in 3"
            :key="i"
            class="bg-gradient-to-r from-koyori-surface-2 via-koyori-surface-3 to-koyori-surface-2 bg-[size:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-[100px] rounded-xl"
          ></div>
        </div>
      </template>

      <!-- Error state -->
      <template v-else-if="devState === 'Error'">
        <div class="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
          <i
            class="pi pi-exclamation-circle text-[28px] text-red-600 block mb-2"
          ></i>
          <div class="text-[14px] font-semibold text-red-800 mb-1.5">
            Search failed
          </div>
          <div class="text-[13px] text-red-700">
            Could not reach search backend. Please try again.
          </div>
        </div>
      </template>

      <!-- Idle / no query state -->
      <template v-else-if="devState === 'Default' && !searchQuery.trim()">
        <div class="text-center py-[60px] px-5 text-koyori-ink-3">
          <i class="pi pi-search text-[40px] block mb-4 text-koyori-ink-4"></i>
          <div class="text-[16px] font-semibold text-koyori-ink-2 mb-1.5">
            What are you looking for?
          </div>
          <div class="text-[13px] mb-5">
            Search across every transcript in your library
          </div>
          <div class="flex flex-wrap gap-2 justify-center">
            <button
              v-for="suggestion in suggestions"
              :key="suggestion"
              class="px-3.5 py-1.5 rounded-full border border-koyori-border bg-white text-[13px] text-koyori-ink-2 cursor-pointer font-[inherit] transition-all duration-150"
              @click="searchQuery = suggestion"
            >
              "{{ suggestion }}"
            </button>
          </div>
        </div>
      </template>

      <!-- Empty results -->
      <template
        v-else-if="
          devState === 'Empty' ||
          (searchQuery.trim() && filteredResults.length === 0)
        "
      >
        <div class="text-center py-[60px] px-5 text-koyori-ink-3">
          <i class="pi pi-inbox text-[40px] block mb-3 text-koyori-ink-4"></i>
          <div class="text-[16px] font-semibold text-koyori-ink-2 mb-1.5">
            No results found
          </div>
          <div class="text-[13px]">
            Try different keywords or lower the minimum score
          </div>
        </div>
      </template>

      <!-- Results -->
      <template v-else>
        <div class="text-[12px] text-koyori-ink-3 mb-3">
          {{ filteredResults.length }} results
        </div>
        <div class="flex flex-col gap-3">
          <div
            v-for="result in filteredResults"
            :key="result.t"
            class="bg-white border border-koyori-border rounded-xl shadow-koyori-sm p-4 flex gap-3.5 cursor-pointer transition-all duration-150 hover:shadow-koyori-md hover:border-koyori-border-2"
          >
            <!-- Thumbnail -->
            <div
              class="w-20 h-[45px] rounded-lg shrink-0"
              :style="{ background: useToneGradient(result.tone) }"
            ></div>
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start gap-2 mb-1.5 flex-wrap">
                <span
                  class="text-[14px] font-semibold text-koyori-ink max-w-[400px] truncate"
                  >{{ result.stream }}</span
                >
                <span class="text-[12px] text-koyori-ink-4">{{
                  result.date
                }}</span>
                <span
                  class="font-[JetBrains_Mono] text-[12px] text-koyori-pink-500 font-semibold bg-koyori-pink-50 px-1.5 py-px rounded-[5px]"
                  >{{ result.t }}</span
                >
                <span
                  class="font-[JetBrains_Mono] text-[11px] text-koyori-ink-4"
                  >+{{ result.duration }}</span
                >
              </div>
              <p
                class="text-[13.5px] text-koyori-ink-2 m-0 mb-2 leading-relaxed"
              >
                {{ result.snippet }}
              </p>
              <div class="flex items-center gap-2">
                <span
                  class="text-[11px] text-koyori-ink-4 italic flex-1 min-w-0 truncate"
                  >{{ result.why }}</span
                >
                <!-- Score bar -->
                <div class="flex items-center gap-1.5 shrink-0">
                  <div
                    class="w-[60px] h-1 bg-koyori-surface-3 rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-gradient-to-r from-koyori-pink-400 to-koyori-pink-500 rounded-full"
                      :style="{ width: `${result.score * 100}%` }"
                    ></div>
                  </div>
                  <span class="text-[12px] font-semibold text-koyori-ink-2"
                    >{{ (result.score * 100).toFixed(0) }}%</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Dev state switcher -->
    <div
      class="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white border border-koyori-border rounded-full px-3 py-1.5 shadow-koyori-md z-50"
    >
      <span class="text-[11px] text-koyori-ink-3 font-medium mr-1"
        >View state:</span
      >
      <button
        v-for="s in ['Default', 'Loading', 'Empty', 'Error']"
        :key="s"
        class="px-2.5 py-1 rounded-full text-[11px] text-koyori-ink-3 bg-transparent border-none cursor-pointer font-[inherit] transition-all duration-150"
        :class="
          devState === s
            ? '!bg-koyori-pink-100 !text-koyori-pink-700 !font-semibold'
            : ''
        "
        @click="devState = s"
      >
        {{ s }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  DUMMY_SEARCH_RESULTS,
  useToneGradient,
} from "~/composables/koyori-data";

definePageMeta({ layout: "koyori" });

const searchQuery = ref("");
const activeTopic = ref("All");
const activeDateRange = ref("All time");
const minScore = ref(0);
const devState = ref("Default");
const inputFocused = ref(false);

const topicFilters = ["All", "Music", "Gaming", "Lab", "Talk", "News"];
const dateRanges = ["All time", "Past month", "Past week"];
const suggestions = [
  "Lui-nee laughing",
  "singing practice routine",
  "CRISPR paper",
  "Minecraft flask",
  "outfit reveal",
];

const filteredResults = computed(() => {
  return DUMMY_SEARCH_RESULTS.filter((r) => r.score * 100 >= minScore.value);
});
</script>
