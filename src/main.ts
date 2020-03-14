import Phaser from "phaser";
import { HomeScene } from "./scenes/home";
import { LootBoxScene } from "./scenes/lootbox";

export class Game extends Phaser.Game {}

window.addEventListener("load", () => {
  // eslint-disable-next-line
  const game = new Game({
    width: 400,
    height: 600,
    type: Phaser.AUTO,
    parent: "game",
    scene: [HomeScene, LootBoxScene]
  });
});
