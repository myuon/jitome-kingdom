import React from "react";
import { useGift } from "../src/hooks/useGift";
import { useAuthCtx } from "../src/hooks/useAuth";
import { Navbar } from "../src/parts/Navbar";
import { FooterNavigation } from "../src/parts/FooterNavigation";
import { Typography } from "@material-ui/core";
import { css } from "@emotion/core";

const dataChangelog = {
  history: [
    {
      date: "2020-03-29",
      content: "画面を可愛くしました。"
    },
    {
      date: "2020-03-26",
      content:
        "緊急メンテナンスを行いました。ロールバックを行ったため、同日の18時以降のガチャ記録が消失しています。ご不便をおかけして申し訳ありません。こちらについては後日お詫びのプレゼントを送る予定です。"
    },
    {
      date: "2020-03-23",
      content: "サービスをリリースしました。"
    }
  ]
};

const Changelog: React.FC = props => {
  const { authToken } = useAuthCtx();
  const { data: gifts } = useGift(authToken);

  return (
    <>
      <Navbar giftBadge={gifts?.length} />

      <main
        css={css`
          h6 {
            margin-bottom: 0.5em;
          }
        `}
      >
        <Typography variant="h6">変更履歴</Typography>

        {dataChangelog.history.map((item, index) => (
          <Typography key={index}>
            {item.date}: {item.content}
          </Typography>
        ))}
      </main>

      <FooterNavigation giftBadge={gifts?.length} />
    </>
  );
};

export default Changelog;
