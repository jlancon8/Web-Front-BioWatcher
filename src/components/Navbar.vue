<template>
  <header
      class="relative flex items-center justify-between gap-3 bg-[#17352b] px-4 py-3 text-white sm:px-8 sm:py-4 lg:px-12 lg:py-5">
    <div class="flex min-w-0 items-center gap-3 md:gap-8">
      <button
          v-if="visibleLinks.length"
          type="button"
          class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg hover:bg-[#1d4638] md:hidden"
          :aria-expanded="isMenuOpen"
          aria-label="Ouvrir le menu"
          @click="isMenuOpen = !isMenuOpen"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" aria-hidden="true">
          <path v-if="!isMenuOpen" d="M4 6h16M4 12h16M4 18h16"/>
          <path v-else d="M6 6l12 12M18 6L6 18"/>
        </svg>
      </button>

      <RouterLink to="/" class="flex min-w-0 items-center gap-2 text-lg font-extrabold sm:gap-2.5 sm:text-[22px]"
                  @click="isMenuOpen = false">
        <svg class="h-6 w-6 shrink-0 sm:h-[30px] sm:w-[30px]" viewBox="0 0 30 30" aria-hidden="true">
          <circle cx="15" cy="15" r="15" fill="#3f9a62"/>
          <path d="M15 7l5 7h-3l4 6H9l4-6h-3z" fill="#fff"/>
        </svg>
        <span class="truncate">BioWatcher</span>
      </RouterLink>

      <nav class="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
        <RouterLink
            v-for="link in visibleLinks"
            :key="link.to"
            :to="link.to"
            class="rounded-lg px-5 ml-7 py-2 text-base font-bold text-white/90 hover:bg-[#1d4638] hover:text-white lg:text-2lg"
            exact-active-class="!bg-[#1d4638] !text-white"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </div>

    <div class="flex shrink-0 items-center gap-2 sm:gap-3">
      <RouterLink
          v-if="authStore.currentUser"
          to="/account"
          class="flex items-center gap-2 rounded-[10px] bg-white px-3 py-2.5 text-sm font-bold text-[#17352b] hover:bg-[#f2f4ee] sm:px-[22px] sm:py-3 sm:text-[15px]"
          @click="isMenuOpen = false"
      >
        <svg class="h-5 w-5 sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             aria-hidden="true">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
        <span class="hidden max-w-[140px] truncate sm:inline">{{ displayName }}</span>
        <span class="sr-only sm:hidden">{{ displayName }}</span>
      </RouterLink>
      <img
          v-if="authStore.currentUser"
          :src="getAvatar(authStore.currentUser.avatar).src"
          :alt="getAvatar(authStore.currentUser.avatar).label"
          class="h-12 w-12 shrink-0 rounded-lg border-2 border-[#3f9a62] bg-[#d8eadd] object-cover sm:h-12 sm:w-12"
      />
      <RouterLink
          v-else
          to="/login"
          class="flex items-center gap-2 rounded-[10px] bg-white px-3 py-2.5 text-sm font-bold text-[#17352b] hover:bg-[#f2f4ee] sm:px-[22px] sm:py-3 sm:text-[15px]"
      >
        <svg class="h-5 w-5 sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             aria-hidden="true">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
        <span class="hidden sm:inline">Se connecter</span>
        <span class="sr-only sm:hidden">Se connecter</span>
      </RouterLink>
    </div>

    <nav
        v-if="isMenuOpen && visibleLinks.length"
        class="absolute left-0 right-0 top-full z-50 flex flex-col gap-1 border-t border-[#1d4638] bg-[#17352b] px-4 py-3 shadow-lg md:hidden"
        aria-label="Navigation mobile"
    >
      <RouterLink
          v-for="link in visibleLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-lg px-4 py-3 text-base font-bold text-white/80 hover:bg-[#1d4638] hover:text-white"
          exact-active-class="!bg-[#1d4638] !text-white"
          @click="isMenuOpen = false"
      >
        {{ link.label }}
      </RouterLink>
    </nav>
  </header>
</template>

<script setup>
import {computed, ref} from 'vue'
import {RouterLink} from 'vue-router'
import {useAuthStore} from '@/stores/modules/auth.store.js'
import {getAvatar} from "@/utils/avatars.js";

const authStore = useAuthStore()
const isMenuOpen = ref(false)

const navLinks = [
  {label: 'Dashboard', to: '/dashboard', roles: ['admin', 'garde', 'gestionnaire']},
  {label: 'Risque du jour', to: '/risque'},
  {label: 'Restrictions d\'accès', to: '/restrictions'},
]

const displayName = computed(() => authStore.currentUser?.name ?? authStore.currentUser?.login)

const visibleLinks = computed(() => {
  const rights = authStore.currentUser?.rights ?? []
  return navLinks.filter(link => !link.roles || link.roles.some(role => rights.includes(role)))
})
</script>