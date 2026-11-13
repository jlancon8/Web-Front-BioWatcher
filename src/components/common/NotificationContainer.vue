<template>
  <div
      class="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:right-6 sm:top-6">
    <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-x-8 opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="absolute inset-x-0 transition duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-8 opacity-0"
        move-class="transition duration-300"
    >
      <div
          v-for="n in notificationsStore.notifications"
          :key="n.id"
          role="status"
          class="pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 text-[15px] font-bold text-white shadow-lg"
          :class="presets[n.color] ?? n.color"
      >
        <span class="min-w-0 flex-1 break-words">{{ n.message }}</span>
        <button
            type="button"
            class="shrink-0 cursor-pointer text-white/80 hover:text-white"
            aria-label="Fermer la notification"
            @click="notificationsStore.remove(n.id)"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18"/>
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import {useNotificationStore} from '@/stores/modules/notifs.store.js'

const notificationsStore = useNotificationStore()

const presets = {
  success: 'bg-[#2d6a4f]',
  error: 'bg-[#9a1b0e]',
  warning: 'bg-[#b7791f]',
  info: 'bg-[#2b5d9b]'
}
</script>