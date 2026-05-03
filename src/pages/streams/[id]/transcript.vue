<template>
  <div class="flex flex-col min-h-full">
    <!-- Topbar -->
    <div class="flex items-center justify-between px-8 py-4 border-b border-koyori-border bg-white sticky top-0 z-10 shrink-0">
      <div>
        <div class="flex items-center gap-1.5 text-[12px] text-koyori-ink-3 mb-1">
          <NuxtLink to="/" class="text-koyori-ink-3 hover:text-koyori-ink no-underline">Library</NuxtLink>
          <i class="pi pi-chevron-right text-[10px]"></i>
          <NuxtLink :to="`/streams/${streamId}`" class="text-koyori-ink-3 hover:text-koyori-ink no-underline max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap inline-block">{{ stream?.title }}</NuxtLink>
          <i class="pi pi-chevron-right text-[10px]"></i>
          <span class="text-koyori-ink">Transcript</span>
        </div>
        <h2 class="text-[18px] font-bold text-koyori-ink m-0 leading-tight">Transcript</h2>
        <p class="text-[13px] text-koyori-ink-3 m-0 mt-0.5">{{ stream?.title }}</p>
      </div>
      <div class="flex gap-2 items-center">
        <PGhostButton label=".srt" icon="pi pi-download" size="small" />
        <PGhostButton label=".txt" icon="pi pi-download" size="small" />
        <NuxtLink :to="`/streams/${streamId}/transcript-edit`">
          <PButton label="Edit" icon="pi pi-pencil" size="small" />
        </NuxtLink>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 px-8 py-6 max-w-[900px] w-full">
      <div class="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-[12.5px] font-medium px-3 py-2 rounded-lg mb-5">
        <i class="pi pi-exclamation-triangle text-[13px]"></i>
        Showing dummy transcript — backend not yet connected
      </div>

      <!-- Search + speaker filter -->
      <div class="flex items-center gap-3 mb-5 flex-wrap">
        <div class="flex-1 relative max-w-[320px]">
          <i class="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-koyori-ink-4 text-[13px] pointer-events-none"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search in transcript..."
            class="w-full pl-8 py-2 pr-2.5 border border-koyori-border rounded-lg text-[13px] bg-white outline-none text-koyori-ink font-[inherit] box-border"
          />
        </div>
        <!-- Speaker filter segmented -->
        <div class="flex bg-koyori-surface-2 rounded-full p-0.5 gap-0.5">
          <button
            v-for="spk in speakerFilters"
            :key="spk.id"
            class="px-3 py-1 rounded-full text-[12px] bg-transparent border-none cursor-pointer font-[inherit] transition-all duration-150"
            :class="activeSpeaker === spk.id ? '!bg-white !text-koyori-ink !font-semibold shadow-koyori-sm' : 'text-koyori-ink-3'"
            @click="activeSpeaker = spk.id"
          >{{ spk.label }} <span class="opacity-60 text-[11px]">{{ spk.count }}</span></button>
        </div>
      </div>

      <!-- Transcript lines -->
      <div class="flex flex-col gap-px">
        <div
          v-for="line in filteredLines"
          :key="line.t"
          class="flex items-start gap-3 px-2.5 py-2 rounded-lg transition-colors duration-100 hover:bg-koyori-surface-2"
        >
          <!-- Timestamp -->
          <span class="font-[JetBrains_Mono] text-[12px] text-koyori-pink-500 shrink-0 w-[70px] pt-0.5 cursor-pointer">{{ line.t }}</span>
          <!-- Speaker chip -->
          <span
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11.5px] font-medium shrink-0 min-w-[60px] justify-center"
            :class="line.speaker === 'koyori' ? 'bg-koyori-pink-100 text-koyori-pink-700 border border-koyori-pink-200' : 'bg-koyori-surface-2 text-koyori-ink-3 border border-koyori-border'"
          >{{ line.speaker }}</span>
          <!-- Text -->
          <span
            class="flex-1 text-[14px] leading-relaxed"
            :class="line.speaker === 'unknown' ? 'text-koyori-ink-3 italic' : 'text-koyori-ink'"
          >{{ line.text }}</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center py-6 pb-2 italic text-[13px] text-koyori-ink-4">
        … 232 more lines · scroll to load
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { DUMMY_STREAMS, DUMMY_TRANSCRIPT } from '~/composables/koyori-data'

definePageMeta({ layout: 'koyori' })

const route = useRoute()
const streamId = computed(() => route.params.id as string)
const stream = computed(() => DUMMY_STREAMS.find(s => s.id === streamId.value) ?? DUMMY_STREAMS[0])

const searchQuery = ref('')
const activeSpeaker = ref('all')

const koyoriCount = computed(() => DUMMY_TRANSCRIPT.filter(l => l.speaker === 'koyori').length)
const unknownCount = computed(() => DUMMY_TRANSCRIPT.filter(l => l.speaker === 'unknown').length)

const speakerFilters = computed(() => [
  { id: 'all', label: 'All', count: DUMMY_TRANSCRIPT.length },
  { id: 'koyori', label: 'koyori', count: koyoriCount.value },
  { id: 'unknown', label: 'unknown', count: unknownCount.value },
])

const filteredLines = computed(() => {
  let lines = DUMMY_TRANSCRIPT
  if (activeSpeaker.value !== 'all') {
    lines = lines.filter(l => l.speaker === activeSpeaker.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    lines = lines.filter(l => l.text.toLowerCase().includes(q))
  }
  return lines
})
</script>
