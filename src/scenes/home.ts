import Phaser from "phaser";

export class HomeScene extends Phaser.Scene {
  constructor() {
    super({
      key: "HomeScene"
    });
  }

  preload() {
    this.load.image(
      "open-treasure-chest",
      "../../assets/icons/skoll/open-treasure-chest.svg"
    );
  }

  create() {
    const sprite = this.add
      .sprite(400, 500, "open-treasure-chest")
      .setInteractive();
    sprite.on("pointerdown", () => {
      console.log("foo");
    });

    this.input.on("pointerup", () => {
      this.scene.start("LootBoxScene");
    });
  }
}
