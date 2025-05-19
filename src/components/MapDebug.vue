<script setup>
import { ref, computed } from 'vue';
import { MAX_NATIVE_ZOOM, TILE_SIZE, TILE_BASE_PATH } from '@/utils/constants';

const MIN_ZOOM_LEVEL = 0;

const zoomLevelsData = ref([]);
const missingTiles = ref([]);
const loadedTiles = ref(new Set());

const totalTilesToLoad = computed(() => {
  return zoomLevelsData.value.reduce((acc, level) => acc + (level.numCols * level.numRows), 0);
});

const loadedTileCount = computed(() => loadedTiles.value.size);

const generateAllZoomLevelGrids = () => {
  console.log("Generating all zoom level grids for MapDebug (hardcoded config)...");
  const allLevels = [];
  missingTiles.value = [];
  loadedTiles.value.clear();

  for (let z = MIN_ZOOM_LEVEL; z <= MAX_NATIVE_ZOOM; z++) {
    const scaleFactor = Math.pow(2, MAX_NATIVE_ZOOM - z);

    let currentImageWidth;
    let currentImageHeight;

    if (scaleFactor === 1) {
      currentImageWidth = SOURCE_IMAGE_WIDTH;
      currentImageHeight = SOURCE_IMAGE_HEIGHT;
    } else {
      currentImageWidth = Math.ceil(SOURCE_IMAGE_WIDTH / scaleFactor);
      currentImageHeight = Math.ceil(currentImageWidth * (SOURCE_IMAGE_HEIGHT / SOURCE_IMAGE_WIDTH));
    }

    const numCols = Math.ceil(currentImageWidth / TILE_SIZE);
    const numRows = Math.ceil(currentImageHeight / TILE_SIZE);

    console.log(`Zoom ${z}: ScaleFactor=1/${scaleFactor}, ImgDims=${currentImageWidth}x${currentImageHeight}, Grid=${numCols}x${numRows}`);

    const grid = [];
    if (numCols > 0 && numRows > 0) {
      for (let y = 0; y < numRows; y++) {
        const rowData = [];
        for (let x = 0; x < numCols; x++) {
          const tilePath = `${TILE_BASE_PATH}/${z}/${x}/${y}.jpg`;
          rowData.push({
            src: tilePath,
            x: x,
            y: y,
            z: z,
            key: `${z}-${x}-${y}`
          });
        }
        grid.push(rowData);
      }
    }

    allLevels.push({
      zoom: z,
      imageWidth: currentImageWidth,
      imageHeight: currentImageHeight,
      numCols: numCols,
      numRows: numRows,
      grid: grid
    });
  }
  zoomLevelsData.value = allLevels;
  if (allLevels.length === 0) {
    console.warn("No zoom level data generated!");
  }
};

const onImageError = (tile) => {
  console.error(`Error loading tile: ${tile.src}`);
  if (!missingTiles.value.find(mt => mt.src === tile.src)) {
    missingTiles.value.push(tile);
  }
};

const onImageLoad = (tile) => {
  loadedTiles.value.add(tile.src);
};

generateAllZoomLevelGrids();
</script>

<style scoped>
.debug-map-grid-container {
  padding: 20px;
  background-color: #f0f0f0;
  overflow: auto;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  --tile-size: v-bind(TILE_SIZE + 'px');
}

.zoom-level-block {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #007bff;
  background-color: #fff;
}

.zoom-level-block h2 {
  margin-top: 0;
  color: #007bff;
}

.tile-grid {
  display: grid;
  border: 1px solid #ccc;
  margin-top: 10px;
}

.debug-tile {
  width: var(--tile-size);
  height: var(--tile-size);
  display: block;
  border: 1px solid #eee;
  box-sizing: border-box;
  object-fit: cover;
}

.missing-tiles-info {
  margin-top: 20px;
  padding: 10px;
  background-color: #ffdddd;
  border: 1px solid #ff0000;
}

.missing-tiles-info h3 {
  margin-top: 0;
}

.load-status {
  margin-top: 20px;
  padding: 10px;
  background-color: #e0e0e0;
}

.debug-controls {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 4px;
}

:deep(.center-test-pin) {
  width: 20px;
  height: 20px;
  background-color: red;
  border-radius: 50%;
  border: 2px solid white;
}

:deep(.direct-test-pin) {
  width: 20px;
  height: 20px;
  background-color: blue;
  border-radius: 50%;
  border: 2px solid white;
}
</style>

<template>
  <div class="debug-map-grid-container">
    <div v-for="zoomData in zoomLevelsData" :key="zoomData.zoom" class="zoom-level-block">
      <h2>Zoom Level: {{ zoomData.zoom }}</h2>
      <p>
        Full image dimensions at this zoom: {{ zoomData.imageWidth }}px wide x {{ zoomData.imageHeight }}px high<br />
        Grid: {{ zoomData.numCols }} columns x {{ zoomData.numRows }} rows
      </p>
      <div v-if="zoomData.grid.length" class="tile-grid" :style="{
        gridTemplateColumns: `repeat(${zoomData.numCols || 1}, ${TILE_SIZE}px)`,
        width: `${(zoomData.numCols || 1) * TILE_SIZE}px`,
      }">
        <template v-for="(row, rowIndex) in zoomData.grid" :key="`z${zoomData.zoom}-row-${rowIndex}`">
          <template v-for="(tile, colIndex) in row" :key="tile.key">
            <img :src="tile.src" :alt="`Tile ${tile.z}-${tile.x}-${tile.y}`"
              :title="`Tile ${tile.z}-${tile.x}-${tile.y}`" class="debug-tile" @error="onImageError(tile)"
              @load="onImageLoad(tile)" />
          </template>
        </template>
      </div>
      <div v-else>
        <p>No tiles to display for zoom {{ zoomData.zoom }}.</p>
      </div>
    </div>

    <div v-if="missingTiles.length > 0" class="missing-tiles-info">
      <h3>Missing Tiles (404s):</h3>
      <ul>
        <li v-for="tile in missingTiles" :key="tile.src">{{ tile.src }}</li>
      </ul>
    </div>
    <div v-if="loadedTileCount > 0 && totalTilesToLoad > 0" class="load-status">
      <p>Loaded {{ loadedTileCount }} / {{ totalTilesToLoad }} tiles.</p>
    </div>
  </div>
</template>
