<template>
  <main class="min-w-0 flex-1 p-4 md:p-8">
    <h1 class="text-xl font-bold text-[#1c382c] md:text-2xl">Modules et mesures</h1>
    <h2 class="mb-5 truncate text-sm text-[#718078] sm:text-base">
      {{ modulesStore.getOnlineModules().length }} module(s) en ligne / {{ modulesStore.modules.length }} au total
    </h2>

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
          <span v-for="chipset in module.chipsets" :key="chipset"
                class="rounded-md bg-[#edf1eb] px-2 py-1 text-xs text-[#46564d]">
            {{ chipsetsStore.getChipsetById(chipset)?.name }}
          </span>
        </div>

        <div class="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div v-for="measure in moduleMeasures(module._id)" :key="measure.type" class="min-w-0">
            <p class="truncate text-sm text-[#718078] sm:text-base">{{ measure.type }}</p>
            <p class="text-xl font-bold text-[#1c3028] sm:text-2xl">
              {{ measure.value }}
              <span v-if="measure.type === 'temperature'">°C</span>
              <span v-else-if="measure.type === 'humidity'">%</span>
            </p>
            <p v-if="measure.trend" :class="['mt-0.5 flex items-center gap-1 text-xs font-semibold', TREND_COLORS[measure.trend.direction]]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                   stroke="currentColor" class="size-3 shrink-0" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" :d="TREND_PATHS[measure.trend.direction]"/>
              </svg>
              {{ trendLabel(measure.trend) }}
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

// depending on the trend direction, return the corresponding SVG path and color class
const TREND_PATHS = {
  up: 'm4.5 15.75 7.5-7.5 7.5 7.5',
  down: 'm19.5 8.25-7.5 7.5-7.5-7.5',
  flat: 'M4.499 8.248h15m-15 7.501h15'
}

// svg colors
const TREND_COLORS = {
  up: 'text-[#2f9e5b]',
  down: 'text-[#d64545]',
  flat: 'text-[#718078]'
}

// get the trend direction and percent change for a measure
const trend = (measure) => {
  const current = Number(measure.value)
  const previous = Number(measure.previous?.value)
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return null
  const delta = current - previous
  return {
    direction: delta === 0 ? 'flat' : delta > 0 ? 'up' : 'down',
    percent: previous === 0 ? null : (delta / Math.abs(previous)) * 100
  }
}

// get the percent change and direction of the trend for a measure
const trendLabel = ({direction, percent}) => {
  if (direction === 'flat') return 'stable'
  if (percent === null) return ''
  return `${percent > 0 ? '+' : ''}${percent.toFixed(1).replace('.', ',')} %`
}

const moduleMeasures = (moduleId) =>
    measuresStore.latestMeasures
        .filter(m => m.module === moduleId)
        .map(m => ({...m, trend: trend(m)}))

onMounted(() =>
    Promise.all([
      modulesStore.getModules(),
      chipsetsStore.getChipsets(),
      measuresStore.getLatestMeasures()
    ])
)
</script>