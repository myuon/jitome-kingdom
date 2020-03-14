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
    this.add.circle(200, 500, 80, 0xffffff);
    const sprite = this.add
      .sprite(200, 500, "open-treasure-chest")
      .setInteractive();
    this.add.text(165, 570, "ガチャ", {
      fontSize: "18px",
      fontStyle: "bold",
      fill: "#fff"
    });

    sprite.on("pointerdown", () => {
      console.log("foo");
    });

    this.input.on("pointerup", () => {
      this.scene.start("LootBoxScene");
    });
  }
}
