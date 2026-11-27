<template>
  <div class="flex w-full flex-col gap-4">

    <div class="m-5 flex flex-col gap-2">
      <form class="flex gap-2" @submit.prevent="rechercher">
        <input
            v-model="recherche"
            placeholder="lat, lng (ex : 47.6377, 6.8629)"
            class="flex-1 rounded-md border border-gray-300 p-2"
        />

        <button
            type="submit"
            class="rounded-md bg-green-700 px-4 py-2 text-white hover:bg-green-800"
        >
          Aller
        </button>
      </form>

      <div
          ref="mapEl"
          class="relative z-0 h-[70vh] min-h-[500px] w-full rounded-lg"
      ></div>
    </div>

    <div class="mx-5 mb-5 grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
      <div class="overflow-x-auto rounded-2xl border border-[#dce4dd] bg-white px-5 pb-3 pt-2">
        <h2 class="py-3 text-lg font-bold text-[#1b2a22]">
          Liste des zones
        </h2>

        <table class="w-full min-w-[560px] border-collapse text-sm">
          <thead>
          <tr class="text-left text-[13px] text-[#55655b]">
            <th class="px-2 py-3.5 font-medium">Nom</th>
            <th class="px-2 py-3.5 font-medium">Garde affecté</th>
            <th class="px-2 py-3.5 font-medium">Niveau de sécheresse</th>
          </tr>
          </thead>

          <tbody>
          <tr
              v-for="zone in zonesStore.zones"
              :key="zone._id"
              :class="['cursor-pointer border-t border-[#e3e9e4]', selectedId === zone._id ? 'bg-[#eaf3ec]' : 'hover:bg-[#f5f8f5]']"
              @click="selectedId = zone._id"
          >
            <td class="px-2 py-3.5">
              <p class="font-extrabold text-[#1b2a22]">
                {{ zone.nom }}
              </p>
            </td>

            <td class="px-2 py-3.5">
              {{ zone.garde?.name }}
            </td>

            <td class="px-2 py-3.5">
              {{ zone.niveauSecheresse }}
            </td>
          </tr>

          <tr v-if="!zonesStore.zones?.length" class="border-t border-[#e3e9e4]">
            <td colspan="3" class="px-2 py-6 text-center text-[#55655b]">
              Aucune zone enregistrée
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <aside
          v-if="selectedZone"
          class="flex flex-col gap-4 rounded-2xl border border-[#dce4dd] bg-white p-5 md:p-6"
      >
        <h2 class="truncate text-[17px] font-extrabold text-[#1b2a22]">{{ selectedZone.nom }}</h2>

        <form
            class="flex flex-col gap-4"
            :class="canEdit ? '' : 'opacity-50'"
            @submit.prevent="showUpdateDialog = true"
        >
          <fieldset :disabled="!canEdit" class="flex min-w-0 flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label for="zone-name" class="text-[13px] text-[#55655b]">Nom</label>
              <input
                  id="zone-name"
                  v-model="form.nom"
                  type="text"
                  class="min-h-11 rounded-[10px] border border-[#c7d2c9] bg-white px-3.5 text-sm outline-none focus:border-[#285d49]"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <p class="text-[13px] text-[#55655b]">Garde affecté</p>
              <p class="text-sm text-[#1b2a22]">{{ selectedZone.garde?.name }}</p>
            </div>

            <div class="flex flex-col gap-1.5">
              <p class="text-[13px] text-[#55655b]">Niveau de sécheresse</p>
              <p class="text-sm text-[#1b2a22]">{{ selectedZone.niveauSecheresse }}</p>
            </div>

            <button
                type="submit"
                :disabled="!isDirty || !isValid"
                class="min-h-11 cursor-pointer rounded-[10px] bg-[#14352a] px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Enregistrer
            </button>
          </fieldset>
        </form>

        <div class="flex items-center justify-between gap-3 border-t border-[#e3e9e4] pt-4">
          <p class="text-[13px] text-[#55655b]">Supprimer cette zone</p>
          <button
              type="button"
              :disabled="!canEdit"
              :class="canEdit ? '' : 'opacity-50'"
              class="min-h-11 shrink-0 cursor-pointer rounded-lg border border-[#e5b0a6] bg-white px-3.5 text-[13px] font-bold text-[#8a1f10] hover:bg-[#fdf1ee] disabled:cursor-not-allowed"
              @click="showDeleteDialog = true"
          >
            Supprimer
          </button>
        </div>
      </aside>

      <aside
          v-else
          class="rounded-2xl border border-dashed border-[#c7d2c9] bg-white p-6 text-center text-sm text-[#55655b]"
      >
        Sélectionnez une zone dans la liste pour modifier ses réglages
      </aside>
    </div>

    <ConfirmDeleteDialog
        v-model="showDeleteDialog"
        title="Supprimer la zone"
        :confirm-text="selectedZone?.nom ?? ''"
        :loading="deleting"
        @confirm="deleteZone"
    >
      Cette action est irréversible. La zone sera définitivement supprimée.
    </ConfirmDeleteDialog>

    <ConfirmUpdateDialog
        v-model="showUpdateDialog"
        title="Enregistrer les modifications"
        :loading="saving"
        @confirm="confirmUpdate"
    >
      Le nom de la zone {{ selectedZone?.nom }} sera mis à jour.
    </ConfirmUpdateDialog>

  </div>
</template>


<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import intersect from '@turf/intersect';
import { feature, featureCollection } from '@turf/helpers';
import ConfirmDeleteDialog from '@/components/common/ConfirmDeleteDialog.vue';
import ConfirmUpdateDialog from '@/components/common/ConfirmUpdateDialog.vue';
import { useZonesStore } from '@/stores/modules/zones.store.js';
import { useAuthStore } from '@/stores/modules/auth.store.js';

const zonesStore = useZonesStore();
const authStore = useAuthStore();

const mapEl = ref(null);
const recherche = ref('');
let map;
let marqueur;
const geometries = [];

const selectedId = ref(null);
const form = ref({ nom: '' });
const showDeleteDialog = ref(false);
const deleting = ref(false);
const showUpdateDialog = ref(false);
const saving = ref(false);
const layers = new Map();

const selectedZone = computed(() =>
    zonesStore.zones?.find(z => z._id === selectedId.value) ?? null
);

const isAdmin = computed(() =>
    authStore.currentUser.rights.some(r => r.startsWith('admin'))
);

const canEdit = computed(() =>
    !!selectedZone.value &&
    (isAdmin.value || selectedZone.value.garde?._id === authStore.currentUser.id)
);

const isDirty = computed(() =>
    !!selectedZone.value && form.value.nom.trim() !== selectedZone.value.nom
);

const isValid = computed(() => form.value.nom.trim() !== '');

const style = (zone) => ({
  color: zone.garde._id === authStore.currentUser.id ? '#2e7d32' : '#e65100',
  weight: 2,
  fillOpacity: 0.35
});

function dessiner(zone) {
  const layer = L.geoJSON(zone.geometrie, { style: style(zone) }).addTo(map);
  layer.bindTooltip(`${zone.nom} appartenant à ${zone.garde.name}`);
  layers.set(zone._id, layer);
}

// if a zone is in the polygon the user defined, then return true, otherwise return false
function chevauche(geometrie) {
  const nouvelle = feature(geometrie);
  try {
    return (zonesStore.zones ?? []).some(z =>
        intersect(featureCollection([nouvelle, feature(z.geometrie)])) !== null
    );
  } catch {
    return true;
  }
}

async function createZone({ layer }) {
  const geometrie = layer.toGeoJSON().geometry;
  layer.remove();

  if (chevauche(geometrie)) {
    alert('Cette zone chevauche une zone déjà prise');
    return;
  }

  const nom = prompt('Nom de la zone');
  if (!nom?.trim()) return;

  const zone = await zonesStore.createZone({
    nom: nom.trim(),
    geometrie,
    garde: authStore.currentUser,
  });

  if (zone) dessiner(zone);
}

async function deleteZone() {
  const id = selectedZone.value._id;
  deleting.value = true;
  await zonesStore.deleteZone(id);
  deleting.value = false;
  showDeleteDialog.value = false;

  if (!zonesStore.zones.some(z => z._id === id)) {
    layers.get(id)?.remove();
    layers.delete(id);
    selectedId.value = null;
  }
}

async function confirmUpdate() {
  const id = selectedZone.value._id;
  saving.value = true;
  await zonesStore.updateZone(id, { nom: form.value.nom.trim() });
  saving.value = false;
  showUpdateDialog.value = false;

  const zone = zonesStore.zones.find(z => z._id === id);
  if (zone) layers.get(id)?.setTooltipContent(`${zone.nom} appartenant à ${zone.garde.name}`);
}

function rechercher() {
  const [lat, lng, ...reste] = recherche.value.trim().split(/[,;\s]+/).map(Number);
  const valide = reste.length === 0
      && Number.isFinite(lat) && Number.isFinite(lng)
      && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

  if (!valide) {
    alert('Format attendu : latitude, longitude (ex : 47.6377, 6.8629)');
    return;
  }

  marqueur?.remove();
  marqueur = L.marker([lat, lng]).addTo(map);
  map.setView([lat, lng], 15);
}

watch(selectedZone, (zone) => {
  form.value = { nom: zone?.nom ?? '' };
});

onMounted(async () => {
  await zonesStore.getZones();
  map = L.map(mapEl.value).setView([47.6377, 6.8629], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  map.pm.addControls({
    position: 'topleft',
    drawPolygon: true,
    drawMarker: false,
    drawPolyline: false,
    drawCircle: false,
    drawCircleMarker: false,
    drawRectangle: false,
    drawText: false,
    editMode: false,
    dragMode: false,
    cutPolygon: false,
    rotateMode: false,
    removalMode: false
  });
  map.on('pm:create', createZone);

  zonesStore.zones?.forEach(dessiner);

  setTimeout(() => map.invalidateSize(), 0);

});

onBeforeUnmount(() => map?.remove());
</script>