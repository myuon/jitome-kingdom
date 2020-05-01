import { NowRequest, NowResponse } from "@now/node";
import { registerFont } from "canvas";
import svg2img from "svg2img";
import Image64 from "node-base64-image";
import * as path from "path";
import fetch from "node-fetch";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
        <rect id="avatar" x="50%" y="35" width="160" height="160" rx="50%" fill="transparent" />
        <clipPath id="clip">
            <use xlink:href="#avatar" />
        </clipPath>
    </defs>

    <rect x="0" y="0" width="1200" height="350" fill="#009c95" />

    <use xlink:href="#avatar" />
    <image
        clip-path="url(#clip)"
        x="50%"
        y="35"
        width="160"
        height="160"
        transform="translate(-80, 0)"
        href="{picture_url}" />
    <text
        x="50%"
        y="260"
        text-anchor="middle"
        fill="#ffffff"
        font-size="48px"
    >
        {display_name}
    </text>
    <text
        x="50%"
        y="310"
        text-anchor="middle"
        fill="#ffffff"
        font-size="24px"
        font-family="NotoSansJP"
    >
        {screen_name}
    </text>

    <rect x="0" y="350" width="1200" height="280" fill="white" />
    <text
        x="50%"
        y="410"
        text-anchor="middle"
        fill="rbga(0,0,0,0.87)"
        font-size="28"
    >
        所持みょんポイント
    </text>
    <text
        x="50%"
        y="580"
        text-anchor="middle"
        fill="rbga(0,0,0,0.87)"
        font-size="185"
        font-family="sans"
    >
        {point}
    </text>
</svg>
`
  .split("\n")
  .join("");

const svg2imgP = (input: string) =>
  new Promise((resolve, reject) => {
    svg2img(input, (error, buffer) => {
      if (error) {
        reject(error);
      }

      resolve(buffer);
    });
  });

const Image64P = (imageUrl: string) =>
  new Promise((resolve, reject) => {
    Image64.encode(imageUrl, {}, (err, base64) => {
      if (err) {
        reject(err);
      }

      resolve(base64);
    });
  });

const API_ENDPOINT = "https://api-jitome.ramda.io";

export default async (req: NowRequest, resp: NowResponse) => {
  registerFont(path.join("fonts", "NotoSansJP-Regular.otf"), {
    family: "NotoSansJP"
  });

  const screen_name = req.query.screen_name as string;
  const result = await fetch(`${API_ENDPOINT}/users/${screen_name}`);
  if (!result.ok) {
    return resp.status(404).send("Not Found");
  }

  const { display_name, point, picture_url } = await result.json();

  const picture = (await Image64P(picture_url)) as Buffer;
  const buf = await svg2imgP(
    svg
      .replace("{display_name}", display_name)
      .replace("{screen_name}", "@" + screen_name)
      .replace("{point}", point)
      .replace(
        "{picture_url}",
        "data:image/png;base64," + picture.toString("base64")
      )
  );

  resp.setHeader("Content-Type", "image/png");
  resp.setHeader("Cache-Control", "no-cache");
  resp.status(200).send(buf);
};
