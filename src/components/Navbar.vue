<template>
  <header class="flex items-center justify-between gap-3 bg-[#17352b] px-4 py-3 text-white sm:px-8 sm:py-4 lg:px-12 lg:py-5">
    <RouterLink to="/" class="flex min-w-0 items-center gap-2 text-lg font-extrabold sm:gap-2.5 sm:text-[22px]">
      <svg class="h-6 w-6 shrink-0 sm:h-[30px] sm:w-[30px]" viewBox="0 0 30 30" aria-hidden="true">
        <circle cx="15" cy="15" r="15" fill="#3f9a62" />
        <path d="M15 7l5 7h-3l4 6H9l4-6h-3z" fill="#fff" />
      </svg>
      <span class="truncate">BioWatcher</span>
    </RouterLink>

    <div class="flex shrink-0 items-center gap-2 sm:gap-3">
      <RouterLink
          to="/account"
          class="flex items-center gap-2 rounded-[10px] bg-white px-3 py-2.5 text-sm font-bold text-[#17352b] hover:bg-[#f2f4ee] sm:px-[22px] sm:py-3 sm:text-[15px]"
      >
        <svg class="h-5 w-5 sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
        <span class="hidden sm:inline">Mon compte</span>
        <span class="sr-only sm:hidden">Mon compte</span>
      </RouterLink>
      <img
          v-if="authStore.currentUser"
          :src="avatar.src"
          :alt="avatar.label"
          class="h-20 w-20 shrink-0 rounded-lg border-2 border-[#3f9a62] bg-[#d8eadd] object-cover sm:h-11 sm:w-11"
      />
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth.store.js'

const authStore = useAuthStore()

const avatars = [
  {id: 'avatar-1', src: '/avatars/avatar-1.webp', label: 'Avatar 1'},
  {id: 'avatar-2', src: '/avatars/avatar-2.webp', label: 'Avatar 2'},
  {id: 'avatar-3', src: '/avatars/avatar-3.webp', label: 'Avatar 3'},
  {id: 'avatar-4', src: '/avatars/avatar-4.webp', label: 'Avatar 4'},
  {id: 'avatar-5', src: '/avatars/avatar-5.webp', label: 'Avatar 5'},
  {id: 'avatar-6', src: '/avatars/avatar-6.webp', label: 'Avatar 6'}
]

const avatar = computed(() =>
    avatars.find(a => a.id === authStore.currentUser?.avatar) ?? avatars[0]
)
</script>