import Phaser from "phaser";

export class LootBoxScene extends Phaser.Scene {
  constructor() {
    super({
      key: "LootBoxScene"
    });
  }

  preload() {
    this.load.image("return-arrow", "../../assets/icons/lorc/return-arrow.svg");
  }

  create() {
    const goBack = this.add.sprite(100, 100, "return-arrow").setInteractive();
    goBack.on("pointerup", () => {
      this.scene.start("HomeScene");
    });

    this.add.sprite(100, 200, "open-treasure-chest");
  }
}
