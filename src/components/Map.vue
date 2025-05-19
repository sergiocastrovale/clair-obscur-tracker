<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue';
import L, { type LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapPin, LocationPin } from '@/types/map';
import { getPinStyleClasses } from '@/utils/pins';
import { MIN_DISPLAY_ZOOM, MAX_DISPLAY_ZOOM, MAX_NATIVE_ZOOM, TILE_URL_TEMPLATE, MAP_WIDTH, MAP_HEIGHT, SCALING_FACTOR } from '@/utils/constants';
import PinDialog from '@/components/PinDialog.vue';
import { useMapStore } from '@/stores/mapStore';
import CheckAllToast from '@/components/CheckAllToast.vue';

const mapStore = useMapStore();

const mapContainerRef = ref<HTMLElement | null>(null);
const mapInstance = ref<L.Map | null>(null);
const markers = ref<L.Marker[]>([]);
const checkAllToastRef = ref<InstanceType<typeof CheckAllToast> | null>(null);

const filteredPins = computed(() => mapStore.filteredPins);
const selectedPin = computed(() => mapStore.selectedPin);
const isDialogVisible = computed(() => mapStore.isDialogVisible);

const handleResize = () => {
  if (mapInstance.value) {
    mapInstance.value.invalidateSize();
  }
};

const initMap = () => {
  if (!mapContainerRef.value) {
    console.error("Map container ref not found.");
    return;
  }

  mapInstance.value = L.map(mapContainerRef.value, {
    crs: L.CRS.Simple,
    minZoom: MIN_DISPLAY_ZOOM,
    maxZoom: MAX_DISPLAY_ZOOM,
    attributionControl: false,
    zoomControl: false,
  });

  if (mapInstance.value) {
    L.tileLayer(TILE_URL_TEMPLATE, {
      noWrap: true,
      minZoom: MIN_DISPLAY_ZOOM,
      maxZoom: MAX_NATIVE_ZOOM,
      tileSize: 128,
      tms: false,
    }).addTo(mapInstance.value as L.Map);

    // Add zoom controls at the bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.value as L.Map);

    // Disable shift+drag to zoom (boxZoom)
    (mapInstance.value as L.Map).boxZoom.disable();

  } else {
    console.error("Map instance not available for bounds calculation.");
  }
};

const clearPinsFromMap = () => {
  markers.value.forEach(marker => marker.remove());
  markers.value = [];
};

const addPinToMap = (pinObject: MapPin) => {
  if (!mapInstance.value || !pinObject || typeof pinObject.x !== 'number' || typeof pinObject.y !== 'number') {
    return;
  }
  const { x, y, label, iconOptions, type } = pinObject;

  const bossesData = type === 'location' ? (pinObject as LocationPin).details?.bosses : undefined;
  const completed = mapStore.isPinComplete(label, type, bossesData);
  const { pinColorClass, borderColorClass, circleOpacityClass, labelOpacityClass } = getPinStyleClasses(completed, type);

  const pinContentHtml = `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div class="w-5 h-5 rounded-full border-2 ${borderColorClass} shadow-xl ${pinColorClass} ${circleOpacityClass}"></div>
      ${label ? `<div class="pin-label text-xs text-neutral-200 text-center whitespace-nowrap ${labelOpacityClass}">${label}</div>` : ''}
    </div>
  `;
  const iconWidth = 80;
  const circleHeight = 20;
  const labelHeight = label ? 15 : 0;
  const iconHeight = circleHeight + labelHeight + (label ? 2 : 0);
  const divIconOptions: L.DivIconOptions = {
    html: pinContentHtml, className: 'map-pin-custom-container',
    iconSize: [iconWidth, iconHeight], iconAnchor: [iconWidth / 2, circleHeight / 2],
    popupAnchor: [0, -(circleHeight / 2)]
  };
  const finalIconOptionsToUse = { ...divIconOptions, ...iconOptions };
  const scaledX = x * SCALING_FACTOR;
  const scaledY = y * SCALING_FACTOR;
  const point = mapInstance.value.unproject([scaledX, scaledY], MAX_NATIVE_ZOOM);
  const customIcon = L.divIcon(finalIconOptionsToUse);
  const marker = L.marker(point, { icon: customIcon });

  (marker as any)._pinData = {
    label: label,
    type: type,
    bosses: bossesData,
  };

  if (!mapInstance.value) {
    return;
  }

  marker.on('click', (e: LeafletMouseEvent) => {
    if (e.originalEvent.shiftKey) {
      const toastParams = mapStore.handleShiftClickPin(pinObject);
      if (toastParams && checkAllToastRef.value) {
        checkAllToastRef.value.show(toastParams);
      }
    } else {
      mapStore.openPinDialog(pinObject);
    }
  });
  marker.addTo(mapInstance.value as L.Map);
  markers.value.push(marker);
  return marker;
};

watch(filteredPins, (newPins) => {
  if (!mapInstance.value) return;
  clearPinsFromMap();
  newPins.forEach(pin => addPinToMap(pin));
  updatePinLabelSizes();
}, { immediate: false });

const panToPin = (pixelX: number, pixelY: number, zoomLevel: number = MAX_NATIVE_ZOOM) => {
  if (!mapInstance.value) return;
  const scalingFactor = SCALING_FACTOR;
  const scaledX = pixelX * scalingFactor; const scaledY = pixelY * scalingFactor;
  const point = mapInstance.value.unproject([scaledX, scaledY], MAX_NATIVE_ZOOM);
  mapInstance.value.setView(point, zoomLevel);
};

function updatePinLabelSizes() {
  if (!mapInstance.value) {
    return;
  }

  const zoom = mapInstance.value.getZoom();
  const labels = document.querySelectorAll('.pin-label');
  labels.forEach((labelEl) => {
    if (labelEl instanceof HTMLElement) {
      labelEl.style.fontSize = `${14 + zoom}px`;
    }
  });
}

const calculateOptimalZoom = (): number => {
  if (!mapInstance.value) {
    return 2;
  }

  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const imageHeight = MAP_HEIGHT;
  const imageWidth = MAP_WIDTH;
  const viewportRatio = viewportWidth / viewportHeight;
  const imageRatio = imageWidth / imageHeight;
  const zoomFactor = Math.log2(viewportHeight / imageHeight);
  const calculatedZoom = MAX_NATIVE_ZOOM + zoomFactor;
  let optimalZoom = Math.floor(calculatedZoom);

  if (viewportRatio > imageRatio * 1.5) {
    optimalZoom += 1;
  }

  optimalZoom += 1;

  return Math.min(MAX_DISPLAY_ZOOM, Math.max(MIN_DISPLAY_ZOOM, optimalZoom));
};

const updateMarkerAppearance = (marker: L.Marker<any>) => {
  const pinData = (marker as any)._pinData;
  if (!pinData) return;

  const { label, type, bosses } = pinData;
  const completed = mapStore.isPinComplete(label, type, bosses);
  const { pinColorClass, borderColorClass, circleOpacityClass, labelOpacityClass } = getPinStyleClasses(completed, type as 'location' | 'boss');

  const pinContentHtml = `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div class="w-5 h-5 rounded-full border-2 ${borderColorClass} shadow-xl ${pinColorClass} ${circleOpacityClass}"></div>
      ${label ? `<div class="pin-label text-xs text-neutral-200 text-center whitespace-nowrap ${labelOpacityClass}">${label}</div>` : ''}
    </div>
  `;
  const iconWidth = 80; const circleHeight = 20; const labelHeight = label ? 15 : 0;
  const iconHeight = circleHeight + labelHeight + (label ? 2 : 0);
  const divIconOptions: L.DivIconOptions = {
    html: pinContentHtml, className: 'map-pin-custom-container',
    iconSize: [iconWidth, iconHeight], iconAnchor: [iconWidth / 2, circleHeight / 2],
    popupAnchor: [0, -(circleHeight / 2)]
  };
  const newIcon = L.divIcon(divIconOptions);
  marker.setIcon(newIcon);
};

const handleCheckedStatesUpdateForStore = () => {
  markers.value.forEach(marker => {
    updateMarkerAppearance(marker as L.Marker<any>);
  });

  updatePinLabelSizes();
};

onMounted(() => {
  mapStore.initializeStore();
  initMap();
  window.addEventListener('resize', handleResize);
  document.addEventListener('appDataSaved', handleCheckedStatesUpdateForStore);

  if (mapInstance.value) {
    const mapPane = mapInstance.value.getPane('mapPane');

    if (mapPane) {
      mapPane.style.backgroundColor = 'transparent';
    }

    const tilePane = mapInstance.value.getPane('tilePane');

    if (tilePane) {
      tilePane.style.backgroundColor = 'transparent';
    }

    const container = mapInstance.value.getContainer();

    if (container) {
        container.style.backgroundColor = 'transparent';
    }

    const southWest = mapInstance.value.unproject([0, MAP_HEIGHT], MAX_NATIVE_ZOOM);
    const northEast = mapInstance.value.unproject([MAP_WIDTH, 0], MAX_NATIVE_ZOOM);
    const bounds = new L.LatLngBounds(southWest, northEast);
    const center = bounds.getCenter();
    const optimalZoom = calculateOptimalZoom();

    mapInstance.value.setView(center, optimalZoom);

    mapInstance.value.whenReady(() => {
      nextTick(() => {
        updatePinLabelSizes();
      });
    });
    mapInstance.value.invalidateSize();
    mapInstance.value.on('zoomend', updatePinLabelSizes);
  }
});

onBeforeUnmount(() => {
  if (mapInstance.value) {
    mapInstance.value.remove();
  }
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('appDataSaved', handleCheckedStatesUpdateForStore);
});

defineExpose({
  panToPin,
  getMapInstance: () => mapInstance.value
});
</script>

<template>
  <div id="map-container" ref="mapContainerRef" class="w-full h-[calc(100%-108px)] fixed top-[108px] left-0" />
  <PinDialog
    v-if="isDialogVisible"
    :pin="selectedPin!"
    :visible="isDialogVisible"
    @update:visible="(newVisibilityState) => { if (!newVisibilityState) mapStore.closePinDialog(); }"
    @close="mapStore.closePinDialog"
  />
  <CheckAllToast ref="checkAllToastRef" />
</template>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}
</style>

