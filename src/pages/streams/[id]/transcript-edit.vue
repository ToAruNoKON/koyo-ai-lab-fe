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
            to="/"
            class="text-koyori-ink-3 hover:text-koyori-ink no-underline"
            >Library</NuxtLink
          >
          <i class="pi pi-chevron-right text-[10px]"></i>
          <NuxtLink
            :to="`/streams/${streamId}`"
            class="text-koyori-ink-3 hover:text-koyori-ink no-underline max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap inline-block"
            >{{ stream?.title }}</NuxtLink
          >
          <i class="pi pi-chevron-right text-[10px]"></i>
          <NuxtLink
            :to="`/streams/${streamId}/transcript`"
            class="text-koyori-ink-3 hover:text-koyori-ink no-underline"
            >Transcript</NuxtLink
          >
          <i class="pi pi-chevron-right text-[10px]"></i>
          <span class="text-koyori-ink">Edit</span>
        </div>
        <h2 class="text-[18px] font-bold text-koyori-ink m-0 leading-tight">
          Edit transcript
        </h2>
        <p
          v-if="editedCount > 0"
          class="text-[13px] m-0 mt-0.5 text-koyori-pink-600"
        >
          {{ editedCount }} unsaved change{{ editedCount !== 1 ? "s" : "" }}
        </p>
        <p v-else class="text-[13px] text-koyori-ink-3 m-0 mt-0.5">
          No unsaved changes
        </p>
      </div>
      <div class="flex gap-2 items-center">
        <PGhostButton
          label="Discard"
          icon="pi pi-times"
          size="small"
          :disabled="editedCount === 0"
          @click="discardChanges"
        />
        <PButton
          label="Save changes"
          icon="pi pi-check"
          size="small"
          :disabled="editedCount === 0"
        />
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 px-8 py-6 max-w-[900px] w-full">
      <!-- Info banner -->
      <div
        class="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-[10px] p-3 mb-5"
      >
        <i
          class="pi pi-info-circle text-blue-600 text-[14px] pt-px shrink-0"
        ></i>
        <span class="text-[13px] text-blue-800 leading-relaxed"
          >Edits are flagged as human-corrected so the AI re-summary trusts
          them. Audio is never modified.</span
        >
      </div>

      <div class="text-[12.5px] text-koyori-ink-3 mb-4">
        {{ lines.length }} lines total
      </div>

      <!-- Lines -->
      <div class="flex flex-col gap-1">
        <div
          v-for="(line, i) in lines"
          :key="line.t"
          class="bg-white rounded-[10px] px-3 py-2.5 transition-all duration-150"
          :class="
            editingIndex === i
              ? 'border-[1.5px] border-koyori-pink-400 shadow-[0_0_0_3px_rgba(244,139,169,0.15)]'
              : 'border border-koyori-border'
          "
        >
          <div class="flex items-center gap-2.5">
            <!-- Drag handle -->
            <i
              class="pi pi-bars text-[12px] text-koyori-ink-4 cursor-grab shrink-0"
            ></i>
            <!-- Timestamp -->
            <span
              class="font-[JetBrains_Mono] text-[12px] bg-koyori-surface-2 text-koyori-pink-500 px-[7px] py-0.5 rounded-[5px] shrink-0"
              >{{ line.t }}</span
            >
            <!-- Speaker dropdown -->
            <select
              v-model="line.speaker"
              class="px-2 py-[3px] border border-koyori-border rounded-[6px] text-[12px] text-koyori-ink-2 bg-white cursor-pointer font-[inherit] outline-none"
              @change="markEdited(i)"
            >
              <option value="koyori">koyori</option>
              <option value="unknown">unknown</option>
            </select>
            <!-- Text -->
            <div class="flex-1 min-w-0">
              <div
                v-if="editingIndex !== i"
                class="text-[13.5px] text-koyori-ink cursor-text py-0.5 overflow-hidden text-ellipsis whitespace-nowrap flex items-center gap-1.5"
                @click="editingIndex = i"
              >
                <span
                  class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
                  >{{ line.text }}</span
                >
                <i
                  v-if="editedLines.has(i)"
                  class="pi pi-pencil text-[11px] text-koyori-pink-400 shrink-0"
                ></i>
              </div>
            </div>
            <!-- Delete -->
            <button
              class="px-1.5 py-1 border-none bg-transparent cursor-pointer text-koyori-ink-4 rounded-[5px] shrink-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-150"
              @click="deleteLine(i)"
            >
              <i class="pi pi-trash text-[12px]"></i>
            </button>
          </div>

          <!-- Edit textarea (expanded when editing) -->
          <div v-if="editingIndex === i" class="mt-2">
            <textarea
              v-model="line.text"
              class="w-full px-2.5 py-2 border border-koyori-pink-300 rounded-lg text-[13.5px] text-koyori-ink font-[inherit] resize-y min-h-[60px] outline-none box-border bg-koyori-pink-50"
              rows="2"
              autofocus
              @input="markEdited(i)"
              @blur="editingIndex = -1"
            ></textarea>
            <div class="flex items-center gap-2 mt-1.5">
              <span class="text-[11px] text-koyori-ink-4"
                >{{ line.text.length }} chars</span
              >
              <span class="text-[11px] text-koyori-ink-4">·</span>
              <span class="text-[11px] text-koyori-ink-4"
                >confidence: 0.91</span
              >
              <div class="ml-auto flex gap-1.5">
                <button
                  class="text-[11px] px-2 py-0.5 border border-koyori-border rounded-[5px] bg-white cursor-pointer text-koyori-ink-2 font-[inherit]"
                >
                  Split
                </button>
                <button
                  class="text-[11px] px-2 py-0.5 border border-koyori-border rounded-[5px] bg-white cursor-pointer text-koyori-ink-2 font-[inherit]"
                >
                  Merge ↓
                </button>
                <button
                  class="text-[11px] px-2 py-0.5 border border-red-200 rounded-[5px] bg-red-50 cursor-pointer text-red-600 font-[inherit]"
                  @click="deleteLine(i)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Insert line -->
      <button
        class="w-full mt-2.5 p-3 border-[1.5px] border-dashed border-koyori-border-2 rounded-[10px] bg-transparent cursor-pointer text-[13px] text-koyori-ink-3 font-[inherit] flex items-center justify-center gap-1.5 transition-all duration-150 hover:border-koyori-pink-300 hover:text-koyori-pink-500"
        @click="insertLine"
      >
        <i class="pi pi-plus text-[12px]"></i> + insert line
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import {
  DUMMY_STREAMS,
  DUMMY_TRANSCRIPT,
  type DummyTranscriptLine,
} from "~/composables/koyori-data";

definePageMeta({ layout: "koyori" });

const route = useRoute();
const streamId = computed(() => route.params.id as string);
const stream = computed(
  () => DUMMY_STREAMS.find((s) => s.id === streamId.value) ?? DUMMY_STREAMS[0],
);

const lines = ref<DummyTranscriptLine[]>(
  DUMMY_TRANSCRIPT.map((l) => ({ ...l })),
);
const editingIndex = ref(-1);
const editedLines = ref(new Set<number>());

const editedCount = computed(() => editedLines.value.size);

function markEdited(i: number) {
  editedLines.value = new Set([...editedLines.value, i]);
}

function deleteLine(i: number) {
  lines.value.splice(i, 1);
  if (editingIndex.value === i) editingIndex.value = -1;
}

function insertLine() {
  lines.value.push({ t: "00:00:00", speaker: "koyori", text: "" });
  editingIndex.value = lines.value.length - 1;
}

function discardChanges() {
  lines.value = DUMMY_TRANSCRIPT.map((l) => ({ ...l }));
  editedLines.value = new Set();
  editingIndex.value = -1;
}
</script>
