<template>
  <div class="flex flex-col h-screen">
    <!-- Topbar -->
    <div class="flex items-center justify-between px-8 py-4 border-b border-koyori-border bg-white sticky top-0 z-10 shrink-0">
      <div>
        <h2 class="text-[18px] font-bold text-koyori-ink m-0 leading-tight">Ask the corpus</h2>
        <p class="text-[13px] text-koyori-ink-3 m-0 mt-0.5">Powered by every transcript in your library [Dummy]</p>
      </div>
      <div class="flex gap-2">
        <NuxtLink to="/search">
          <PGhostButton label="Search instead" icon="pi pi-search" size="small" />
        </NuxtLink>
        <PGhostButton label="New chat" icon="pi pi-plus" size="small" @click="newChat" />
      </div>
    </div>

    <!-- Dummy notice -->
    <div class="px-8 pt-4 shrink-0">
      <div class="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-[12.5px] font-medium px-3 py-2 rounded-lg mb-5">
        <i class="pi pi-exclamation-triangle text-[13px]"></i>
        Showing dummy conversation — backend not yet connected
      </div>
    </div>

    <!-- Messages area -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto px-8 py-4 max-w-[900px] w-full">
      <div class="flex flex-col gap-5">
        <div v-for="(msg, i) in displayMessages" :key="i">
          <!-- User message -->
          <div v-if="msg.role === 'user'" class="flex justify-end">
            <div class="max-w-[580px] bg-koyori-pink-100 rounded-[16px_16px_4px_16px] px-4 py-3 text-[14px] text-koyori-ink leading-relaxed border border-koyori-pink-200">
              {{ msg.text }}
            </div>
          </div>
          <!-- AI message -->
          <div v-else class="flex gap-3 items-start">
            <!-- Avatar -->
            <div class="w-8 h-8 rounded-full shrink-0 bg-gradient-to-br from-koyori-pink-400 to-koyori-emerald-500 flex items-center justify-center">
              <i class="pi pi-sparkles text-[14px] text-white"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-[14px] text-koyori-ink leading-[1.65] mb-2.5">{{ msg.text }}</div>
              <!-- Citations -->
              <div v-if="msg.cites && msg.cites.length > 0" class="flex flex-wrap gap-2">
                <div
                  v-for="cite in msg.cites"
                  :key="cite.t"
                  class="flex items-center gap-2 bg-white border border-koyori-border rounded-[10px] px-3 py-[7px] cursor-pointer transition-all duration-150 hover:shadow-koyori-sm hover:border-koyori-border-2"
                >
                  <i class="pi pi-play-circle text-[13px] text-koyori-pink-400"></i>
                  <div>
                    <div class="text-[12px] font-semibold text-koyori-ink max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">{{ cite.stream }}</div>
                    <div class="text-[11px] text-koyori-ink-4 font-[JetBrains_Mono]">{{ cite.date }} · {{ cite.t }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Thinking indicator -->
        <div v-if="isThinking" class="flex gap-3 items-start">
          <div class="w-8 h-8 rounded-full shrink-0 bg-gradient-to-br from-koyori-pink-400 to-koyori-emerald-500 flex items-center justify-center">
            <i class="pi pi-sparkles text-[14px] text-white"></i>
          </div>
          <div class="flex items-center gap-1 px-4 py-3.5 bg-white border border-koyori-border rounded-[16px_16px_16px_4px]">
            <div
              v-for="n in 3"
              :key="n"
              class="w-1.5 h-1.5 rounded-full bg-koyori-pink-400"
              :style="{ animation: `bounce 1.4s ease-in-out ${(n-1)*0.16}s infinite` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input area -->
    <div class="shrink-0 px-8 pb-6 pt-4 max-w-[900px] w-full bg-transparent">
      <!-- Suggestion chips (show when input empty) -->
      <div v-if="!inputText.trim() && displayMessages.length < 4" class="flex flex-wrap gap-2 mb-3">
        <button
          v-for="chip in suggestionChips"
          :key="chip"
          @click="inputText = chip"
          class="px-3.5 py-1.5 rounded-full border border-koyori-border bg-white text-[12.5px] text-koyori-ink-2 cursor-pointer font-[inherit] transition-all duration-150 max-w-[280px] overflow-hidden text-ellipsis whitespace-nowrap hover:border-koyori-border-2 hover:shadow-koyori-sm"
        >"{{ chip }}"</button>
      </div>
      <!-- Input row -->
      <div
        class="flex gap-2.5 bg-white border-[1.5px] rounded-[14px] px-3 py-2.5 shadow-koyori-sm transition-colors duration-150"
        :class="inputFocused ? 'border-koyori-pink-400' : 'border-koyori-border'"
      >
        <textarea
          v-model="inputText"
          placeholder="Ask anything about Koyori's streams…"
          @focus="inputFocused = true"
          @blur="inputFocused = false"
          @keydown.enter.exact.prevent="sendMessage"
          class="flex-1 border-none outline-none resize-none text-[14px] text-koyori-ink font-[inherit] bg-transparent leading-relaxed min-h-[24px] max-h-[120px]"
          rows="1"
        ></textarea>
        <PButton
          icon="pi pi-send"
          size="small"
          :disabled="!inputText.trim()"
          @click="sendMessage"
          aria-label="Send"
        />
      </div>
      <div class="text-[11px] text-koyori-ink-4 mt-1.5 text-center">Enter to send · Shift+Enter for newline</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { DUMMY_CHAT_MESSAGES, type DummyChatMessage } from '~/composables/koyori-data'

definePageMeta({ layout: 'koyori' })

const displayMessages = ref<DummyChatMessage[]>([...DUMMY_CHAT_MESSAGES])
const inputText = ref('')
const inputFocused = ref(false)
const isThinking = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const suggestionChips = [
  "What did Lui-nee say in the Minecraft stream?",
  "When does Koyori sing ballads?",
  "Best karaoke moments?",
  "Any CRISPR/science discussions?",
]

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return
  displayMessages.value.push({ role: 'user', text })
  inputText.value = ''
  isThinking.value = true
  await nextTick()
  scrollToBottom()
  setTimeout(() => {
    isThinking.value = false
    displayMessages.value.push({
      role: 'ai',
      text: 'This is a dummy response. In the real app, this would be powered by semantic search across all transcripts in your library.',
      cites: [{ stream: 'Karaoke night', date: '2026-04-21', t: '01:34:55' }]
    })
    nextTick(() => scrollToBottom())
  }, 1400)
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function newChat() {
  displayMessages.value = []
}
</script>
