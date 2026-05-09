<template>
  <div class="flex flex-col min-h-full">
    <!-- Topbar -->
    <div
      class="flex items-center justify-between px-8 py-4 border-b border-koyori-border bg-white sticky top-0 z-10 shrink-0"
    >
      <div>
        <h2 class="text-[18px] font-bold text-koyori-ink m-0 leading-tight">
          {{ t("nav.library") }}
        </h2>
        <p class="text-[13px] text-koyori-ink-3 m-0 mt-0.5">
          {{ streamsData?.total ?? "..." }} streams
        </p>
      </div>
      <div class="flex gap-2 items-center">
        <PGhostButton
          icon="pi pi-refresh"
          size="small"
          aria-label="Refresh"
          @click="refresh()"
        />
        <NuxtLink to="/add">
          <PButton
            icon="pi pi-plus"
            :label="t('btn.add_stream')"
            size="small"
          />
        </NuxtLink>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 px-8 py-6 w-full">
      <!-- Loading state -->
      <template v-if="isLoading || devState === 'Loading'">
        <div class="grid grid-cols-5 gap-2.5 mb-5">
          <div
            v-for="i in 5"
            :key="i"
            class="bg-gradient-to-r from-koyori-surface-2 via-koyori-surface-3 to-koyori-surface-2 bg-[size:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-[90px] rounded-xl"
          ></div>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="i in 6"
            :key="i"
            class="bg-gradient-to-r from-koyori-surface-2 via-koyori-surface-3 to-koyori-surface-2 bg-[size:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-[220px] rounded-xl"
          ></div>
        </div>
      </template>

      <!-- Error state -->
      <template v-else-if="isError || devState === 'Error'">
        <div
          class="bg-red-50 border border-red-200 rounded-xl p-6 text-center mt-5"
        >
          <i
            class="pi pi-exclamation-circle text-[32px] text-red-600 mb-3 block"
          ></i>
          <div class="text-[16px] font-semibold text-red-800 mb-1.5">
            Failed to load library
          </div>
          <div class="text-[13px] text-red-700 mb-4">
            Could not connect to backend. Please check your connection.
          </div>
          <PButton label="Try again" icon="pi pi-refresh" size="small" />
        </div>
      </template>

      <template v-else>
        <!-- Topic cards -->
        <!-- <div class="mb-5">
          <div
            class="text-[12px] font-semibold text-koyori-ink-3 mb-2.5 tracking-[0.02em]"
          >
            {{ t("lib.browse_topic") }}
          </div>
          <div class="grid grid-cols-5 gap-2.5">
            <button
              v-for="topic in DUMMY_TOPICS"
              :key="topic.id"
              @click="toggleTopic(topic.id)"
              class="p-3 rounded-xl cursor-pointer text-left transition-all duration-150 font-[inherit]"
              :class="
                selectedTopic === topic.id
                  ? 'border-[1.5px] border-koyori-pink-300 bg-koyori-pink-100 shadow-koyori-sm'
                  : 'border border-koyori-border bg-white'
              "
            >
              <div class="text-[18px] mb-1.5" :class="toneClass(topic.tone)">
                <i :class="topic.icon"></i>
              </div>
              <div class="font-bold text-[20px] text-koyori-ink leading-none">
                {{ topic.count }}
              </div>
              <div class="text-[11.5px] text-koyori-ink-3 mt-0.5 truncate">
                {{ topic.label }}
              </div>
            </button>
          </div>
        </div> -->

        <!-- Tags row -->
        <!-- <div class="mb-5 flex items-center gap-2 flex-wrap">
          <span class="text-[12px] font-semibold text-koyori-ink-3 shrink-0">{{
            t("lib.tags")
          }}</span>
          <button
            v-for="tagItem in DUMMY_TAGS"
            :key="tagItem.tag"
            @click="toggleTag(tagItem.tag)"
            class="px-2.5 py-0.5 rounded-full cursor-pointer text-[12px] transition-all duration-150 font-[inherit]"
            :class="
              selectedTag === tagItem.tag
                ? 'border-[1.5px] border-koyori-pink-300 bg-koyori-pink-100 font-semibold text-koyori-pink-700'
                : 'border border-koyori-border bg-koyori-surface-2 font-medium text-koyori-ink-2'
            "
          >
            #{{ tagItem.tag }}
            <span class="opacity-55 text-[11px]">{{ tagItem.count }}</span>
          </button>
        </div> -->

        <!-- Toolbar -->
        <div class="flex items-center gap-2.5 mb-5">
          <div class="flex-1 relative max-w-[320px]">
            <i
              class="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-koyori-ink-4 text-[13px] pointer-events-none"
            ></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Filter library..."
              class="w-full pl-8 py-2 pr-2.5 border border-koyori-border rounded-lg text-[13px] bg-white outline-none text-koyori-ink font-[inherit] box-border"
            />
          </div>
          <div class="ml-auto flex gap-2 items-center">
            <div class="flex bg-koyori-surface-2 rounded-lg p-0.5 gap-px">
              <button
                class="p-[5px_8px] rounded-md border-none cursor-pointer transition-all duration-150 font-[inherit]"
                :class="
                  viewMode === 'grid'
                    ? 'bg-white text-koyori-ink shadow-koyori-sm'
                    : 'bg-transparent text-koyori-ink-3'
                "
                @click="viewMode = 'grid'"
              >
                <i class="pi pi-th-large text-[13px]"></i>
              </button>
              <button
                class="p-[5px_8px] rounded-md border-none cursor-pointer transition-all duration-150 font-[inherit]"
                :class="
                  viewMode === 'list'
                    ? 'bg-white text-koyori-ink shadow-koyori-sm'
                    : 'bg-transparent text-koyori-ink-3'
                "
                @click="viewMode = 'list'"
              >
                <i class="pi pi-list text-[13px]"></i>
              </button>
            </div>
            <PGhostButton
              icon="pi pi-sort-amount-down"
              :label="
                sortOrder === 'newest' ? t('lib.newest') : t('lib.oldest')
              "
              size="small"
              @click="sortOrder = sortOrder === 'newest' ? 'oldest' : 'newest'"
            />
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="filteredStreams.length === 0"
          class="text-center py-[60px] px-5 text-koyori-ink-3"
        >
          <i class="pi pi-inbox text-[40px] mb-3 block text-koyori-ink-4"></i>
          <div class="text-[16px] font-semibold text-koyori-ink-2 mb-1.5">
            No streams found
          </div>
          <div class="text-[13px]">Try adjusting your filters</div>
        </div>

        <!-- Grid view -->
        <div v-else-if="viewMode === 'grid'" class="grid grid-cols-3 gap-4">
          <NuxtLink
            v-for="stream in filteredStreams"
            :key="stream.id"
            :to="`/streams/${stream.id}`"
            class="no-underline text-inherit"
          >
            <div
              class="bg-white border border-koyori-border rounded-xl overflow-hidden cursor-pointer transition-all duration-150 hover:shadow-koyori-md hover:border-koyori-border-2 hover:-translate-y-px"
            >
              <div class="relative aspect-video overflow-hidden">
                <div
                  class="w-full h-full absolute inset-0"
                  :style="{
                    background: stream.thumbnail_url
                      ? `url(${stream.thumbnail_url}) center/cover`
                      : useToneGradient(stream.tone),
                  }"
                ></div>
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                ></div>
                <div class="absolute bottom-2 left-0 right-11 px-3">
                  <div
                    class="text-white text-[11.5px] font-semibold overflow-hidden text-ellipsis whitespace-nowrap [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]"
                  >
                    {{ stream.title }}
                  </div>
                </div>
                <div
                  class="absolute bottom-2 right-2.5 bg-black/55 text-white text-[10.5px] font-[JetBrains_Mono] px-1.5 py-0.5 rounded"
                >
                  {{ stream.duration }}
                </div>
                <div
                  v-if="!stream.transcribed"
                  class="absolute top-2 left-2 bg-yellow-100 text-yellow-800 text-[10px] font-semibold px-[7px] py-0.5 rounded-[10px] border border-yellow-200"
                >
                  not indexed
                </div>
              </div>
              <div class="p-3 pb-3.5">
                <div
                  class="text-[13.5px] font-semibold text-koyori-ink truncate mb-1.5 max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {{ stream.title }}
                </div>
                <div class="flex items-center gap-2.5 mb-2">
                  <span class="text-[12px] text-koyori-ink-3">{{
                    stream.date
                  }}</span>
                  <span
                    v-if="stream.transcribed"
                    class="text-[12px] text-koyori-emerald-600 flex items-center gap-0.5"
                  >
                    <i class="pi pi-star-fill text-[11px]"></i>
                    {{ t("lib.moments", { n: stream.moments }) }}
                  </span>
                </div>
                <div class="flex gap-1.5 flex-wrap">
                  <span
                    v-for="tag in stream.tags.slice(0, 3)"
                    :key="tag"
                    class="text-[11px] px-[7px] py-0.5 rounded-[10px] bg-koyori-surface-2 text-koyori-ink-3 border border-koyori-border"
                    >#{{ tag }}</span
                  >
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- List view -->
        <div v-else class="flex flex-col gap-1.5">
          <NuxtLink
            v-for="stream in filteredStreams"
            :key="stream.id"
            :to="`/streams/${stream.id}`"
            class="no-underline text-inherit"
          >
            <div
              class="border border-koyori-border rounded-[10px] px-4 py-3 flex items-center gap-3.5 cursor-pointer transition-all duration-150 hover:shadow-koyori-sm hover:border-koyori-border-2"
            >
              <div
                class="w-22 h-12 rounded-[6px] shrink-0 relative"
                :style="{
                  background: stream.thumbnail_url
                    ? `url(${stream.thumbnail_url}) center/cover`
                    : useToneGradient(stream.tone),
                }"
              >
                <div
                  v-if="!stream.transcribed"
                  class="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-400 border border-white"
                ></div>
              </div>
              <div class="flex-1 min-w-0">
                <div
                  class="text-[13.5px] font-semibold text-koyori-ink max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {{ stream.title }}
                </div>
                <div
                  class="text-[12px] text-koyori-ink-3 mt-0.5 font-[JetBrains_Mono]"
                >
                  {{ stream.date
                  }}<template v-if="stream.duration">
                    · {{ stream.duration }}</template
                  >
                </div>
              </div>
              <div class="flex gap-1 shrink-0">
                <span
                  v-for="tag in stream.tags.slice(0, 2)"
                  :key="tag"
                  class="text-[11px] px-[7px] py-0.5 rounded-[10px] bg-koyori-surface-2 text-koyori-ink-3"
                  >#{{ tag }}</span
                >
              </div>
              <div class="shrink-0">
                <span
                  v-if="stream.transcribed"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11.5px] font-medium bg-koyori-emerald-50 text-koyori-emerald-700 border border-koyori-emerald-200"
                >
                  <i class="pi pi-check-circle text-[11px]"></i
                  >{{ t("lib.indexed") }}
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11.5px] font-medium bg-amber-50 text-amber-700 border border-amber-200"
                  >pending</span
                >
              </div>
              <i
                class="pi pi-chevron-right text-[12px] text-koyori-ink-4 shrink-0"
              ></i>
            </div>
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import { useToneGradient } from "~/composables/koyori-data";
import { useStreams } from "~/composables/api";
import { formatDuration } from "~/utils/duration";

definePageMeta({ layout: "koyori" });

const { t } = useI18n();

const viewMode = ref<"grid" | "list">("grid");
const searchQuery = ref("");
// const selectedTopic = ref<string | null>(null);
// const selectedTag = ref<string | null>(null);
const sortOrder = ref<"newest" | "oldest">("newest");
const devState = ref("Default");

const {
  data: streamsData,
  isLoading,
  isError,
  refetch,
} = useStreams(sortOrder, searchQuery);

const refresh = () => refetch();

const streams = computed(() =>
  (streamsData.value?.data ?? []).map((s) => ({
    id: s.id,
    title: s.title,
    date: dayjs(s.streamed_at).format("YYYY-MM-DD"),
    duration: formatDuration(s.duration_seconds ?? 0),
    tone: "pink",
    tags: [] as string[],
    topics: [] as string[],
    transcribed: s.transcription_status === "completed",
    moments: 0,
    thumbnail_url: s.thumbnail_url,
  })),
);

// function toggleTopic(id: string) {
//   selectedTopic.value = selectedTopic.value === id ? null : id;
// }

// function toggleTag(tag: string) {
//   selectedTag.value = selectedTag.value === tag ? null : tag;
// }

// function toneClass(tone: string): string {
//   const classes: Record<string, string> = {
//     pink: "text-koyori-pink-500",
//     mint: "text-koyori-emerald-400",
//     sage: "text-green-500",
//     sky: "text-blue-500",
//     lavender: "text-violet-600",
//     peach: "text-orange-500",
//   };
//   return classes[tone] ?? "text-koyori-pink-500";
// }

const filteredStreams = computed(() => {
  if (devState.value === "Empty") return [];
  return streams.value;
});
</script>

<i18n lang="json">
{
  "en": {
    "nav.library": "Library",
    "dummy": "⚠️ Dummy data",
    "btn.add_stream": "Add stream",
    "lib.browse_topic": "Browse by topic",
    "lib.tags": "Tags:",
    "lib.newest": "Newest",
    "lib.oldest": "Oldest",
    "lib.indexed": "indexed",
    "lib.moments": "{n} moments"
  },
  "ja": {
    "nav.library": "ライブラリ",
    "dummy": "⚠️ ダミーデータ",
    "btn.add_stream": "配信を追加",
    "lib.browse_topic": "トピックで探す",
    "lib.tags": "タグ:",
    "lib.newest": "新しい順",
    "lib.oldest": "古い順",
    "lib.indexed": "インデックス済み",
    "lib.moments": "{n}個のモーメント"
  }
}
</i18n>
