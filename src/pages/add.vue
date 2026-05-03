<template>
  <div class="flex flex-col min-h-full">
    <!-- Topbar -->
    <div
      class="flex items-center justify-between px-8 py-4 border-b border-koyori-border bg-white sticky top-0 z-10 shrink-0"
    >
      <div>
        <h2 class="text-[18px] font-bold text-koyori-ink m-0 leading-tight">
          Add stream
        </h2>
        <p class="text-[13px] text-koyori-ink-3 m-0 mt-0.5">
          Process a YouTube link or upload audio
        </p>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 p-8 max-w-[760px] w-full">
      <!-- Phase: Input -->
      <template v-if="phase === 'input'">
        <div
          class="bg-white border border-koyori-border rounded-xl shadow-koyori-sm p-7"
        >
          <div
            class="text-[11px] font-semibold text-koyori-ink-3 mb-2 uppercase tracking-[0.04em]"
          >
            YouTube URL
          </div>
          <div class="relative mb-5">
            <div
              class="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5"
            >
              <div
                class="w-[18px] h-[18px] bg-red-600 rounded-[4px] flex items-center justify-center"
              >
                <i class="pi pi-play-circle text-[11px] text-white"></i>
              </div>
            </div>
            <input
              v-model="youtubeUrl"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              class="w-full pl-11 pr-3.5 py-3.5 border-[1.5px] rounded-[10px] text-[14px] bg-white outline-none text-koyori-ink font-[inherit] box-border transition-colors duration-150"
              :class="
                urlFocused ? 'border-koyori-pink-400' : 'border-koyori-border'
              "
              @focus="urlFocused = true"
              @blur="urlFocused = false"
            />
          </div>
          <div class="flex gap-2.5 items-center">
            <PButton
              :label="t('btn.continue') + ' →'"
              icon="pi pi-arrow-right"
              icon-pos="right"
              :disabled="youtubeUrl.length < 10"
              @click="startValidation"
            />
            <PGhostButton
              label="Upload audio file instead"
              icon="pi pi-upload"
            />
          </div>
        </div>
      </template>

      <!-- Phase: Validating -->
      <template v-else-if="phase === 'validating'">
        <div
          class="bg-white border border-koyori-border rounded-xl shadow-koyori-sm p-10 text-center"
        >
          <div
            class="w-11 h-11 rounded-full border-[3px] border-koyori-pink-300 border-t-koyori-pink-500 mx-auto mb-4 animate-spin"
          ></div>
          <div class="text-[15px] font-semibold text-koyori-ink mb-1">
            Fetching metadata from YouTube…
          </div>
          <div class="text-[13px] text-koyori-ink-3">
            This usually takes a second
          </div>
        </div>
      </template>

      <!-- Phase: Ready -->
      <template v-else-if="phase === 'ready'">
        <!-- Video info card -->
        <div
          class="bg-white border border-koyori-border rounded-xl shadow-koyori-sm p-5 mb-5"
        >
          <div class="flex gap-4 items-start mb-4">
            <!-- Thumbnail placeholder -->
            <div
              class="relative w-[160px] h-[90px] rounded-[10px] shrink-0 bg-gradient-to-br from-[#F8C5D6] to-[#E66B8E]"
            >
              <div
                class="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] font-[JetBrains_Mono] px-[5px] py-px rounded-[3px]"
              >
                3:02:47
              </div>
            </div>
            <!-- Video meta -->
            <div class="flex-1">
              <div
                class="text-[15px] font-bold text-koyori-ink mb-1.5 line-clamp-2"
              >
                カラオケ配信🎤 リクエスト箱オープン！【博衣こより / ホロライブ】
              </div>
              <div class="text-[13px] text-koyori-ink-3 mb-1">
                博衣こより - Hakui Koyori Ch.
              </div>
              <div
                class="text-[12.5px] text-koyori-ink-4 font-[JetBrains_Mono]"
              >
                2026-04-21 · 3:02:47
              </div>
            </div>
          </div>
          <!-- Change URL link -->
          <button
            @click="phase = 'input'"
            class="text-[12px] text-koyori-pink-500 bg-transparent border-none cursor-pointer p-0 font-[inherit] underline"
          >
            ← Change URL
          </button>
        </div>

        <!-- What happens next -->
        <div class="text-[13px] font-semibold text-koyori-ink-2 mb-3">
          What happens next
        </div>
        <div class="flex flex-col gap-2 mb-5">
          <div
            v-for="step in processingSteps"
            :key="step.title"
            class="flex items-center gap-3 bg-white border border-koyori-border rounded-[10px] px-4 py-3"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              :class="step.bgClass"
            >
              <i :class="[step.icon, 'text-[14px]', step.iconClass]"></i>
            </div>
            <div class="flex-1">
              <div class="text-[13.5px] font-semibold text-koyori-ink">
                {{ step.title }}
              </div>
              <div class="text-[12px] text-koyori-ink-3">{{ step.desc }}</div>
            </div>
            <span
              class="font-[JetBrains_Mono] text-[12px] text-koyori-ink-4 shrink-0"
              >{{ step.eta }}</span
            >
          </div>
        </div>

        <!-- ETA banner -->
        <div
          class="flex items-center gap-2.5 bg-koyori-pink-50 border border-koyori-pink-200 rounded-[10px] px-4 py-3 mb-5"
        >
          <i class="pi pi-clock text-koyori-pink-500 text-[16px]"></i>
          <div>
            <div class="text-[13.5px] font-semibold text-koyori-pink-700">
              Estimated total time: ~14 min
            </div>
            <div class="text-[12px] text-koyori-pink-500">
              You'll be notified when it's ready. You can close this tab.
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2.5">
          <NuxtLink to="/jobs">
            <PButton
              :label="t('btn.start_processing') + ' →'"
              icon="pi pi-play"
            />
          </NuxtLink>
          <PGhostButton :label="t('btn.cancel')" @click="phase = 'input'" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

definePageMeta({ layout: "koyori" });

const { t } = useI18n();

const phase = ref<"input" | "validating" | "ready">("input");
const youtubeUrl = ref("");
const urlFocused = ref(false);

const processingSteps = [
  {
    title: "Transcribe audio",
    desc: "Whisper v3 model — Japanese optimized",
    eta: "~10 min",
    icon: "pi pi-microphone",
    bgClass: "bg-koyori-pink-100",
    iconClass: "text-koyori-pink-600",
  },
  {
    title: "Summarize & detect moments",
    desc: "GPT-4o finds highlights, chapters, TL;DR",
    eta: "~3 min",
    icon: "pi pi-sparkles",
    bgClass: "bg-koyori-emerald-50",
    iconClass: "text-koyori-emerald-600",
  },
  {
    title: "Index for search",
    desc: "Embeddings stored for semantic search",
    eta: "~30 sec",
    icon: "pi pi-database",
    bgClass: "bg-blue-50",
    iconClass: "text-blue-600",
  },
];

function startValidation() {
  if (youtubeUrl.value.length < 10) return;
  phase.value = "validating";
  setTimeout(() => {
    phase.value = "ready";
  }, 900);
}
</script>

<i18n lang="json">
{
  "en": {
    "btn.continue": "Continue",
    "btn.start_processing": "Start processing",
    "btn.cancel": "Cancel"
  },
  "ja": {
    "btn.continue": "続行",
    "btn.start_processing": "処理を開始",
    "btn.cancel": "キャンセル"
  }
}
</i18n>
