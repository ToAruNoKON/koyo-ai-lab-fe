<template>
  <div class="flex flex-col min-h-full">
    <!-- Topbar -->
    <div class="flex items-center justify-between px-8 py-4 border-b border-koyori-border bg-white sticky top-0 z-10 shrink-0">
      <div>
        <div class="flex items-center gap-1.5 text-[12px] text-koyori-ink-3 mb-1">
          <NuxtLink to="/jobs" class="text-koyori-ink-3 hover:text-koyori-ink no-underline">Jobs</NuxtLink>
          <i class="pi pi-chevron-right text-[10px]"></i>
          <span class="text-koyori-ink">Job detail</span>
        </div>
        <h2 class="text-[18px] font-bold text-koyori-ink m-0 leading-tight max-w-[480px] overflow-hidden text-ellipsis whitespace-nowrap">{{ job?.stream }}</h2>
        <p class="text-[13px] text-koyori-ink-3 m-0 mt-0.5">{{ job?.stage }}</p>
      </div>
      <div class="flex gap-2 items-center">
        <PButton v-if="job?.stage === 'failed'" label="Retry" icon="pi pi-refresh" size="small" />
        <PDangerButton
          v-else-if="job?.stage === 'transcribing' || job?.stage === 'summarizing' || job?.stage === 'queued'"
          label="Cancel job"
          icon="pi pi-times"
          size="small"
          @click="cancelDialogVisible = true"
        />
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 p-6 px-8 max-w-[900px] w-full">
      <div class="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-[12.5px] font-medium px-3 py-2 rounded-lg mb-5">
        <i class="pi pi-exclamation-triangle text-[13px]"></i>
        Showing dummy data — backend not yet connected
      </div>

      <!-- Pipeline card -->
      <div class="bg-white border border-koyori-border rounded-xl shadow-koyori-sm p-5 mb-5">
        <div class="text-[11px] font-semibold text-koyori-ink-3 mb-4 uppercase tracking-[0.04em]">Pipeline</div>
        <div class="grid grid-cols-4 gap-2.5">
          <div
            v-for="(step, i) in pipelineSteps"
            :key="step.name"
            class="relative p-3.5 rounded-[10px]"
            :class="{
              'border-[1.5px] border-koyori-pink-300 bg-koyori-pink-50': step.status === 'active',
              'border border-koyori-border bg-koyori-emerald-50': step.status === 'done',
              'border border-koyori-border bg-koyori-surface-2': step.status === 'pending',
            }"
          >
            <!-- Connector -->
            <div
              v-if="i < pipelineSteps.length - 1"
              class="absolute -right-[5px] top-1/2 -translate-y-1/2 z-10 text-koyori-ink-4 text-[11px]"
            >
              <i class="pi pi-chevron-right"></i>
            </div>
            <!-- Status icon -->
            <div
              class="w-7 h-7 rounded-full mb-2 flex items-center justify-center"
              :class="{
                'bg-koyori-emerald-400': step.status === 'done',
                'bg-koyori-pink-400': step.status === 'active',
                'bg-koyori-surface-3': step.status === 'pending',
              }"
            >
              <i v-if="step.status === 'done'" class="pi pi-check text-[12px] text-white"></i>
              <i v-else-if="step.status === 'active'" class="pi pi-spin pi-spinner text-[12px] text-white"></i>
              <span v-else class="text-[11px] text-koyori-ink-4 font-semibold">{{ i + 1 }}</span>
            </div>
            <div
              class="text-[12.5px] font-semibold mb-0.5"
              :class="step.status === 'pending' ? 'text-koyori-ink-4' : 'text-koyori-ink'"
            >{{ step.name }}</div>
            <div
              class="text-[11px]"
              :class="step.status === 'active' ? 'text-koyori-pink-600' : 'text-koyori-ink-4'"
            >
              <template v-if="step.status === 'done'">Done</template>
              <template v-else-if="step.status === 'active'">{{ (job?.progress ?? 0 * 100).toFixed(0) }}% · ETA {{ job?.eta }}</template>
              <template v-else>Pending</template>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress card (if active) -->
      <div v-if="job?.stage === 'transcribing' || job?.stage === 'summarizing'" class="bg-white border border-koyori-border rounded-xl shadow-koyori-sm p-5 mb-5">
        <div class="flex justify-between items-center mb-3">
          <div class="text-[13.5px] font-semibold text-koyori-ink">Progress</div>
          <span class="font-[JetBrains_Mono] text-[13px] text-koyori-pink-500">{{ ((job?.progress ?? 0) * 100).toFixed(0) }}%</span>
        </div>
        <div class="h-1 bg-koyori-surface-3 rounded-full overflow-hidden mb-4">
          <div
            class="h-full bg-gradient-to-r from-koyori-pink-400 to-koyori-pink-500 rounded-full"
            :style="{ width: `${(job?.progress ?? 0) * 100}%` }"
          ></div>
        </div>
        <!-- Live log -->
        <div class="bg-koyori-surface-2 rounded-lg p-3 font-[JetBrains_Mono] text-[12px] text-koyori-ink-2 max-h-[140px] overflow-y-auto">
          <div
            v-for="(line, i) in liveLogs"
            :key="i"
            class="mb-0.5"
            :class="line.type === 'success' ? 'text-koyori-emerald-600' : line.type === 'error' ? 'text-red-600' : 'text-koyori-ink-2'"
          >
            <span class="text-koyori-ink-4 mr-2">{{ line.t }}</span>{{ line.text }}
          </div>
        </div>
      </div>

      <!-- Error banner (if failed) -->
      <div v-if="job?.stage === 'failed'" class="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-5">
        <div class="flex items-center gap-2 mb-2">
          <i class="pi pi-exclamation-circle text-red-600"></i>
          <span class="font-semibold text-red-800 text-[14px]">Job failed</span>
        </div>
        <pre class="bg-red-100 rounded-lg p-3 text-[12px] text-red-900 m-0 font-[JetBrains_Mono] overflow-x-auto">{{ job.error }}</pre>
      </div>

      <!-- Job meta card -->
      <div class="bg-white border border-koyori-border rounded-xl shadow-koyori-sm p-5">
        <div class="text-[11px] font-semibold uppercase tracking-[0.06em] text-koyori-ink-4 mb-3.5">Job details</div>
        <div class="grid grid-cols-2 gap-3.5">
          <div v-for="meta in jobMeta" :key="meta.label">
            <div class="text-[11px] text-koyori-ink-4 mb-0.5 uppercase tracking-[0.03em]">{{ meta.label }}</div>
            <div class="text-[13.5px] text-koyori-ink font-[JetBrains_Mono] overflow-hidden text-ellipsis whitespace-nowrap">{{ meta.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel dialog -->
    <div
      v-if="cancelDialogVisible"
      class="fixed inset-0 bg-black/30 flex items-center justify-center z-[200] backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl p-7 max-w-[400px] w-[90%] shadow-koyori-lg">
        <div class="text-[17px] font-bold text-koyori-ink mb-2">Cancel this job?</div>
        <p class="text-[14px] text-koyori-ink-2 leading-relaxed m-0 mb-6">The processing pipeline will stop and any progress will be lost. You can restart it later.</p>
        <div class="flex gap-2.5 justify-end">
          <PGhostButton label="Keep running" @click="cancelDialogVisible = false" />
          <PDangerButton label="Cancel job" icon="pi pi-times" @click="confirmCancel" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DUMMY_JOBS } from '~/composables/koyori-data'

definePageMeta({ layout: 'koyori' })

const route = useRoute()
const router = useRouter()
const jobId = computed(() => route.params.id as string)
const job = computed(() => DUMMY_JOBS.find(j => j.id === jobId.value) ?? DUMMY_JOBS[0])

const cancelDialogVisible = ref(false)

const pipelineSteps = computed(() => {
  const stage = job.value?.stage ?? ''
  const afterTranscribe = stage === 'summarizing' || stage === 'done'
  return [
    { name: 'Fetch audio', status: stage === 'queued' ? 'pending' : 'done' },
    { name: 'Transcribe', status: stage === 'transcribing' ? 'active' : afterTranscribe ? 'done' : 'pending' },
    { name: 'Summarize', status: stage === 'summarizing' ? 'active' : stage === 'done' ? 'done' : 'pending' },
    { name: 'Index', status: stage === 'done' ? 'done' : 'pending' },
  ]
})

const liveLogs = [
  { t: '12:04:01', text: '[fetch] Audio stream downloaded (3.2 GB)', type: 'success' },
  { t: '12:04:05', text: '[transcribe] Model loaded: whisper-v3-large-ja', type: 'info' },
  { t: '12:04:12', text: '[transcribe] Processing chunk 1/8 (0:00:00 → 0:22:47)', type: 'info' },
  { t: '12:14:33', text: '[transcribe] Chunk 1 done · 142 lines', type: 'success' },
  { t: '12:14:38', text: '[transcribe] Processing chunk 2/8 (0:22:47 → 0:45:34)', type: 'info' },
  { t: '12:21:09', text: '[transcribe] Chunk 2 done · 118 lines', type: 'success' },
  { t: '12:21:14', text: '[transcribe] Processing chunk 3/8…', type: 'info' },
]

const jobMeta = computed(() => [
  { label: 'Job ID', value: job.value?.id ?? '-' },
  { label: 'Started', value: '2026-04-22 12:03:55' },
  { label: 'Source', value: 'youtube.com/watch?v=abc123' },
  { label: 'Duration', value: '4:48:02' },
  { label: 'Worker', value: 'worker-03.koyori.lab' },
  { label: 'Cost so far', value: '$0.42' },
])

function confirmCancel() {
  cancelDialogVisible.value = false
  router.push('/jobs')
}
</script>
