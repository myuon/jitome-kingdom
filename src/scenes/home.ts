import Phaser from "phaser";
import { CircleIcon } from "../components/CircleIcon";

export class HomeScene extends Phaser.Scene {
  constructor() {
    super({
      key: "HomeScene"
    });
  }

  preload() {
    this.load.image(
      "open-treasure-chest",
      "../../assets/game-icons-inverted/skoll/originals/svg/000000/transparent/open-treasure-chest.svg"
    );
  }

  create() {
    const gacha = CircleIcon(this, {
      label: "Gacha",
      image: "open-treasure-chest",
      x: 200,
      y: 500
    }).setInteractive();
    gacha.on("pointerup", () => {
      this.scene.start("LootBoxScene");
    });
  }
}
