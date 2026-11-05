<template>
  <main class="min-w-0 flex-1 p-4 md:p-8">
    <h1 class="text-xl font-bold text-[#1c382c] md:text-2xl">Modules et mesures</h1>
    <h2 class="truncate text-sm text-[#718078] sm:text-base mb-5"> {{ modulesStore.getOnlineModules().length }} module(s) en ligne / {{ modulesStore.modules.length }} au total</h2>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <div
          v-for="module in modulesStore.modules"
          :key="module._id"
          class="w-full min-w-0 rounded-2xl border border-[#183d30] bg-white p-4 sm:p-5"
      >
        <div class="mb-3 flex items-start justify-between gap-2">
          <div class="min-w-0">
            <h3 class="truncate text-[17px] font-bold leading-5 text-[#1c3028]">{{ module.name }}</h3>
            <p class="truncate text-sm text-[#718078]">{{ module.shortName }}, {{ module.uc }}</p>
          </div>
          <span class="shrink-0 rounded-full bg-[#d8ecdf] px-3 py-1 text-xs font-medium text-[#286642]">
            {{ module.status }}
          </span>
        </div>

        <div class="mb-3 flex flex-wrap gap-1.5">
          <span
              v-for="chipset in module.chipsets"
              :key="chipset"
              class="rounded-md bg-[#edf1eb] px-2 py-1 text-xs text-[#46564d]"
          >
            {{ chipsetsStore.getChipsetById(chipset)?.name }}
          </span>
        </div>

        <div class="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div
              v-for="measure in measuresStore.latestMeasures.filter(m => m.module === module._id)"
              :key="measure.type"
              class="min-w-0"
          >
            <p class="truncate text-sm text-[#718078] sm:text-base">{{ measure.type }}</p>
            <p class="text-xl font-bold text-[#1c3028] sm:text-2xl">
              {{ measure.value }}
              <span v-if="measure.type === 'temperature'">°C</span>
              <span v-else-if="measure.type === 'humidity'">%</span>
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between gap-2 border-t border-[#dfe6df] pt-3">
          <p class="text-xs text-[#718078]">
            Envoi toutes les <span class="font-semibold text-[#1c3028]">{{ module.sendInterval }} s</span>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import {onMounted} from 'vue'
import {useModulesStore} from '@/stores/modules/modules.store.js'
import {useChipsetsStore} from '@/stores/modules/chipsets.store.js'
import {useMeasuresStore} from '@/stores/modules/measures.store.js'

const modulesStore = useModulesStore()
const chipsetsStore = useChipsetsStore()
const measuresStore = useMeasuresStore()

onMounted(() =>
    Promise.all([
      modulesStore.getModules(),
      chipsetsStore.getChipsets(),
      measuresStore.getMeasures(),
      measuresStore.getLatestMeasures(),
    ])
)
</script>