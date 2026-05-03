<template>
  <div class="flex flex-col min-h-full">
    <!-- Topbar -->
    <div class="flex items-center justify-between px-8 py-4 border-b border-koyori-border bg-white sticky top-0 z-10 shrink-0">
      <div>
        <h2 class="text-[18px] font-bold text-koyori-ink m-0 leading-tight">Jobs</h2>
        <p class="text-[13px] text-koyori-ink-3 m-0 mt-0.5">2 active · 1 queued [Dummy]</p>
      </div>
      <div class="flex gap-2">
        <NuxtLink to="/add">
          <PButton icon="pi pi-plus" label="Add stream" size="small" />
        </NuxtLink>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 p-6 px-8 max-w-[900px] w-full">
      <div class="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-[12.5px] font-medium px-3 py-2 rounded-lg mb-5">
        <i class="pi pi-exclamation-triangle text-[13px]"></i>
        Showing dummy data — backend not yet connected
      </div>

      <!-- Loading state -->
      <template v-if="devState === 'Loading'">
        <div class="flex flex-col gap-2">
          <div
            v-for="i in 5"
            :key="i"
            class="bg-gradient-to-r from-koyori-surface-2 via-koyori-surface-3 to-koyori-surface-2 bg-[size:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-16 rounded-[10px]"
          ></div>
        </div>
      </template>

      <!-- Error state -->
      <template v-else-if="devState === 'Error'">
        <div class="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
          <i class="pi pi-exclamation-circle text-[28px] text-red-600 block mb-2"></i>
          <div class="text-[14px] font-semibold text-red-800">Failed to load jobs</div>
        </div>
      </template>

      <!-- Empty state -->
      <template v-else-if="devState === 'Empty'">
        <div class="text-center py-[60px] px-5 text-koyori-ink-3">
          <i class="pi pi-check-circle text-[40px] block mb-3 text-koyori-emerald-400"></i>
          <div class="text-[16px] font-semibold text-koyori-ink-2 mb-1.5">No jobs running</div>
          <div class="text-[13px] mb-4">Add a stream to start processing</div>
          <NuxtLink to="/add">
            <PButton label="Add stream" icon="pi pi-plus" size="small" />
          </NuxtLink>
        </div>
      </template>

      <!-- Default state -->
      <template v-else>
        <!-- Active section -->
        <div class="mb-1.5">
          <div class="text-[11px] font-semibold uppercase tracking-[0.06em] text-koyori-ink-4 pb-2">
            Active · {{ activeJobs.length }}
          </div>
          <div class="flex flex-col gap-1.5">
            <div
              v-for="job in activeJobs"
              :key="job.id"
              class="bg-white border border-koyori-border rounded-[10px] px-4 py-3 flex items-center gap-3 transition-all duration-150 hover:shadow-koyori-sm hover:border-koyori-border-2"
            >
              <!-- Status dot -->
              <div class="shrink-0">
                <div
                  class="w-[10px] h-[10px] rounded-full"
                  :class="job.stage === 'queued' ? 'bg-amber-400' : 'bg-koyori-pink-400'"
                  :style="{
                    boxShadow: job.stage !== 'queued' ? '0 0 0 3px rgba(244,139,169,0.2)' : 'none',
                    animation: job.stage !== 'queued' ? 'pulse-ring 2s infinite' : 'none',
                  }"
                ></div>
              </div>
              <!-- Stream name -->
              <div class="flex-1 min-w-0">
                <div class="text-[13.5px] font-semibold text-koyori-ink truncate">
                  {{ job.stream }}
                </div>
                <div class="mt-1.5" v-if="job.stage !== 'queued'">
                  <div class="h-1 bg-koyori-surface-3 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-koyori-pink-400 to-koyori-pink-500 rounded-full"
                      :style="{ width: `${job.progress * 100}%` }"
                    ></div>
                  </div>
                </div>
                <div v-else class="text-[12px] text-koyori-ink-4 mt-0.5">
                  In queue
                </div>
              </div>
              <!-- Stage chip -->
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11.5px] font-medium shrink-0"
                :class="job.stage === 'queued' ? 'bg-koyori-surface-2 text-koyori-ink-3 border border-koyori-border' : 'bg-koyori-pink-100 text-koyori-pink-700 border border-koyori-pink-200'"
              >
                {{ job.stage }}
              </span>
              <!-- Progress % + eta -->
              <div class="text-right shrink-0 min-w-[70px]">
                <div
                  v-if="job.stage !== 'queued'"
                  class="text-[13px] font-semibold text-koyori-ink font-[JetBrains_Mono]"
                >
                  {{ (job.progress * 100).toFixed(0) }}%
                </div>
                <div class="text-[11.5px] text-koyori-ink-4">
                  ETA: {{ job.eta }}
                </div>
              </div>
              <!-- Cancel button -->
              <PGhostButton
                icon="pi pi-times"
                size="small"
                aria-label="Cancel job"
                @click="openCancelDialog(job.id)"
                class="shrink-0"
              />
              <!-- Chevron -->
              <NuxtLink
                :to="`/jobs/${job.id}`"
                class="text-inherit no-underline shrink-0"
              >
                <i class="pi pi-chevron-right text-[12px] text-koyori-ink-4"></i>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Recent section -->
        <div class="mt-6">
          <div class="text-[11px] font-semibold uppercase tracking-[0.06em] text-koyori-ink-4 pb-2">
            Recent · {{ recentJobs.length }}
          </div>
          <div class="flex flex-col gap-1.5">
            <div
              v-for="job in recentJobs"
              :key="job.id"
              class="bg-white border border-koyori-border rounded-[10px] px-4 py-3 flex items-center gap-3 transition-all duration-150 hover:shadow-koyori-sm hover:border-koyori-border-2 opacity-85"
            >
              <div class="shrink-0">
                <div
                  class="w-[10px] h-[10px] rounded-full"
                  :class="job.stage === 'done' ? 'bg-koyori-emerald-400' : 'bg-red-500'"
                ></div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-[13.5px] font-semibold text-koyori-ink truncate">
                  {{ job.stream }}
                </div>
                <div
                  v-if="job.error"
                  class="text-[12px] text-red-500 mt-0.5 max-w-[400px] truncate"
                >
                  {{ job.error }}
                </div>
              </div>
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11.5px] font-medium shrink-0"
                :class="job.stage === 'done' ? 'bg-koyori-emerald-50 text-koyori-emerald-700 border border-koyori-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'"
              >
                {{ job.stage }}
              </span>
              <NuxtLink
                :to="`/jobs/${job.id}`"
                class="text-inherit no-underline shrink-0"
              >
                <i class="pi pi-chevron-right text-[12px] text-koyori-ink-4"></i>
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Cancel dialog -->
    <div
      v-if="cancelDialogVisible"
      class="fixed inset-0 bg-black/30 flex items-center justify-center z-[200] backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl p-7 max-w-[400px] w-[90%] shadow-koyori-lg">
        <div class="text-[17px] font-bold text-koyori-ink mb-2">
          Cancel this job?
        </div>
        <p class="text-[14px] text-koyori-ink-2 leading-relaxed m-0 mb-6">
          The processing pipeline will stop and any progress will be lost. You
          can restart it later.
        </p>
        <div class="flex gap-2.5 justify-end">
          <PGhostButton
            label="Keep running"
            @click="cancelDialogVisible = false"
          />
          <PDangerButton
            label="Cancel job"
            icon="pi pi-times"
            @click="confirmCancel"
          />
        </div>
      </div>
    </div>

    <!-- Dev state switcher -->
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white border border-koyori-border rounded-full px-3 py-1.5 shadow-koyori-md z-50">
      <span class="text-[11px] text-koyori-ink-3 font-medium mr-1">View state:</span>
      <button
        v-for="s in ['Default', 'Loading', 'Empty', 'Error']"
        :key="s"
        @click="devState = s"
        class="px-2.5 py-1 rounded-full text-[11px] text-koyori-ink-3 bg-transparent border-none cursor-pointer font-[inherit] transition-all duration-150"
        :class="devState === s ? '!bg-koyori-pink-100 !text-koyori-pink-700 !font-semibold' : ''"
      >
        {{ s }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { DUMMY_JOBS } from "~/composables/koyori-data";

definePageMeta({ layout: "koyori" });

const devState = ref("Default");
const cancelDialogVisible = ref(false);
const jobToCancel = ref<string | null>(null);

const activeJobs = computed(() =>
  DUMMY_JOBS.filter(
    (j) =>
      j.stage === "transcribing" ||
      j.stage === "summarizing" ||
      j.stage === "queued",
  ),
);
const recentJobs = computed(() =>
  DUMMY_JOBS.filter((j) => j.stage === "done" || j.stage === "failed"),
);

function openCancelDialog(id: string) {
  jobToCancel.value = id;
  cancelDialogVisible.value = true;
}

function confirmCancel() {
  cancelDialogVisible.value = false;
  jobToCancel.value = null;
}
</script>
