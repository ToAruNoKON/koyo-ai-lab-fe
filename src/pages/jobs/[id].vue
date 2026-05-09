<template>
  <div class="flex flex-col min-h-full">
    <!-- Topbar -->
    <div
      class="flex items-center justify-between px-8 py-4 border-b border-koyori-border bg-white sticky top-0 z-10 shrink-0"
    >
      <div>
        <div
          class="flex items-center gap-1.5 text-[12px] text-koyori-ink-3 mb-1"
        >
          <NuxtLink
            to="/jobs"
            class="text-koyori-ink-3 hover:text-koyori-ink no-underline"
            >Jobs</NuxtLink
          >
          <i class="pi pi-chevron-right text-[10px]"></i>
          <span class="text-koyori-ink">Job detail</span>
        </div>
        <h2
          class="text-[18px] font-bold text-koyori-ink m-0 leading-tight max-w-[480px] overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {{ job?.stream }}
        </h2>
        <p class="text-[13px] text-koyori-ink-3 m-0 mt-0.5">{{ job?.stage }}</p>
      </div>
      <div class="flex gap-2 items-center">
        <PButton
          v-if="job?.stage === 'failed'"
          label="Retry"
          icon="pi pi-refresh"
          size="small"
          @click="handleRetry"
        />
        <PDangerButton
          v-else-if="
            job?.stage === 'transcribing' ||
            job?.stage === 'summarizing' ||
            job?.stage === 'queued'
          "
          label="Cancel job"
          icon="pi pi-times"
          size="small"
          @click="cancelDialogVisible = true"
        />
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 p-6 px-8 max-w-[900px] w-full">
      <!-- Loading state -->
      <template v-if="jobQuery.isLoading.value">
        <div
          class="bg-gradient-to-r from-koyori-surface-2 via-koyori-surface-3 to-koyori-surface-2 bg-[size:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] h-48 rounded-xl"
        ></div>
      </template>

      <!-- Error state -->
      <template v-else-if="jobQuery.isError.value">
        <div class="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
          <i
            class="pi pi-exclamation-circle text-[28px] text-red-600 block mb-2"
          ></i>
          <div class="text-[14px] font-semibold text-red-800">
            Failed to load job
          </div>
        </div>
      </template>

      <!-- Job content -->
      <template v-else-if="job">
        <!-- Pipeline card -->
        <div
          class="bg-white border border-koyori-border rounded-xl shadow-koyori-sm p-5 mb-5"
        >
          <div
            class="text-[11px] font-semibold text-koyori-ink-3 mb-4 uppercase tracking-[0.04em]"
          >
            Pipeline
          </div>
          <div class="grid grid-cols-4 gap-2.5">
            <div
              v-for="(step, i) in pipelineSteps"
              :key="step.name"
              class="relative p-3.5 rounded-[10px]"
              :class="{
                'border-[1.5px] border-koyori-pink-300 bg-koyori-pink-50':
                  step.status === 'active',
                'border border-koyori-border bg-koyori-emerald-50':
                  step.status === 'done',
                'border border-koyori-border bg-koyori-surface-2':
                  step.status === 'pending',
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
                <i
                  v-if="step.status === 'done'"
                  class="pi pi-check text-[12px] text-white"
                ></i>
                <i
                  v-else-if="step.status === 'active'"
                  class="pi pi-spin pi-spinner text-[12px] text-white"
                ></i>
                <span
                  v-else
                  class="text-[11px] text-koyori-ink-4 font-semibold"
                  >{{ i + 1 }}</span
                >
              </div>
              <div
                class="text-[12.5px] font-semibold mb-0.5"
                :class="
                  step.status === 'pending'
                    ? 'text-koyori-ink-4'
                    : 'text-koyori-ink'
                "
              >
                {{ step.name }}
              </div>
              <div
                class="text-[11px]"
                :class="
                  step.status === 'active'
                    ? 'text-koyori-pink-600'
                    : 'text-koyori-ink-4'
                "
              >
                <template v-if="step.status === 'done'">Done</template>
                <template v-else-if="step.status === 'active'"
                  >{{ ((job?.progress ?? 0) * 100).toFixed(0) }}% · ETA
                  {{ job?.eta }}</template
                >
                <template v-else>Pending</template>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress card (if active) -->
        <div
          v-if="job?.stage === 'transcribing' || job?.stage === 'summarizing'"
          class="bg-white border border-koyori-border rounded-xl shadow-koyori-sm p-5 mb-5"
        >
          <div class="flex justify-between items-center mb-3">
            <div class="text-[13.5px] font-semibold text-koyori-ink">
              Progress
            </div>
            <span class="font-[JetBrains_Mono] text-[13px] text-koyori-pink-500"
              >{{ ((job?.progress ?? 0) * 100).toFixed(0) }}%</span
            >
          </div>
          <div class="h-1 bg-koyori-surface-3 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-koyori-pink-400 to-koyori-pink-500 rounded-full"
              :style="{ width: `${(job?.progress ?? 0) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Error banner (if failed) -->
        <div
          v-if="job?.stage === 'failed'"
          class="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-5"
        >
          <div class="flex items-center gap-2 mb-2">
            <i class="pi pi-exclamation-circle text-red-600"></i>
            <span class="font-semibold text-red-800 text-[14px]"
              >Job failed</span
            >
          </div>
          <pre
            class="bg-red-100 rounded-lg p-3 text-[12px] text-red-900 m-0 font-[JetBrains_Mono] overflow-x-auto"
            >{{ job.error }}</pre
          >
        </div>

        <!-- Job meta card -->
        <div
          class="bg-white border border-koyori-border rounded-xl shadow-koyori-sm p-5"
        >
          <div
            class="text-[11px] font-semibold uppercase tracking-[0.06em] text-koyori-ink-4 mb-3.5"
          >
            Job details
          </div>
          <div class="grid grid-cols-2 gap-3.5">
            <div v-for="meta in jobMeta" :key="meta.label">
              <div
                class="text-[11px] text-koyori-ink-4 mb-0.5 uppercase tracking-[0.03em]"
              >
                {{ meta.label }}
              </div>
              <div
                class="text-[13.5px] text-koyori-ink font-[JetBrains_Mono] overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {{ meta.value }}
              </div>
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
      <div
        class="bg-white rounded-2xl p-7 max-w-[400px] w-[90%] shadow-koyori-lg"
      >
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useJobDetail, useCancelJob, formatEta } from "~/composables/jobs";

definePageMeta({ layout: "koyori" });

const route = useRoute();
const router = useRouter();
const jobId = computed(() => route.params.id as string);

// API query
const jobQuery = useJobDetail(jobId);
const cancelJobMutation = useCancelJob();
const toast = useToast();
const cancelDialogVisible = ref(false);

// Map API job status+stage to UI stage
function mapApiStage(status: string, stage: string): string {
  if (status === "pending") return "queued";
  if (status === "completed") return "done";
  if (status === "failed") return "failed";
  if (stage === "transcribe" || stage === "fetch_audio") return "transcribing";
  if (stage === "diarization") return "transcribing";
  if (stage === "summarize") return "summarizing";
  if (stage === "index" || stage === "generate_moments") return "transcribing";
  return "transcribing";
}

const job = computed(() => {
  const data = jobQuery.data.value;
  if (!data) return null;
  return {
    stream: data.title,
    stage: mapApiStage(data.status, data.stage),
    progress: data.overall_progress,
    eta: data.eta_seconds !== null ? formatEta(data.eta_seconds) : "—",
    error: data.error_message,
    id: data.id,
    created_at: data.created_at,
    status: data.status,
    stage_progress: data.stage_progress,
  };
});

const pipelineSteps = computed(() => {
  const stage = job.value?.stage ?? "";
  const afterTranscribe = stage === "summarizing" || stage === "done";
  return [
    { name: "Fetch audio", status: stage === "queued" ? "pending" : "done" },
    {
      name: "Transcribe",
      status:
        stage === "transcribing"
          ? "active"
          : afterTranscribe
            ? "done"
            : "pending",
    },
    {
      name: "Summarize",
      status:
        stage === "summarizing"
          ? "active"
          : stage === "done"
            ? "done"
            : "pending",
    },
    { name: "Index", status: stage === "done" ? "done" : "pending" },
  ];
});

const jobMeta = computed(() => {
  const data = jobQuery.data.value;
  if (!data) return [];
  return [
    { label: "Job ID", value: data.id },
    {
      label: "Created",
      value: data.created_at ? new Date(data.created_at).toLocaleString() : "—",
    },
    { label: "Status", value: data.status },
    { label: "Stage", value: data.stage },
    {
      label: "ETA",
      value: data.eta_seconds !== null ? formatEta(data.eta_seconds) : "—",
    },
  ];
});

function confirmCancel() {
  if (!jobId.value) return;
  cancelJobMutation.mutate(jobId.value, {
    onSuccess: () => {
      cancelDialogVisible.value = false;
      router.push("/jobs");
    },
    onError: (err) => {
      cancelDialogVisible.value = false;
      toast.add({
        severity: "error",
        summary: "Failed to cancel job",
        detail: err instanceof Error ? err.message : "Unknown error",
        life: 5000,
      });
    },
  });
}

function handleRetry() {
  toast.add({
    severity: "info",
    summary: "Retry not implemented",
    detail: "Retrying jobs is not yet available",
    life: 5000,
  });
}
</script>
