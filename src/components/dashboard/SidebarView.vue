<template>
  <header class="flex h-14 items-center justify-between bg-[#12372c] px-4 text-white md:hidden">
    <button
        type="button"
        class="cursor-pointer rounded-lg p-2 hover:bg-[#1d493a]"
        aria-label="Ouvrir le menu"
        :aria-expanded="open"
        @click="open = true"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" aria-hidden="true">
        <path d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
    <span class="text-lg font-bold tracking-tight">BioWatcher</span>
    <span class="w-10"></span>
  </header>

  <div
      v-if="open"
      class="fixed inset-0 z-30 bg-black/40 md:hidden"
      @click="open = false"
  ></div>

  <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 flex w-[230px] shrink-0 flex-col bg-[#12372c] text-white',
        'transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      ]"
  >
    <div class="flex items-center justify-between px-8 pt-[30px] pb-[31px]">
      <h1 class="text-[21px] font-bold tracking-tight">BioWatcher</h1>
      <button
          type="button"
          class="cursor-pointer rounded-lg p-1 hover:bg-[#1d493a] md:hidden"
          aria-label="Fermer le menu"
          @click="open = false"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18"/>
        </svg>
      </button>
    </div>

    <nav class="flex-1 overflow-y-auto px-5">
      <div class="space-y-2">
        <RouterLink
            v-for="item in primaryItems"
            :key="item.to"
            :to="item.to"
            :class="linkClass(item)"
        >
          {{ item.label }}
        </RouterLink>
      </div>

      <div class="my-5 border-t border-[#315447]"></div>

      <div class="space-y-2">
        <RouterLink
            v-for="item in secondaryItems"
            :key="item.to"
            :to="item.to"
            :class="linkClass(item)"
        >
          {{ item.label }}
        </RouterLink>
      </div>
    </nav>

    <div class="px-8 pb-10">
      <p class="text-sm text-center font-medium text-[#c4d3cd]">Connecté : {{ formatRole(role) }}</p>
    </div>
  </aside>
</template>

<script setup>
import {computed, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {formatRole} from "@/utils/formatter.js";
import {useAuthStore} from "@/stores/modules/auth.store.js";

const authStore = useAuthStore()

defineProps({
  role: {
    type: Array,
    default: ''
  }
})

const route = useRoute()
const open = ref(false)

const menuItems = [
  {label: 'Modules et mesures', to: '/dashboard'},
  {label: 'Historique', to: '/dashboard/history'},
  {label: 'Gestion des modules', to: '/dashboard/modules'},
  ...(authStore.currentUser?.rights?.includes('admin')
      ? [{label: 'Comptes', to: '/dashboard/accounts'}]
      : [])
];

const primaryItems = computed(() => menuItems.slice(0, 2))
const secondaryItems = computed(() => menuItems.slice(2))

const linkClass = (item) => [
  'flex w-full items-center rounded-xl px-3 py-3.5',
  'text-left text-sm font-medium transition-colors duration-200',
  route.path === item.to
      ? 'bg-[#285d49] text-white'
      : 'text-[#c4d3cd] hover:bg-[#1d493a] hover:text-white'
]

watch(() => route.path, () => {
  open.value = false
})
</script>