
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
          class="h-[70vh] min-h-[500px] w-full rounded-lg"
      ></div>
    </div>

    <div class="mx-5 overflow-x-auto rounded-2xl border border-[#dce4dd] bg-white px-5 pb-3 pt-2">

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
        >
          <td class="px-2 py-3.5">
            <p class="font-extrabold text-[#1b2a22]">
              {{ zone.nom }}
            </p>
          </td>

          <td class="px-2 py-3.5">
            {{ zone.garde.name }}
          </td>

          <td class="px-2 py-3.5">
            {{ zone.niveauSecheresse }}
          </td>
        </tr>

        <tr v-if="zonesStore.zones.length === 0">
          <td colspan="3" class="px-2 py-6 text-center text-[#55655b]">
            Aucune zone enregistrée
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import intersect from '@turf/intersect';
import { feature, featureCollection } from '@turf/helpers';
import { useZonesStore } from '@/stores/modules/zones.store.js';
import { useAuthStore } from '@/stores/modules/auth.store.js';

const zonesStore = useZonesStore();
const authStore = useAuthStore();

const mapEl = ref(null);
const recherche = ref('');
let map;
let marqueur;
const geometries = [];

const style = (zone) => ({
  color: zone.garde._id === authStore.currentUser.id ? '#2e7d32' : '#e65100',
  weight: 2,
  fillOpacity: 0.35
});

function dessiner(zone) {
  const layer = L.geoJSON(zone.geometrie, { style: style(zone) }).addTo(map);
  layer.bindTooltip(`${zone.nom} appartenant à ${zone.garde.name}`);
  geometries.push(zone.geometrie);
}

// intersect return null if polygons aren't touching each other
function chevauche(geometrie) {
  const nouvelle = feature(geometrie);
  try {
    return geometries.some(g => intersect(featureCollection([nouvelle, feature(g)])) !== null);
  } catch {
    // invalid polygon
    return true;
  }
}

function createZone({ layer }) {
  const geometrie = layer.toGeoJSON().geometry;
  layer.remove();

  if (chevauche(geometrie)) {
    alert('Cette zone chevauche une zone déjà prise');
    return;
  }

  const nom = prompt('Zone name');
  if (!nom?.trim()) return;

  const zone = {
    nom: nom.trim(),
    garde: authStore.currentUser,
    geometrie
  };

  zonesStore.createZone({
    nom: nom.trim(),
    geometrie,
    garde: authStore.currentUser,
  });

  dessiner(zone);
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