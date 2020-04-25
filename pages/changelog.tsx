import React from "react";
import { useGift } from "../src/hooks/useGift";
import { useAuthCtx } from "../src/hooks/useAuth";
import { Navbar } from "../src/parts/Navbar";
import { FooterNavigation } from "../src/parts/FooterNavigation";
import { Typography } from "@material-ui/core";
import { css } from "@emotion/core";

export const dataChangelog = {
  history: [
    {
      date: "2020-04-25",
      content: "前日との差分を使ったポイント差分ランキングを追加しました。"
    },
    {
      date: "2020-04-25",
      content:
        "ユーザーページにて、OGP画像としてジト目王国民のカードを生成するようにしました。"
    },
    {
      date: "2020-04-24",
      content: "みょんポイントランキングを実装しました。"
    },
    {
      date: "2020-04-22",
      content: "prerenderの見栄えを良くしました。"
    },
    {
      date: "2020-04-22",
      content:
        "ユーザーページをシェアできるようになりました。ジト目王国民カードを友達に見せびらかしましょう。"
    },
    {
      date: "2020-04-19",
      content: "じゃんけん履歴の表示を直近のものだけに限定するようにしました。"
    },
    {
      date: "2020-04-16",
      content:
        "じゃんけんで不戦勝の場合にギフトの処理に異常があり緊急メンテナンスを行いました。これに伴い、一部のユーザーで本来1度しか取得できないギフトを複数回取得することによるポイント増分は本来の数値に戻しました。"
    },
    {
      date: "2020-04-11",
      content:
        "じゃんけん送信後、ページをリロードしなくても定期的にデータを取得するようにしました。"
    },
    {
      date: "2020-04-09",
      content:
        "じゃんけん機能を実装しました。ユーザー同士で戦ってポイントを奪い合いましょう！"
    },
    {
      date: "2020-04-04",
      content:
        "アカウント設定画面を用意しました。画面上部のアカウントメニューから、ユーザー名、ユーザーID、アイコンが設定できます。"
    },
    {
      date: "2020-04-01",
      content:
        "PWAに対応しました。ホーム画面に追加していつでもみょんポイントを確認してください！"
    },
    {
      date: "2020-03-29_2",
      content:
        "プレゼント機能を追加しました。3/26の緊急メンテナンスのお詫びとして15ポイントを全ユーザーに配布しました。"
    },
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
