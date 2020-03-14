import Phaser from "phaser";

export class HomeScene extends Phaser.Scene {
  private sprite: Phaser.GameObjects.Sprite | null = null;

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
    this.sprite = this.add.sprite(400, 500, "open-treasure-chest");
  }
}
