import MainScene from "./MainScene";

export function createground(scene: MainScene) {
  const tiles = scene.tilemap.addTilesetImage("road-set", "road-set");
  const lamp = scene.tilemap.addTilesetImage("lamp", "lamp");
  const fence_2 = scene.tilemap.addTilesetImage("fence_2", "fence_2");
  const fence_1 = scene.tilemap.addTilesetImage("fence_1", "fence_1");
  const grass2 = scene.tilemap.addTilesetImage("grass_2", "grass_2");
  const grass3 = scene.tilemap.addTilesetImage("grass_3", "grass_3");
  const grass1 = scene.tilemap.addTilesetImage("grass_1", "grass_1");
  const rock3 = scene.tilemap.addTilesetImage("rock_3", "rock_3");
  const rock2 = scene.tilemap.addTilesetImage("rock_2", "rock_2");
  const rock1 = scene.tilemap.addTilesetImage("rock_1", "rock_1");
  const sign = scene.tilemap.addTilesetImage("sign", "sign");

  scene.frontroad = scene.tilemap
    .createLayer("backroad", tiles!)
    ?.setScale(2.55, 2.55)!;
  scene.backroad = scene.tilemap
    .createLayer("frontroad", tiles!)
    ?.setScale(2.55, 2.55)!;
  scene.tilemap.createLayer("lamp", lamp!, 0, -85)?.setScale(2.55, 2.55);
  scene.tilemap
    .createLayer("fence", [fence_1!, fence_2!], 0, 15)
    ?.setScale(2.55, 2.55);
  scene.tilemap.createLayer("rock_3", rock3!, 0, 15)?.setScale(2.55, 2.55);
  scene.tilemap.createLayer("rock_2", rock2!, 0, 30)?.setScale(2.55, 2.55);
  scene.tilemap.createLayer("rock_1", rock1!, 0, 33)?.setScale(2.55, 2.55);

  scene.tilemap.createLayer("sign", sign!, 0, -20)?.setScale(2.55, 2.55);
  scene.tilemap
    .createLayer("grass", [grass1!, grass2!, grass3!], 0, 55)
    ?.setScale(2.55, 2.55);

  scene.backroad?.setCollisionByProperty({ collides: true });
  scene.frontroad?.setCollisionByProperty({ collides: true });
}
export function createCollider(
  scene: MainScene,
  object1: Phaser.Types.Physics.Arcade.ArcadeColliderType,
  object2: Phaser.Types.Physics.Arcade.ArcadeColliderType
) {
  scene.physics.add.collider(object1, object2);
}
