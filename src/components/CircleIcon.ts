export const CircleIcon = (
  scene: Phaser.Scene,
  args: {
    label: string;
    image: string;
    x: number;
    y: number;
  }
): Phaser.GameObjects.Arc => {
  const circle = scene.add.circle(args.x, args.y, 90, 0xffffff);
  scene.add.sprite(args.x, args.y - 10, args.image);

  scene.add
    .text(args.x, args.y + 70, args.label, {
      fontSize: "24px",
      fontStyle: "bold",
      fill: "#000"
    })
    .setOrigin(0.5);

  return circle;
};
