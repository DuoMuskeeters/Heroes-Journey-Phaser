import MainScene from "./MainScene";

export function createground(scene: MainScene) {
  scene.tilemap = scene.make.tilemap({ key: "roadfile" });

  const tiles = scene.tilemap.addTilesetImage("road-set", "road-set");
  const lamp = scene.tilemap.addTilesetImage("lamp", "lamp");
  const fence = scene.tilemap.addTilesetImage("fence_2", "fence_2");
  const grass2 = scene.tilemap.addTilesetImage("grass_2", "grass_2");
  const grass3 = scene.tilemap.addTilesetImage("grass_3", "grass_3");
  const grass1 = scene.tilemap.addTilesetImage("grass_1", "grass_1");
  const rock3 = scene.tilemap.addTilesetImage("rock_3", "rock_3");
  const rock2 = scene.tilemap.addTilesetImage("rock_2", "rock_2");
  const sign = scene.tilemap.addTilesetImage("sign", "sign");

  if (
    tiles &&
    lamp &&
    fence &&
    rock2 &&
    rock3 &&
    sign &&
    grass1 &&
    grass2 &&
    grass3
  ) {
    //@ts-ignore
    scene.frontroad = scene.tilemap
      .createLayer("backroad", tiles)
      ?.setScale(
        (2.04 / 1311) * window.innerWidth,
        (2.04 / 724) * window.innerHeight
      );
    //@ts-ignore
    scene.backroad = scene.tilemap
      .createLayer("frontroad", tiles)
      ?.setScale(
        (2.04 / 1311) * window.innerWidth,
        (2.04 / 724) * window.innerHeight
      );
    scene.tilemap
      .createLayer("lamp", lamp, 0, -(50 / 724) * window.innerHeight)
      ?.setScale(
        (2.04 / 1311) * window.innerWidth,
        (2.04 / 724) * window.innerHeight
      );
    scene.tilemap
      .createLayer("fence", fence, 0, (25 / 724) * window.innerHeight)
      ?.setScale(
        (2.04 / 1311) * window.innerWidth,
        (2.04 / 724) * window.innerHeight
      );
    scene.tilemap
      .createLayer("rock_3", rock3, 0, (30 / 724) * window.innerHeight)
      ?.setScale(
        (2.04 / 1311) * window.innerWidth,
        (2.04 / 724) * window.innerHeight
      );
    scene.tilemap
      .createLayer("rock_2", rock2, 0, (40 / 724) * window.innerHeight)
      ?.setScale(
        (2.04 / 1311) * window.innerWidth,
        (2.04 / 724) * window.innerHeight
      );

    scene.tilemap
      .createLayer("sign", sign)
      ?.setScale(
        (2.04 / 1311) * window.innerWidth,
        (2.04 / 724) * window.innerHeight
      );
    scene.tilemap
      .createLayer(
        "grass",
        [grass1, grass2, grass3],
        0,
        (60 / 724) * window.innerHeight
      )
      ?.setScale(
        (2.04 / 1311) * window.innerWidth,
        (2.04 / 724) * window.innerHeight
      );

    // backroad.setCollisionByExclusion([-1], true);
    scene.backroad?.setCollisionByProperty({ collides: true });
    scene.frontroad?.setCollisionByProperty({ collides: true });
    scene.rect = scene.physics.add
      .sprite(500, 0, "rect")
      .setVisible(false)
      .setCollideWorldBounds(true)
      .setBounce(0.1);
    scene.attackrect = scene.add.rectangle(
      scene.rect.x,
      scene.rect.y,
      undefined,
      undefined,
      0xff2400
    );
    // scene.mobrect = scene.physics.add
    //   .sprite(1000, 0, "mobrect")
    //   .setVisible(false)
    //   .setCollideWorldBounds(true)
    //   .setBounce(0.1);
    // scene.mobattackrect = scene.add.rectangle(
    //   scene.mobrect.x,
    //   scene.mobrect.y,
    //   undefined,
    //   undefined,
    //   0xff2400
    // );

    scene.rect.setDisplaySize(
      (64 / 1311) * window.innerWidth,
      (125 / 724) * window.innerHeight
    );
    scene.attackrect.setDisplaySize(
      (160 / 1283) * window.innerWidth,
      (32 / 724) * window.innerHeight
    );
    // scene.mobrect.setDisplaySize(
    //   (64 / 1311) * window.innerWidth,
    //   (125 / 724) * window.innerHeight
    // );
    // scene.mobattackrect.setDisplaySize(
    //   (75 / 1311) * window.innerWidth,
    //   (32 / 724) * window.innerHeight
    // );

    // scene.physics.add.collider(scene.mobreclist, scene.mobreclist);
    scene.physics.add.collider([scene.rect], [scene.backroad, scene.frontroad]);
  }
}
