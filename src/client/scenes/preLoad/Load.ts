import { CONFIG } from "../../PhaserGame";
import { eventTypes, gameEvents } from "../../../game/types/events";
import { preloadAssets } from "./assets";

export default class LoadScene extends Phaser.Scene {
  loadspin!: Phaser.GameObjects.Sprite;
  loadingtext!: Phaser.GameObjects.Text;
  array: string[] = [];
  modnumber = 0;
  arrayturn = 0;

  preload() {
    preloadAssets(this);

    this.load.on("complete", () => {
      gameEvents.emit(eventTypes.GAME_LOADED);
      this.scene.start(CONFIG.physics.matter.debug ? "mainscene" : "menu");
    });

    this.load.image("logo", "DuoMuskeeters.jpg");
  }
  create() {
    this.loadspin = this.add
      .sprite(CONFIG.width / 2, CONFIG.height / 2, "loadspin")
      .setScale(1.5);
    this.anims.create({
      key: "loadspin",
      frames: this.anims.generateFrameNames("loadspin", {
        start: 0,
        end: 4,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.loadspin.anims.play("loadspin", true);
    this.loadspin.anims.stopAfterRepeat(0);
    this.loadingtext = this.add.text(
      CONFIG.width / 2 - 75,
      CONFIG.height / 2 + 50,
      "Packages Loading..."
    );

    for (let i = 0; i <= 3; i++) {
      this.array.push("Packages Loading" + ".".repeat(i));
    }
  }
  update(time: number, delta: number): void {
    this.modnumber += 1;
    if (this.modnumber % 50 === 0) {
      this.loadingtext.setText(this.array[this.arrayturn]);
      this.arrayturn =
        this.arrayturn !== 3 ? (this.arrayturn += 1) : (this.arrayturn = 0);
    }
  }
}
