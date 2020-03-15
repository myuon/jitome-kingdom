import Phaser from "phaser";
import { CircleIcon } from "../components/CircleIcon";

export class LootBoxScene extends Phaser.Scene {
  constructor() {
    super({
      key: "LootBoxScene"
    });
  }

  preload() {
    this.load.image(
      "return-arrow",
      "../../assets/game-icons-inverted/lorc/originals/svg/000000/transparent/return-arrow.svg"
    );
  }

  create() {
    const goBack = CircleIcon(this, {
      label: "Back",
      image: "return-arrow",
      x: 100,
      y: 100
    }).setInteractive();
    goBack.on("pointerup", () => {
      this.scene.start("HomeScene");
    });

    CircleIcon(this, {
      label: "",
      image: "open-treasure-chest",
      x: 100,
      y: 270
    });
  }
}
