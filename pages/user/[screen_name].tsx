import React from "react";
import { Navbar } from "../../src/parts/Navbar";
import { FooterNavigation } from "../../src/parts/FooterNavigation";
import { Paper, Grid, Typography } from "@material-ui/core";
import { useUserCtx } from "../../src/hooks/useUser";
import { css } from "@emotion/core";
import { NumberBoard } from "../../src/components/NumberBoard";
import { useTheme } from "emotion-theming";
import { Theme } from "../../src/components/Theme";

const UserPage: React.FC = () => {
  const { user } = useUserCtx();
  const theme = useTheme<Theme>();

  return (
    <>
      <Navbar />

      <main>
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
                  <Typography>ジト目王国民</Typography>
                </div>
              </Grid>
              <Grid container item justify="center">
                <img
                  src={user?.picture_url}
                  decoding="async"
                  css={css`
                    width: 128px;
                    height: 128px;
                    border-radius: 50%;
                    margin: 15px;
                  `}
                />
              </Grid>
              <Grid container item justify="center">
                <Typography variant="h5">みょん</Typography>
              </Grid>
              <Grid container item justify="center">
                <p>@myuon</p>
              </Grid>
            </Grid>
          </div>
          <div
            css={css`
              padding: 2em;
            `}
          >
            <NumberBoard number={user?.point ?? 0} label="所持みょんポイント" />
          </div>
        </Paper>
      </main>

      <FooterNavigation />
    </>
  );
};

export default UserPage;
