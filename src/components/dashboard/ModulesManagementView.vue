<template>
  <main class="min-w-0 flex-1 p-4 md:p-8">
    <h1 class="mb-4 text-xl font-bold text-[#1c382c] md:text-2xl">Gestion des modules</h1>

    <div class="mb-4 flex flex-col gap-3 sm:flex-row">
      <input
          v-model="search"
          type="text"
          placeholder="Rechercher un module"
          aria-label="Rechercher un module"
          class="min-h-11 flex-1 rounded-[10px] border border-[#c7d2c9] bg-white px-3.5 text-sm outline-none focus:border-[#285d49]"
      />
      <select
          v-model="statusFilter"
          aria-label="Filtrer par statut"
          class="min-h-11 rounded-[10px] border border-[#c7d2c9] bg-white px-3.5 text-sm outline-none focus:border-[#285d49]"
      >
        <option value="">Tous les statuts</option>
        <option value="online">En ligne</option>
        <option value="offline">Hors ligne</option>
      </select>
    </div>

    <div class="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
      <div class="overflow-x-auto rounded-2xl border border-[#dce4dd] bg-white px-5 pb-3 pt-2">
        <table class="w-full min-w-[560px] border-collapse text-sm">
          <thead>
          <tr class="text-left text-[13px] text-[#55655b]">
            <th class="px-2 py-3.5 font-medium">Module</th>
            <th class="px-2 py-3.5 font-medium">Chipsets</th>
            <th class="px-2 py-3.5 font-medium">Envoi</th>
            <th class="px-2 py-3.5 font-medium">Statut</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="module in filteredModules"
              :key="module._id"
              :class="['cursor-pointer border-t border-[#e3e9e4]', selectedId === module._id ? 'bg-[#eaf3ec]' : 'hover:bg-[#f5f8f5]']"
              @click="selectedId = module._id"
          >
            <td class="px-2 py-3.5">
              <p class="font-extrabold text-[#1b2a22]">{{ module.name }}</p>
              <p class="text-xs text-[#55655b]">{{ module.shortName }}, {{ module.uc }}</p>
            </td>
            <td class="px-2 py-3.5">
              <div class="flex flex-wrap gap-1.5">
                <span
                    v-for="chipset in module.chipsets"
                    :key="chipset"
                    class="rounded-md bg-[#eef2ec] px-2 py-1 text-xs text-[#46564d]"
                >
                  {{ chipsetsStore.getChipsetById(chipset)?.name }}
                </span>
              </div>
            </td>
            <td class="px-2 py-3.5">{{ module.sendInterval }} s</td>
            <td class="px-2 py-3.5">
              <span :class="statusClass(module.status)">{{ statusLabel(module.status) }}</span>
            </td>
          </tr>

          <tr v-if="filteredModules.length === 0" class="border-t border-[#e3e9e4]">
            <td colspan="4" class="px-2 py-6 text-center text-[#55655b]">Aucun module trouvé</td>
          </tr>
          </tbody>
        </table>
      </div>

      <aside
          v-if="selectedModule"
          class="flex flex-col gap-4 rounded-2xl border border-[#dce4dd] bg-white p-5 md:p-6"
      >
        <div class="flex items-center justify-between gap-2">
          <h2 class="truncate text-[17px] font-extrabold text-[#1b2a22]">{{ selectedModule.name }}</h2>
          <span :class="statusClass(selectedModule.status)">{{ statusLabel(selectedModule.status) }}</span>
        </div>

        <form class="flex flex-col gap-4" @submit.prevent="saveModule">
          <div class="flex flex-col gap-1.5">
            <label for="module-name" class="text-[13px] text-[#55655b]">Nom</label>
            <input id="module-name" v-model="form.name" type="text" :class="inputClass"/>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="module-short-name" class="text-[13px] text-[#55655b]">Nom court</label>
            <input id="module-short-name" v-model="form.shortName" type="text" :class="inputClass"/>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="module-interval" class="text-[13px] text-[#55655b]">
              Intervalle d'envoi des mesures (secondes)
            </label>
            <input
                id="module-interval"
                v-model.number="form.sendInterval"
                type="number"
                min="1"
                step="1"
                :class="[inputClass, 'w-32']"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <p class="text-[13px] text-[#55655b]">Chipsets</p>
            <div class="flex flex-wrap gap-1.5">
              <span
                  v-for="chipset in selectedModule.chipsets"
                  :key="chipset"
                  class="rounded-lg bg-[#eef2ec] px-2.5 py-1.5 text-[13px] text-[#46564d]"
              >
                {{ chipsetsStore.getChipsetById(chipset)?.name }}
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <p class="text-[13px] text-[#55655b]">Clé du module</p>
            <div class="flex items-center gap-2">
              <code class="min-w-0 flex-1 truncate rounded-lg bg-[#eef2ec] px-3 py-2.5 text-xs">
                {{ selectedModule.key }}
              </code>
              <button
                  type="button"
                  class="min-h-11 cursor-pointer rounded-lg border border-[#c7d2c9] bg-white px-3.5 text-[13px] hover:bg-[#f5f8f5]"
                  @click="copyKey"
              >
                {{ copied ? 'Copié' : 'Copier' }}
              </button>
            </div>
          </div>

          <div class="flex gap-2">
            <button
                type="submit"
                :disabled="!isDirty || !isValid"
                class="min-h-11 flex-1 cursor-pointer rounded-[10px] bg-[#14352a] px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Enregistrer
            </button>
            <button
                type="button"
                :disabled="!isDirty"
                class="min-h-11 cursor-pointer rounded-[10px] border border-[#c7d2c9] bg-white px-4 text-sm hover:bg-[#f5f8f5] disabled:cursor-not-allowed disabled:opacity-40"
                @click="resetForm"
            >
              Annuler
            </button>
          </div>
        </form>

        <div class="flex items-center justify-between gap-3 border-t border-[#e3e9e4] pt-4">
          <p class="text-[13px] text-[#55655b]">
            {{ confirmingDelete ? 'Ce module et ses mesures seront supprimés' : 'Supprimer ce module et ses mesures' }}
          </p>
          <div class="flex shrink-0 gap-2">
            <button
                v-if="confirmingDelete"
                type="button"
                class="min-h-11 cursor-pointer rounded-lg border border-[#c7d2c9] bg-white px-3.5 text-[13px] hover:bg-[#f5f8f5]"
                @click="confirmingDelete = false"
            >
              Non
            </button>
            <button
                type="button"
                class="min-h-11 cursor-pointer rounded-lg border border-[#e5b0a6] bg-white px-3.5 text-[13px] font-bold text-[#8a1f10] hover:bg-[#fdf1ee]"
                @click="confirmingDelete ? deleteModule() : (confirmingDelete = true)"
            >
              {{ confirmingDelete ? 'Confirmer' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </aside>

      <aside
          v-else
          class="rounded-2xl border border-dashed border-[#c7d2c9] bg-white p-6 text-center text-sm text-[#55655b]"
      >
        Sélectionnez un module dans la liste pour modifier ses réglages
      </aside>
    </div>
  </main>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useModulesStore} from '@/stores/modules/modules.store.js'
import {useChipsetsStore} from '@/stores/modules/chipsets.store.js'

const modulesStore = useModulesStore()
const chipsetsStore = useChipsetsStore()

const selectedId = ref(null)
const search = ref('')
const statusFilter = ref('')
const form = ref({name: '', shortName: '', sendInterval: 60})
const confirmingDelete = ref(false)
const copied = ref(false)

const inputClass =
    'min-h-11 rounded-lg border border-[#c7d2c9] px-3 text-sm outline-none focus:border-[#285d49]'

const selectedModule = computed(() =>
    modulesStore.modules.find(module => module._id === selectedId.value) ?? null
)

const filteredModules = computed(() =>
    modulesStore.modules.filter(module => {
      const matchesSearch = module.name.toLowerCase().includes(search.value.toLowerCase())
      const matchesStatus = statusFilter.value === '' || module.status === statusFilter.value
      return matchesSearch && matchesStatus
    })
)

// check if the form, for example the name, shortName or sendInterval has changed compared to the selected module
// if so, return true, otherwise return false
const isDirty = computed(() => {
  const module = selectedModule.value
  return !!module && (
      form.value.name !== module.name ||
      form.value.shortName !== module.shortName ||
      form.value.sendInterval !== module.sendInterval
  )
})

const isValid = computed(() =>
    form.value.name.trim() !== '' &&
    Number.isInteger(form.value.sendInterval) &&
    form.value.sendInterval >= 1
)

const statusLabel = (status) => (status === 'online' ? 'En ligne' : 'Hors ligne')

const statusClass = (status) => [
  'rounded-full px-2.5 py-1 text-xs font-bold',
  status === 'online' ? 'bg-[#d7ebdd] text-[#1e5a36]' : 'bg-[#f5c9c0] text-[#8a1f10]'
]

const resetForm = () => {
  const module = selectedModule.value
  if (!module) return
  form.value = {
    name: module.name,
    shortName: module.shortName ?? '',
    sendInterval: module.sendInterval
  }
}

const saveModule = async () => {
  await modulesStore.updateModule(selectedModule.value._id, {
    name: form.value.name.trim(),
    shortName: form.value.shortName.trim(),
    sendInterval: form.value.sendInterval
  })
}

const deleteModule = async () => {
  await modulesStore.deleteModule(selectedModule.value._id)
  confirmingDelete.value = false
  selectedId.value = null
}

// copy the module key
const copyKey = async () => {
  await navigator.clipboard.writeText(selectedModule.value.key)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}

watch(selectedModule, () => {
  resetForm()
  confirmingDelete.value = false
  copied.value = false
}, {immediate: true})

onMounted(() =>
    Promise.all([
      modulesStore.getModules(),
      chipsetsStore.getChipsets()
    ])
)
</script>