import React from "react";
import { Navbar } from "../../src/parts/Navbar";
import { FooterNavigation } from "../../src/parts/FooterNavigation";
import { Paper, Grid, Typography } from "@material-ui/core";
import { useUser, User } from "../../src/hooks/useUser";
import { css } from "@emotion/core";
import { NumberBoard } from "../../src/components/NumberBoard";
import { useTheme } from "emotion-theming";
import { Theme } from "../../src/components/Theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "@material-ui/lab/Skeleton";
import Head from "next/head";
import { GetServerSideProps } from "next";
import fetch from "node-fetch";

export const getServerSideProps: GetServerSideProps = async ctx => {
  const screen_name = ctx.query.screen_name as string;

  // data fetch in pre-render
  // これやめたい
  const resp = (await (
    await fetch(`${process.env.APP_ENDPOINT}/users/${screen_name}`, {})
  ).json()) as User;

  return {
    props: resp
  };
};

const UserPage: React.FC<User> = ({ screen_name, display_name, point }) => {
  const theme = useTheme<Theme>();
  const { data: user, loaded, err } = useUser(screen_name!);

  return (
    <>
      <Head>
        <meta
          name="twitter:card"
          content="summary_large_image"
          key="twitter-card"
        />
        <meta
          property="og:description"
          content={`ジト目王国 - ${display_name}さんは${point}みょんポイントを保持しています`}
          key="og-description"
        />
        <meta
          property="twitter:description"
          content={`ジト目王国 - ${display_name}さんは${point}みょんポイントを保持しています`}
          key="twitter-description"
        />
        <meta
          property="og:image"
          content={`https://jitome.ramda.io/functions/generate-ogp/index?screen_name=${screen_name}`}
          key="og-image"
        />
        <meta
          name="twitter:image"
          content={`https://jitome.ramda.io/functions/generate-ogp/index?screen_name=${screen_name}`}
          key="twitter-image"
        />
      </Head>

      <Navbar />

      <main>
        {err ? (
          <Typography>ユーザーが見つかりません</Typography>
        ) : (
          <Paper
            elevation={3}
            css={css`
              max-width: 528px;
              margin: 1em auto;
            `}
          >
            <div
              css={css`
                background-color: ${theme.palette.primary.base};
                color: white;
                padding: 2em 0;

                font-weight: bold;
              `}
            >
              <Grid container direction="column">
                <Grid container item justify="center">
                  <div
                    css={css`
                      border-bottom: 5px dotted rgba(255, 255, 255, 0.9);
                      padding-bottom: 0em;
                      margin-bottom: 1em;
                    `}
                  >
                    <Typography>
                      <FontAwesomeIcon
                        icon={faCrown}
                        css={css`
                          height: 1em;
                        `}
                      />
                      <span
                        css={css`
                          margin: 0 0.4em;
                        `}
                      >
                        ジト目王国民
                      </span>
                      <FontAwesomeIcon
                        icon={faCrown}
                        css={css`
                          height: 1em;
                        `}
                      />
                    </Typography>
                  </div>
                </Grid>
                <Grid container item justify="center">
                  <div
                    css={css`
                      margin: 15px;
                    `}
                  >
                    {loaded ? (
                      <img
                        src={user?.picture_url}
                        decoding="async"
                        css={css`
                          width: 128px;
                          height: 128px;
                          border-radius: 50%;
                        `}
                      />
                    ) : (
                      <Skeleton variant="circle" width={128} height={128} />
                    )}
                  </div>
                </Grid>
                <Grid container item justify="center">
                  <Typography variant="h5">
                    {loaded ? user?.display_name : <Skeleton width={198} />}
                  </Typography>
                </Grid>
                <Grid container item justify="center">
                  <Typography>
                    {loaded ? (
                      `@${user?.screen_name}`
                    ) : (
                      <Skeleton width={198} />
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </div>
            <div
              css={css`
                padding: 2em;
              `}
            >
              <NumberBoard
                number={user?.point ?? 0}
                label="所持みょんポイント"
              />
            </div>
          </Paper>
        )}
      </main>

      <FooterNavigation />
    </>
  );
};

export default UserPage;
