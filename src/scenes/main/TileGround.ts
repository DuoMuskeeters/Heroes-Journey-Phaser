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
  const sign = scene.tilemap.addTilesetImage("sign", "sign");

  scene.frontroad = scene.tilemap
    .createLayer("backroad", tiles!)
    ?.setScale(
      (2.04 / 1311) * window.innerWidth,
      (2.04 / 724) * window.innerHeight
    )!;
  scene.backroad = scene.tilemap
    .createLayer("frontroad", tiles!)
    ?.setScale(
      (2.04 / 1311) * window.innerWidth,
      (2.04 / 724) * window.innerHeight
    )!;
  scene.tilemap
    .createLayer("lamp", lamp!, 0, -(68 / 724) * window.innerHeight)
    ?.setScale(
      (2.04 / 1311) * window.innerWidth,
      (2.04 / 724) * window.innerHeight
    );
  scene.tilemap
    .createLayer(
      "fence",
      [fence_1!, fence_2!],
      0,
      (10 / 724) * window.innerHeight
    )
    ?.setScale(
      (2.04 / 1311) * window.innerWidth,
      (2.04 / 724) * window.innerHeight
    );
  scene.tilemap
    .createLayer("rock_3", rock3!, 0, (13 / 724) * window.innerHeight)
    ?.setScale(
      (2.04 / 1311) * window.innerWidth,
      (2.04 / 724) * window.innerHeight
    );
  scene.tilemap
    .createLayer("rock_2", rock2!, 0, (25 / 724) * window.innerHeight)
    ?.setScale(
      (2.04 / 1311) * window.innerWidth,
      (2.04 / 724) * window.innerHeight
    );

  scene.tilemap
    .createLayer("sign", sign!, 0, (-18 / 900) * window.innerHeight)
    ?.setScale(
      (2.04 / 1311) * window.innerWidth,
      (2.04 / 724) * window.innerHeight
    );
  scene.tilemap
    .createLayer(
      "grass",
      [grass1!, grass2!, grass3!],
      0,
      (43 / 724) * window.innerHeight
    )
    ?.setScale(
      (2.04 / 1311) * window.innerWidth,
      (2.04 / 724) * window.innerHeight
    );

  scene.backroad?.setCollisionByProperty({ collides: true });
  scene.frontroad?.setCollisionByProperty({ collides: true });
}
