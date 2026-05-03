<template>
  <div class="flex flex-col min-h-full">
    <!-- Topbar -->
    <div class="flex items-center justify-between px-8 py-4 border-b border-koyori-border bg-white sticky top-0 z-10 shrink-0">
      <div>
        <div class="flex items-center gap-1.5 text-[12px] text-koyori-ink-3 mb-1">
          <NuxtLink to="/" class="text-koyori-ink-3 hover:text-koyori-ink no-underline">Library</NuxtLink>
          <i class="pi pi-chevron-right text-[10px]"></i>
          <span class="text-koyori-ink max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">{{ stream?.title }}</span>
        </div>
        <h2 class="text-[18px] font-bold text-koyori-ink m-0 leading-tight max-w-[480px] overflow-hidden text-ellipsis whitespace-nowrap">{{ stream?.title }}</h2>
        <p class="text-[13px] text-koyori-ink-3 m-0 mt-0.5 font-[JetBrains_Mono]">{{ stream?.duration }}</p>
      </div>
      <div class="flex gap-2 items-center relative">
        <PGhostButton icon="pi pi-ellipsis-h" size="small" aria-label="More" @click="showMoreMenu = !showMoreMenu" />
        <!-- Dropdown menu -->
        <div v-if="showMoreMenu" class="absolute right-0 top-full mt-1 bg-white border border-koyori-border rounded-[10px] shadow-koyori-lg p-1.5 min-w-[220px] z-50">
          <template v-for="item in moreMenuItems" :key="item.label || 'divider'">
            <div v-if="item.divider" class="border-t border-koyori-border my-1"></div>
            <button
              v-else
              @click="handleMoreMenu(item)"
              class="flex items-center gap-2 w-full px-2.5 py-2 rounded-[6px] border-none bg-transparent cursor-pointer text-[13px] text-koyori-ink-2 font-[inherit] hover:bg-koyori-surface-2"
            >
              <i :class="item.icon" class="text-[13px] text-koyori-ink-3"></i>
              <span>{{ item.label }}</span>
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 px-8 py-6 max-w-[1100px] w-full">
      <div class="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-[12.5px] font-medium px-3 py-2 rounded-lg mb-5">
        <i class="pi pi-exclamation-triangle text-[13px]"></i>
        Showing dummy data — backend not yet connected
      </div>

      <!-- Loading state -->
      <template v-if="devState === 'Loading'">
        <div class="flex gap-6 mb-7">
          <div class="bg-gradient-to-r from-koyori-surface-2 via-koyori-surface-3 to-koyori-surface-2 bg-[size:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] w-[380px] h-[214px] rounded-xl shrink-0"></div>
          <div class="flex-1 flex flex-col gap-3 pt-1">
            <div class="bg-gradient-to-r from-koyori-surface-2 via-koyori-surface-3 to-koyori-surface-2 bg-[size:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-7 w-[80%] rounded-[6px]"></div>
            <div class="bg-gradient-to-r from-koyori-surface-2 via-koyori-surface-3 to-koyori-surface-2 bg-[size:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-4 w-[50%] rounded-[6px]"></div>
            <div class="bg-gradient-to-r from-koyori-surface-2 via-koyori-surface-3 to-koyori-surface-2 bg-[size:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-20 w-full rounded-lg"></div>
          </div>
        </div>
        <div class="flex gap-2.5 mb-5">
          <div class="bg-gradient-to-r from-koyori-surface-2 via-koyori-surface-3 to-koyori-surface-2 bg-[size:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-5 w-[90px] rounded-full"></div>
          <div class="bg-gradient-to-r from-koyori-surface-2 via-koyori-surface-3 to-koyori-surface-2 bg-[size:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-5 w-[90px] rounded-full"></div>
          <div class="bg-gradient-to-r from-koyori-surface-2 via-koyori-surface-3 to-koyori-surface-2 bg-[size:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-5 w-[90px] rounded-full"></div>
        </div>
        <div class="bg-gradient-to-r from-koyori-surface-2 via-koyori-surface-3 to-koyori-surface-2 bg-[size:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-[200px] rounded-xl"></div>
      </template>

      <!-- Error state -->
      <template v-else-if="devState === 'Error'">
        <div class="bg-red-50 border border-red-200 rounded-xl p-5 mb-5">
          <div class="flex items-center gap-2 mb-2">
            <i class="pi pi-exclamation-circle text-red-600"></i>
            <span class="font-semibold text-red-800">Transcription failed</span>
          </div>
          <pre class="bg-red-100 rounded-lg p-3 text-[12px] text-red-900 m-0 font-[JetBrains_Mono] overflow-x-auto">Audio decoding failed at 12:34 (corrupt segment)
  Error: Invalid audio frame header at byte offset 0x1A4F2
  Stack trace: decode_frame() → process_chunk() → run()</pre>
          <div class="flex gap-2 mt-3.5">
            <PButton label="Retry" icon="pi pi-refresh" size="small" />
            <PSecondaryButton label="Re-fetch audio" icon="pi pi-download" size="small" />
          </div>
        </div>
      </template>

      <!-- Not transcribed state -->
      <template v-else-if="devState === 'Not transcribed' || (!stream?.transcribed && devState === 'Default')">
        <!-- Hero -->
        <div class="flex gap-6 mb-7">
          <div
            class="w-[380px] h-[214px] rounded-xl shrink-0 relative"
            :style="{ background: useToneGradient(stream?.tone || 'pink') }"
          >
            <div class="absolute bottom-3 right-3 bg-black/55 text-white text-[12px] font-[JetBrains_Mono] px-2 py-0.5 rounded-[5px]">{{ stream?.duration }}</div>
          </div>
          <div class="flex-1">
            <div class="mb-3.5">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11.5px] font-medium bg-amber-50 text-amber-700 border border-amber-200 mb-2.5">
                <i class="pi pi-clock text-[11px]"></i> not transcribed yet · {{ stream?.queueEta || 'queued' }}
              </span>
            </div>
            <div class="text-[15px] font-bold text-koyori-ink mb-1.5 max-w-full line-clamp-2 overflow-hidden">{{ stream?.title }}</div>
            <div class="text-[13px] text-koyori-ink-3 mb-3 font-[JetBrains_Mono]">{{ stream?.date }} · {{ stream?.duration }}</div>
            <div class="flex gap-1.5 flex-wrap mb-4">
              <span v-for="tag in stream?.tags" :key="tag" class="text-[11px] px-2 py-0.5 rounded-[10px] bg-koyori-surface-2 text-koyori-ink-3">#{{ tag }}</span>
            </div>
            <NuxtLink to="/jobs">
              <PButton label="Start transcription" icon="pi pi-play" size="small" />
            </NuxtLink>
          </div>
        </div>
        <!-- Preview skeleton -->
        <div class="bg-white border border-koyori-border rounded-xl p-5 relative overflow-hidden">
          <div class="text-[13px] font-semibold text-koyori-ink-3 mb-3.5">Preview (available after processing)</div>
          <div class="flex flex-col gap-2">
            <div class="bg-gradient-to-r from-koyori-surface-2 via-koyori-surface-3 to-koyori-surface-2 bg-[size:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-3.5 w-[95%] rounded"></div>
            <div class="bg-gradient-to-r from-koyori-surface-2 via-koyori-surface-3 to-koyori-surface-2 bg-[size:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-3.5 w-[80%] rounded"></div>
            <div class="bg-gradient-to-r from-koyori-surface-2 via-koyori-surface-3 to-koyori-surface-2 bg-[size:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-3.5 w-[88%] rounded"></div>
            <div class="bg-gradient-to-r from-koyori-surface-2 via-koyori-surface-3 to-koyori-surface-2 bg-[size:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-3.5 w-[60%] rounded"></div>
          </div>
          <!-- Gradient fade -->
          <div class="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-white to-transparent"></div>
        </div>
      </template>

      <!-- Regenerating sub-state -->
      <template v-else-if="devState === 'Regenerating'">
        <!-- Keep hero -->
        <div class="flex gap-6 mb-7">
          <div
            class="w-[380px] h-[214px] rounded-xl shrink-0 relative"
            :style="{ background: useToneGradient(stream?.tone || 'pink') }"
          >
            <div class="absolute bottom-3 right-3 bg-black/55 text-white text-[12px] font-[JetBrains_Mono] px-2 py-0.5 rounded-[5px]">{{ stream?.duration }}</div>
          </div>
          <div class="flex-1">
            <div class="text-[15px] font-bold text-koyori-ink mb-1.5 max-w-full line-clamp-2 overflow-hidden">{{ stream?.title }}</div>
            <div class="text-[13px] text-koyori-ink-3 mb-3 font-[JetBrains_Mono]">{{ stream?.date }} · {{ stream?.duration }}</div>
            <div class="flex gap-1.5 flex-wrap">
              <span v-for="tag in stream?.tags" :key="tag" class="text-[11px] px-2 py-0.5 rounded-[10px] bg-koyori-surface-2 text-koyori-ink-3">#{{ tag }}</span>
            </div>
          </div>
        </div>
        <!-- Progress card -->
        <div class="bg-white border border-koyori-border rounded-xl shadow-koyori-sm p-5 mb-4">
          <div class="text-[14px] font-semibold text-koyori-ink mb-4">Re-processing…</div>
          <div class="flex flex-col gap-2.5">
            <div v-for="stage in regenStages" :key="stage.name" class="flex items-center gap-2.5">
              <div
                class="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
                :class="{
                  'bg-koyori-emerald-400': stage.status === 'done',
                  'bg-koyori-pink-400': stage.status === 'active',
                  'bg-koyori-surface-3': stage.status === 'pending',
                }"
              >
                <i v-if="stage.status === 'done'" class="pi pi-check text-[10px] text-white"></i>
                <div v-else-if="stage.status === 'active'" class="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              </div>
              <span
                class="text-[13px]"
                :class="stage.status === 'active' ? 'text-koyori-ink font-semibold' : stage.status === 'pending' ? 'text-koyori-ink-4 font-normal' : 'text-koyori-ink font-normal'"
              >
                {{ stage.name }}
                <span v-if="stage.status === 'active'" class="text-koyori-pink-500 text-[12px]"> · 42%</span>
              </span>
            </div>
          </div>
        </div>
        <div class="bg-gradient-to-r from-koyori-surface-2 via-koyori-surface-3 to-koyori-surface-2 bg-[size:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-[180px] rounded-xl"></div>
      </template>

      <!-- Default (transcribed) state -->
      <template v-else>
        <!-- Hero -->
        <div class="flex gap-6 mb-7">
          <div
            class="w-[380px] h-[214px] rounded-xl shrink-0 relative"
            :style="{ background: useToneGradient(stream?.tone || 'pink') }"
          >
            <div class="absolute bottom-3 right-3 bg-black/55 text-white text-[12px] font-[JetBrains_Mono] px-2 py-0.5 rounded-[5px]">{{ stream?.duration }}</div>
          </div>
          <div class="flex-1">
            <div class="mb-2.5">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11.5px] font-medium bg-koyori-emerald-50 text-koyori-emerald-700 border border-koyori-emerald-200 mb-2.5">
                <i class="pi pi-check-circle text-[11px]"></i> indexed
              </span>
            </div>
            <div class="text-[15px] font-bold text-koyori-ink mb-1.5 max-w-full line-clamp-2 overflow-hidden">{{ stream?.title }}</div>
            <div class="text-[13px] text-koyori-ink-3 mb-3 font-[JetBrains_Mono]">{{ stream?.date }} · {{ stream?.duration }}</div>
            <div class="flex gap-1.5 flex-wrap mb-4">
              <span v-for="tag in stream?.tags" :key="tag" class="text-[11px] px-2 py-0.5 rounded-[10px] bg-koyori-surface-2 text-koyori-ink-3">#{{ tag }}</span>
            </div>
            <div class="flex gap-2">
              <PButton label="Open on YouTube" icon="pi pi-external-link" size="small" />
              <NuxtLink :to="`/streams/${streamId}/transcript`">
                <PSecondaryButton label="View transcript" icon="pi pi-align-left" size="small" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-koyori-border mb-5">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="px-4 py-2.5 text-[13.5px] font-medium text-koyori-ink-3 border-b-2 border-transparent -mb-px cursor-pointer bg-transparent font-[inherit] transition-colors duration-150 border-none"
            :class="{ '!text-koyori-pink-600 !border-koyori-pink-500': activeTab === tab.id }"
            @click="activeTab = tab.id"
          >{{ tab.label }}</button>
        </div>

        <!-- Summary tab -->
        <div v-if="activeTab === 'summary'">
          <div class="flex gap-6">
            <div class="flex-1">
              <div class="text-[15px] font-semibold text-koyori-ink mb-2.5">TL;DR</div>
              <p class="text-[14px] text-koyori-ink-2 leading-relaxed mb-5">{{ stream?.summary }}</p>
              <div class="text-[11px] font-semibold text-koyori-ink-3 mb-2 uppercase tracking-[0.04em]">Key moments</div>
              <ul class="p-0 m-0 list-none flex flex-col gap-1.5">
                <li
                  v-for="m in DUMMY_MOMENTS.filter(x => x.type === 'highlight').slice(0, 4)"
                  :key="m.t"
                  class="flex items-start gap-2 text-[13.5px] text-koyori-ink-2 leading-snug"
                >
                  <span class="font-[JetBrains_Mono] text-[12px] text-koyori-pink-500 pt-px shrink-0">{{ m.t }}</span>
                  <span>{{ m.label }}</span>
                </li>
              </ul>
            </div>
            <!-- Quick stats sidebar -->
            <div class="w-[200px] shrink-0 flex flex-col gap-2.5">
              <div class="bg-white border border-koyori-border rounded-xl shadow-koyori-sm p-3.5">
                <div class="text-[11px] text-koyori-ink-4 uppercase tracking-[0.04em] mb-1">Duration</div>
                <div class="text-[18px] font-bold text-koyori-ink font-[JetBrains_Mono]">{{ stream?.duration }}</div>
              </div>
              <div class="bg-white border border-koyori-border rounded-xl shadow-koyori-sm p-3.5">
                <div class="text-[11px] text-koyori-ink-4 uppercase tracking-[0.04em] mb-1">Moments</div>
                <div class="text-[18px] font-bold text-koyori-ink font-[JetBrains_Mono]">{{ stream?.moments }}</div>
              </div>
              <div class="bg-white border border-koyori-border rounded-xl shadow-koyori-sm p-3.5">
                <div class="text-[11px] text-koyori-ink-4 uppercase tracking-[0.04em] mb-1">Topics</div>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span
                    v-for="topic in stream?.topics"
                    :key="topic"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11.5px] font-medium bg-koyori-pink-100 text-koyori-pink-700 border border-koyori-pink-200"
                  >{{ topic }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Moments tab -->
        <div v-else-if="activeTab === 'moments'" class="flex flex-col gap-2">
          <div
            v-for="moment in DUMMY_MOMENTS"
            :key="moment.t"
            class="bg-white border border-koyori-border rounded-xl shadow-koyori-sm px-4 py-3.5 flex items-center gap-3.5"
          >
            <span class="font-[JetBrains_Mono] text-[12.5px] text-koyori-pink-500 shrink-0 w-[70px]">{{ moment.t }}</span>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11.5px] font-medium shrink-0"
              :class="moment.type === 'highlight' ? 'bg-koyori-pink-100 text-koyori-pink-700 border border-koyori-pink-200' : moment.type === 'intro' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-koyori-surface-2 text-koyori-ink-3 border border-koyori-border'"
            >{{ moment.type }}</span>
            <span class="flex-1 text-[13.5px] text-koyori-ink overflow-hidden text-ellipsis whitespace-nowrap max-w-full">{{ moment.label }}</span>
            <!-- Score bar -->
            <div class="w-20 shrink-0">
              <div class="h-1 bg-koyori-surface-3 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-koyori-pink-400 to-koyori-pink-500 rounded-full"
                  :style="{ width: `${moment.score * 100}%` }"
                ></div>
              </div>
              <div class="text-right text-[11px] text-koyori-ink-3 mt-0.5">{{ (moment.score * 100).toFixed(0) }}%</div>
            </div>
            <PGhostButton icon="pi pi-star" size="small" aria-label="Star" class="shrink-0" />
            <PGhostButton icon="pi pi-external-link" size="small" aria-label="Jump" class="shrink-0" />
          </div>
        </div>

        <!-- Chapters tab -->
        <div v-else-if="activeTab === 'chapters'" class="flex flex-col gap-1.5">
          <div
            v-for="(chapter, i) in DUMMY_CHAPTERS"
            :key="chapter.t"
            class="flex items-center gap-3.5 px-4 py-3 bg-white border border-koyori-border rounded-[10px]"
          >
            <span class="text-[12px] text-koyori-ink-4 w-5 text-right shrink-0">{{ i + 1 }}</span>
            <span class="font-[JetBrains_Mono] text-[12.5px] text-koyori-pink-500 shrink-0 w-[70px]">{{ chapter.t }}</span>
            <span class="flex-1 text-[13.5px] text-koyori-ink overflow-hidden text-ellipsis whitespace-nowrap">{{ chapter.label }}</span>
            <span class="text-[12px] text-koyori-ink-4 shrink-0 font-[JetBrains_Mono]">{{ chapter.dur }}</span>
          </div>
        </div>
      </template>
    </div>

    <!-- Dev state switcher -->
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white border border-koyori-border rounded-full px-3 py-1.5 shadow-koyori-md z-50">
      <span class="text-[11px] text-koyori-ink-3 font-medium mr-1">View state:</span>
      <button
        v-for="s in states"
        :key="s"
        @click="devState = s"
        class="px-2.5 py-1 rounded-full text-[11px] text-koyori-ink-3 bg-transparent border-none cursor-pointer font-[inherit] transition-all duration-150"
        :class="devState === s && '!bg-koyori-pink-100 !text-koyori-pink-700 !font-semibold'"
      >{{ s }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DUMMY_STREAMS, DUMMY_MOMENTS, DUMMY_CHAPTERS, useToneGradient } from '~/composables/koyori-data'

definePageMeta({ layout: 'koyori' })

const route = useRoute()
const router = useRouter()
const streamId = computed(() => route.params.id as string)
const stream = computed(() => DUMMY_STREAMS.find(s => s.id === streamId.value) ?? DUMMY_STREAMS[0])

const devState = ref('Default')
const states = ['Default', 'Loading', 'Not transcribed', 'Error', 'Regenerating']
const activeTab = ref('summary')
const showMoreMenu = ref(false)

const tabs = computed(() => [
  { id: 'summary', label: 'Summary' },
  { id: 'moments', label: `Moments · ${stream.value?.moments ?? 0}` },
  { id: 'chapters', label: 'Chapters' },
])

const regenStages = [
  { name: 'Re-fetching audio', status: 'done' },
  { name: 'Transcribing', status: 'active' },
  { name: 'Summarizing', status: 'pending' },
  { name: 'Detecting moments', status: 'pending' },
]

const moreMenuItems = [
  { label: 'Regenerate transcription…', icon: 'pi pi-refresh' },
  { label: 'Download transcript', icon: 'pi pi-download' },
  { label: 'Copy stream link', icon: 'pi pi-link' },
  { divider: true, label: '', icon: '' },
  { label: 'Edit tags', icon: 'pi pi-tag' },
]

function handleMoreMenu(item: { label: string; icon: string; divider?: boolean }) {
  showMoreMenu.value = false
  if (item.label === 'Regenerate transcription…') {
    devState.value = 'Regenerating'
  }
}
</script>
