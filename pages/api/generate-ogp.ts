import { NowRequest, NowResponse } from "@now/node";

export default (req: NowRequest, resp: NowResponse) => {
  const screen_name = req.query.screen_name as string;
  resp.status(200).send(`hello, ${screen_name}`);
};
