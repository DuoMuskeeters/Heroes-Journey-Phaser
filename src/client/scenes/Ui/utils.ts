export function addTilesetImage(
  tilemap: Phaser.Tilemaps.Tilemap,
  name: string,
  key: string
) {
  const image = tilemap.addTilesetImage(name, key);
  if (!image) throw new Error(`image not found: ${key}`);
  return image;
}

export function createLayer(
  tilemap: Phaser.Tilemaps.Tilemap,
  layerID: string | number,
  tileset:
    | string
    | Phaser.Tilemaps.Tileset
    | string[]
    | Phaser.Tilemaps.Tileset[],
  x?: number,
  y?: number
) {
  const layer = tilemap.createLayer(layerID, tileset, x, y);
  if (!layer) throw new Error(`layer not found: ${layerID}`);
  return layer;
}
