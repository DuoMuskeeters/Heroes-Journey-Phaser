import { addTilesetImage, createLayer } from "../Ui/utils";
import type MainScene from "./MainScene";

export function createground(scene: MainScene) {
  const tiles = addTilesetImage(scene.tilemap, "road-set", "road-set");
  const lamp = addTilesetImage(scene.tilemap, "lamp", "lamp");
  const fence_2 = addTilesetImage(scene.tilemap, "fence_2", "fence_2");
  const fence_1 = addTilesetImage(scene.tilemap, "fence_1", "fence_1");
  const grass2 = addTilesetImage(scene.tilemap, "grass_2", "grass_2");
  const grass3 = addTilesetImage(scene.tilemap, "grass_3", "grass_3");
  const grass1 = addTilesetImage(scene.tilemap, "grass_1", "grass_1");
  const rock3 = addTilesetImage(scene.tilemap, "rock_3", "rock_3");
  const rock2 = addTilesetImage(scene.tilemap, "rock_2", "rock_2");
  const rock1 = addTilesetImage(scene.tilemap, "rock_1", "rock_1");
  const sign = addTilesetImage(scene.tilemap, "sign", "sign");

  scene.road = createLayer(
    scene.tilemap,
    "road",
    tiles
  ).setCollisionFromCollisionGroup();

  createLayer(scene.tilemap, "lamp", lamp, 0, -33);
  createLayer(scene.tilemap, "rock_3", rock3, 0, 6);
  createLayer(scene.tilemap, "rock_2", rock2, 0, 12);
  createLayer(scene.tilemap, "rock_1", rock1, 0, 12);
  createLayer(scene.tilemap, "sign", sign, 0, -7);
  createLayer(scene.tilemap, "grass", [grass1, grass2, grass3], 0, 20);
  createLayer(scene.tilemap, "fence", [fence_1, fence_2], 0, 6);
}
export function createRoadCollider(
  scene: MainScene,
  object: Phaser.Types.Physics.Arcade.ArcadeColliderType
) {
  scene.physics.add.collider(object, [scene.road]);
}
