<template>
  <main class="min-w-0 flex-1 p-4 md:p-8">
    <h1 class="mb-5 text-xl font-bold text-[#1c382c] md:text-2xl">Historique des mesures</h1>

    <section class="mb-4 flex flex-wrap items-end gap-4 rounded-2xl border border-[#dce4dd] bg-white p-4 sm:px-5">
      <div class="flex min-w-[160px] flex-1 flex-col gap-1.5 sm:flex-none">
        <label for="history-module" class="text-[13px] text-[#55655b]">Module</label>
        <select id="history-module" v-model="moduleId" :class="selectClass">
          <option v-for="module in modulesStore.modules" :key="module._id" :value="module._id">
            {{ module.name }}
          </option>
        </select>
      </div>

      <div class="flex min-w-[160px] flex-1 flex-col gap-1.5 sm:flex-none">
        <label for="history-type" class="text-[13px] text-[#55655b]">Type de mesure</label>
        <select id="history-type" v-model="type" :class="selectClass">
          <option v-for="item in types" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>

      <div class="flex flex-col gap-1.5">
        <p class="text-[13px] text-[#55655b]">Période</p>
        <div class="flex gap-1.5">
          <button
              v-for="item in periods"
              :key="item.key"
              type="button"
              :class="[
                'min-h-11 cursor-pointer rounded-lg px-3.5 text-sm transition-colors',
                period === item.key ? 'bg-[#14352a] font-bold text-white' : 'bg-[#eef2ec] hover:bg-[#e3eae1]'
              ]"
              @click="period = item.key"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </section>

    <section class="mb-4 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <div v-for="card in cards" :key="card.label"
           class="min-w-0 rounded-2xl border border-[#dce4dd] bg-white px-4 py-4 sm:px-5">
        <p class="truncate text-[13px] text-[#55655b]">{{ card.label }}</p>
        <p class="mt-1 truncate text-2xl font-extrabold text-[#1b2a22] sm:text-[28px]">
          {{ card.value }}<span v-if="card.unit" class="ml-1 text-sm font-medium">{{ card.unit }}</span>
        </p>
      </div>
    </section>
    <br>

    <section class="rounded-2xl border border-[#dce4dd] bg-white p-4 sm:p-5 mb-8" ref="chartContainer">
      <h2 class="mb-3 font-extrabold text-[#1b2a22]">Évolution, {{ selectedModuleName }}</h2>
      <LineChart
          :points="chartPoints"
          :unit="units[type]"
          :color="chartColors[type].line"
          :area-color="chartColors[type].area"
          empty-text="Aucune mesure sur cette période"
      />
    </section>


    <section class="rounded-2xl border border-[#dce4dd] bg-white p-4 sm:p-5">

      <div class="overflow-x-auto">
        <table class="w-full min-w-[500px] text-sm">
          <thead>
          <tr class="border-b border-[#dce4dd] text-left text-[#55655b]">
            <th class="text-[#1b2a22] px-2 py-3 font-bold">Date</th>
            <th class="text-[#1b2a22] px-2 py-3 font-bold">Module</th>
            <th class="text-[#1b2a22] px-2 py-3 font-bold">Type</th>
            <th class="text-[#1b2a22] px-2 py-3 text-right font-bold">Valeur</th>
          </tr>
          </thead>

          <tbody>
          <tr
              v-for="measure in paginatedMeasures"
              :key="measure.id"
              class="border-b border-[#dce4dd] last:border-0"
          >
            <td class="px-2 py-3 text-[#35483c]">
              {{ formatDate(measure.date) }}
            </td>

            <td class="px-2 py-3 text-[#35483c]">
              {{ selectedModuleName }}
            </td>

            <td class="px-2 py-3 text-[#35483c]">
              {{ measure.type }}
            </td>

            <td class="px-2 py-3 text-[#35483c] text-right">
              {{ formatType(measure.value, measure.type) }}
            </td>
          </tr>

          <tr v-if="!paginatedMeasures.length">
            <td colspan="4" class="py-8 text-center text-[#829087]">
              Aucune mesure disponible
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p class="text-xs text-[#718076]">
          {{ startIndex + 1 }} à {{ endIndex }} sur {{ filteredMeasures.length }} mesures
        </p>

        <div class="flex gap-2">
          <button
              type="button"
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="rounded-lg border border-[#c7d2c9] px-3.5 py-2.5 text-sm
               transition-colors hover:bg-[#eef2ec]
               disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            Précédent
          </button>

          <button
              type="button"
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="rounded-lg border border-[#c7d2c9] px-3.5 py-2.5 text-sm
               transition-colors hover:bg-[#eef2ec]
               disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            Suivant
          </button>
        </div>
      </div>

    </section>

  </main>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import LineChart from '@/components/charts/LineChart.vue'
import {useModulesStore} from '@/stores/modules/modules.store.js'
import {useMeasuresStore} from '@/stores/modules/measures.store.js'
import {formatDate, formatType} from "@/utils/formatter.js";

const modulesStore = useModulesStore()
const measuresStore = useMeasuresStore()

const currentPage = ref(1)
const pageSize = 5

const chartColors = {
  temperature: {line: '#c9731a', area: '#f6e3c8'},
  humidity: {line: '#2f6b8f', area: '#d9e8f2'},
  pm25: {line: '#6b5b8f', area: '#e4def0'}
}

const filteredMeasures = computed(() =>
    measuresStore.measures.filter(measure =>
        measure.type === type.value
        && measure.module === moduleId.value
        && new Date(measure.date) >= periods.find(p => p.key === period.value).from()
    )
)

const totalPages = computed(() =>
    Math.ceil(filteredMeasures.value.length / pageSize)
)

const startIndex = computed(() =>
    (currentPage.value - 1) * pageSize
)

const endIndex = computed(() =>
    Math.min(startIndex.value + pageSize, filteredMeasures.value.length)
)

const paginatedMeasures = computed(() =>
    filteredMeasures.value.slice(startIndex.value, endIndex.value)
)



const DAY = 24 * 60 * 60 * 1000
const types = ['temperature', 'humidity', 'pm25']
const units = {temperature: '°C', humidity: '%', pm25: 'µg/m³'}

const periods = [
  {key: '24h', label: '24 h', from: () => new Date(Date.now() - DAY)},
  {key: '7d', label: '7 j', from: () => new Date(Date.now() - 7 * DAY)},
  {key: '30d', label: '30 j', from: () => new Date(Date.now() - 30 * DAY)},
]

const selectClass =
    'min-h-11 rounded-lg border border-[#c7d2c9] bg-white px-3 text-sm outline-none focus:border-[#285d49]'

const moduleId = ref('')
const type = ref('temperature')
const period = ref('7d')
const stats = ref(null)
const chartPoints = ref([])
const chartContainer = ref(null)

const selectedModuleName = computed(() =>
    modulesStore.modules.find(module => module._id === moduleId.value)?.name ?? ''
)

const format = (value, digits = 2) =>
    Number.isFinite(value) ? value.toFixed(digits).replace('.', ',') : '—'

const cards = computed(() => {
  const unit = units[type.value]
  return [
    {label: 'Minimum', value: format(stats.value?.min), unit},
    {label: 'Moyenne', value: format(stats.value?.avg), unit},
    {label: 'Maximum', value: format(stats.value?.max), unit},
    {label: 'Mesures sur la période', value: (stats.value?.count ?? 0).toLocaleString('fr-FR'), unit: ''}
  ]
})

const loadData = async () => {
  if (!moduleId.value) return
  const item = periods.find(p => p.key === period.value)
  const from = item.from().toISOString()
  const to = new Date().toISOString()

  await Promise.all([
    measuresStore.getMeasuresStats(moduleId.value, type.value, from, to),
    measuresStore.getMeasuresChartData(moduleId.value, type.value, from, to)
  ])

  stats.value = measuresStore.measuresStats
  chartPoints.value = measuresStore.measuresChartData
  currentPage.value = 1
}

watch([moduleId, type, period], loadData)

onMounted(async () => {
  await modulesStore.getModules()
  await measuresStore.getMeasures()
  moduleId.value = modulesStore.modules[0]?._id ?? ''
})
</script>