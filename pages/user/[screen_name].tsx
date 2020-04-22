import React from "react";
import { Navbar } from "../../src/parts/Navbar";
import { FooterNavigation } from "../../src/parts/FooterNavigation";
import { Paper, Grid, Typography } from "@material-ui/core";
import { useUser } from "../../src/hooks/useUser";
import { css } from "@emotion/core";
import { NumberBoard } from "../../src/components/NumberBoard";
import { useTheme } from "emotion-theming";
import { Theme } from "../../src/components/Theme";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "@material-ui/lab/Skeleton";

const UserPage: React.FC = () => {
  const router = useRouter();
  const theme = useTheme<Theme>();
  const { data: user, loaded, err } = useUser(
    router.query.screen_name as string
  );

  return (
    <>
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
