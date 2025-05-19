import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// --- Configuration ---
const sourceImageFile = path.resolve('public/map.png'); // Path to your large image
const outputBaseDir = path.resolve('public'); // Output to public directory
const tilesDirName = 'tiles';            // Name of the directory for tiles within public
const outputDir = path.join(outputBaseDir, tilesDirName);

const tileSize = 128;                       // Standard tile size in pixels
const jpegQuality = 80;                     // JPEG quality (0-100)

// --- Zoom Level Configuration ---
// Define how many zoom levels you want. 0 is the most zoomed-out.
// maxNativeZoom is the zoom level where the image is displayed at its native resolution (or closest to it)
// without upscaling the source image for tiling.
// For an 8000x6000 image, if maxNativeZoom is 4:
// Zoom 4: Image is ~8000x6000 (64x48 tiles if tileSize is 128)
// Zoom 3: Image is ~4000x3000 (32x24 tiles)
// Zoom 2: Image is ~2000x1500 (16x12 tiles)
// Zoom 1: Image is ~1000x750  (8x6 tiles)
// Zoom 0: Image is ~500x375   (4x3 tiles)

// Adjust these based on your image size and desired zoom depth.
// A good starting point for maxNativeZoom is a level where the image width/height divided by tileSize is manageable.
const minZoomLevel = 0;
const maxNativeZoom = 4;

async function createTiles() {
  try {
    if (!fs.existsSync(sourceImageFile)) {
      console.error(`Error: Source image not found at ${sourceImageFile}`);
      return;
    }

    if (fs.existsSync(outputDir)) {
      await fs.promises.rm(outputDir, { recursive: true, force: true });
    }
    await fs.promises.mkdir(outputDir, { recursive: true });

    const sourceSharpInstance = sharp(sourceImageFile);
    const metadata = await sourceSharpInstance.metadata();
    const originalWidth = metadata.width;
    const originalHeight = metadata.height;

    if (!originalWidth || !originalHeight) {
      console.error('Error: Could not read image metadata.');
      return;
    }

    for (let z = minZoomLevel; z <= maxNativeZoom; z++) {
      console.log(`\nProcessing Zoom Level: ${z}`);
      const zoomDir = path.join(outputDir, String(z));
      await fs.promises.mkdir(zoomDir, { recursive: true });

      const scaleFactorForCurrentZoom = Math.pow(2, maxNativeZoom - z);
      let imageToTile;
      let currentImageWidthForTiling;
      let currentImageHeightForTiling;

      if (scaleFactorForCurrentZoom === 1) { // Native zoom level
        imageToTile = sourceSharpInstance.clone();
        currentImageWidthForTiling = originalWidth;
        currentImageHeightForTiling = originalHeight;
      } else { // Scaled zoom level
        const exactScaledWidth = originalWidth / scaleFactorForCurrentZoom;
        const exactScaledHeight = originalHeight / scaleFactorForCurrentZoom;
        const targetResizeWidth = Math.round(exactScaledWidth);
        const targetResizeHeight = Math.round(exactScaledHeight);

        console.log(`  Scaled zoom level ${z}. Original aspect: ${originalWidth / originalHeight}`);
        console.log(`  Target WxH for resize: ${targetResizeWidth}x${targetResizeHeight}`);

        const resizedImageBuffer = await sharp(sourceImageFile)
          .resize(targetResizeWidth, targetResizeHeight, {
            fit: sharp.fit.contain,
            kernel: sharp.kernel.lanczos3
          })
          .jpeg({ quality: jpegQuality })
          .toBuffer();

        const finalScaledMetadata = await sharp(resizedImageBuffer).metadata();
        currentImageWidthForTiling = finalScaledMetadata.width;
        currentImageHeightForTiling = finalScaledMetadata.height;
        imageToTile = sharp(resizedImageBuffer);
      }

      const numCols = Math.ceil(currentImageWidthForTiling / tileSize);
      const numRows = Math.ceil(currentImageHeightForTiling / tileSize);
      console.log(`  Tiles to generate for this zoom: ${numCols} cols x ${numRows} rows`);

      const totalWidth = numCols * tileSize;
      const totalHeight = numRows * tileSize;
      const extraWidth = totalWidth - currentImageWidthForTiling;
      const extraHeight = totalHeight - currentImageHeightForTiling;
      const leftBorder = 0;
      const rightBorder = extraWidth;
      const topBorder = 0;
      const bottomBorder = extraHeight;

      for (let x = 0; x < numCols; x++) {
        const tileXDir = path.join(zoomDir, String(x));
        await fs.promises.mkdir(tileXDir, { recursive: true });
        for (let y = 0; y < numRows; y++) {
          const outputFile = path.join(tileXDir, `${y}.jpg`);
          let sourceRegionX = x * tileSize - leftBorder;
          let sourceRegionY = y * tileSize - topBorder;
          let sourceExtractWidth = tileSize;
          let sourceExtractHeight = tileSize;
          if (sourceRegionX < 0) {
            sourceExtractWidth += sourceRegionX;
            sourceRegionX = 0;
          }
          if (sourceRegionY < 0) {
            sourceExtractHeight += sourceRegionY;
            sourceRegionY = 0;
          }
          if (sourceRegionX + sourceExtractWidth > currentImageWidthForTiling) {
            sourceExtractWidth = currentImageWidthForTiling - sourceRegionX;
          }
          if (sourceRegionY + sourceExtractHeight > currentImageHeightForTiling) {
            sourceExtractHeight = currentImageHeightForTiling - sourceRegionY;
          }
          if (sourceExtractWidth <= 0 || sourceExtractHeight <= 0) {
            await sharp({
              create: { width: tileSize, height: tileSize, channels: 3, background: { r: 0, g: 0, b: 0 } }
            })
              .jpeg({ quality: jpegQuality })
              .toFile(outputFile);
          } else {
            const tileLeft = 0;
            const tileTop = 0;
            const extractedImagePart = await imageToTile
              .clone()
              .extract({
                left: sourceRegionX,
                top: sourceRegionY,
                width: sourceExtractWidth,
                height: sourceExtractHeight
              })
              .toBuffer();
            await sharp({
              create: { width: tileSize, height: tileSize, channels: 3, background: { r: 0, g: 0, b: 0 } }
            })
              .composite([
{
                input: extractedImagePart,
                top: tileTop,
                left: tileLeft
              }
])
              .jpeg({ quality: jpegQuality })
              .toFile(outputFile);
          }
        }
      }
    }
    console.log('Tile generation completed successfully!');
    console.log(`Tiles are located in: ${path.resolve(outputDir)}`);
    console.log(`Source image: ${originalWidth}x${originalHeight}, MaxNativeZoom: ${maxNativeZoom}`);

  } catch (error) {
    console.error('Error during tile generation:', error);
  }
}

createTiles();
