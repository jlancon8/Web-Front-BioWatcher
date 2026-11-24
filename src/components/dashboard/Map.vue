<template>
  <div ref="mapEl" class="map"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

// à remplacer par l'utilisateur connecté
const currentGarde = { _id: 'g1', prenom: 'Paul', nom: 'Martin' };

// à remplacer par le fetch de /api/zones
const zones = ref([
  {
    _id: 'z1',
    nom: 'Zone exemple',
    garde: { _id: 'g2', prenom: 'Julie', nom: 'Durand' },
    geometrie: {
      type: 'Polygon',
      coordinates: [[[6.0, 47.28], [6.08, 47.28], [6.08, 47.25], [6.0, 47.25], [6.0, 47.28]]]
    }
  }
]);

const mapEl = ref(null);
let map;

const style = (zone) => ({
  color: zone.garde._id === currentGarde._id ? '#2e7d32' : '#e65100',
  weight: 2,
  fillOpacity: 0.35
});

function dessiner(zone) {
  const layer = L.geoJSON(zone.geometrie, { style: style(zone) }).addTo(map);
  layer.bindTooltip(`${zone.nom} (${zone.garde.prenom} ${zone.garde.nom})`);
}

function creerZone({ layer }) {
  const geometrie = layer.toGeoJSON().geometry;
  layer.remove();

  const nom = prompt('nom de la zone');
  if (!nom?.trim()) return;

  // à remplacer par le post /api/zones, le serveur renvoie la zone créée
  const zone = {
    _id: crypto.randomUUID(),
    nom: nom.trim(),
    garde: currentGarde,
    geometrie
  };

  zones.value.push(zone);
  dessiner(zone);
}

onMounted(() => {
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
  map.on('pm:create', creerZone);

  zones.value.forEach(dessiner);

  setTimeout(() => map.invalidateSize(), 0);
});

onBeforeUnmount(() => map?.remove());
</script>

<style scoped>
.map {
  width: 100%;
  height: 600px;
}
</style>