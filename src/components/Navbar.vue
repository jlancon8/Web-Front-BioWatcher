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

      <div ref="root" class="relative">
        <button
            type="button"
            class="block h-10 w-10 overflow-hidden rounded-full border-2 border-[#3f9a62] bg-[#d8eadd] hover:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-11 sm:w-11"
            aria-haspopup="true"
            :aria-expanded="open"
            aria-label="Changer de photo de profil"
            @click="open = !open"
        >
          <img :src="selected.src" :alt="selected.label" class="h-full w-full object-cover" />
        </button>

        <div
            v-if="open"
            class="absolute right-0 z-20 mt-3 w-64 rounded-2xl border border-[#dde3d8] bg-white p-4 text-[#17352b] shadow-lg"
        >
          <p class="text-sm font-extrabold">Photo de profil</p>
          <p class="mt-0.5 text-[13px] text-[#4f5f56]">Choisissez un avatar.</p>

          <div class="mt-3 grid grid-cols-3 gap-3">
            <button
                v-for="avatar in avatars"
                :key="avatar.id"
                type="button"
                class="aspect-square overflow-hidden rounded-full border-2 bg-[#d8eadd] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d6a4f]"
                :class="selected.id === avatar.id ? 'border-[#2d6a4f] ring-2 ring-[#2d6a4f]/30' : 'border-transparent hover:border-[#c3cdc4]'"
                :aria-pressed="selected.id === avatar.id"
                :aria-label="avatar.label"
                @click="choose(avatar)"
            >
              <img :src="avatar.src" :alt="avatar.label" class="h-full w-full object-cover" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const emit = defineEmits(['avatar-change'])

const avatars = [
  { id: 1, src: '/avatars/avatar-1.png', label: 'Avatar 1' },
  { id: 2, src: '/avatars/avatar-2.png', label: 'Avatar 2' },
  { id: 3, src: '/avatars/avatar-3.png', label: 'Avatar 3' },
  { id: 4, src: '/avatars/avatar-4.png', label: 'Avatar 4' },
  { id: 5, src: '/avatars/avatar-5.png', label: 'Avatar 5' },
  { id: 6, src: '/avatars/avatar-6.png', label: 'Avatar 6' }
]

const selected = ref(avatars[0])
const open = ref(false)
const root = ref(null)

function choose(avatar) {
  selected.value = avatar
  open.value = false
  emit('avatar-change', avatar)
}

function onClickOutside(e) {
  if (root.value && !root.value.contains(e.target)) open.value = false
}

function onKeydown(e) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onKeydown)
})
</script>