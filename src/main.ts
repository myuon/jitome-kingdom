import Phaser from "phaser";
import { HomeScene } from "./scenes/home";
import { LootBoxScene } from "./scenes/lootbox";
import GenEiRomanNotes from "../assets/GenEiRomanNotes-font/GenEiRomanNotes-W9.woff";

export class Game extends Phaser.Game {}

window.addEventListener("load", () => {
  // eslint-disable-next-line
  const game = new Game({
    width: 400,
    height: 600,
    type: Phaser.AUTO,
    parent: "game",
    backgroundColor: "#f9f9f9",
    scene: [HomeScene, LootBoxScene]
  });
});

const sheet = window.document.createElement("style");
sheet.type = "text/css";
sheet.innerText = `
@font-face {
  font-family: 'GenEiRomanNotes';
  src: url(${GenEiRomanNotes}) format('woff');
}
`;
document.head.appendChild(sheet);
