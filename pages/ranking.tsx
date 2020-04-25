import React from "react";
import { Navbar } from "../src/parts/Navbar";
import { FooterNavigation } from "../src/parts/FooterNavigation";
import {
  Typography,
  Grid,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Avatar
} from "@material-ui/core";
import { useAuthCtx } from "../src/hooks/useAuth";
import {
  useRankingTop,
  useRankingDiff,
  RankingUser
} from "../src/hooks/useRanking";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrown,
  faArrowAltCircleUp,
  faArrowAltCircleDown
} from "@fortawesome/free-solid-svg-icons";
import { css } from "@emotion/core";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import Link from "next/link";

const RankingTable: React.FC<{ data: RankingUser[] }> = ({ data }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>順位</TableCell>
            <TableCell>ユーザー</TableCell>
            <TableCell>ポイント</TableCell>
            <TableCell>差分</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={row.user_id}>
              <TableCell>
                {index === 0 ? (
                  <span
                    css={css`
                      color: #d9b400;
                    `}
                  >
                    <FontAwesomeIcon icon={faCrown} height="1em" />
                  </span>
                ) : index === 1 ? (
                  <span
                    css={css`
                      color: #b7b7b7;
                    `}
                  >
                    <FontAwesomeIcon icon={faCrown} height="1em" />
                  </span>
                ) : index === 2 ? (
                  <span
                    css={css`
                      color: #cf8e6a;
                    `}
                  >
                    <FontAwesomeIcon icon={faCrown} height="1em" />
                  </span>
                ) : (
                  <></>
                )}
              </TableCell>
              <TableCell
                css={css`
                  width: 350px;
                `}
              >
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <Avatar
                      src={row.picture_url}
                      css={css`
                        margin-right: 1em;
                      `}
                    />
                  </Grid>
                  <Grid item>
                    <Grid container direction="column">
                      <span>{row.display_name}</span>
                      {row.screen_name && (
                        <span
                          css={css`
                            a {
                              color: inherit;
                            }
                          `}
                        >
                          (
                          <Link href={`/user/${row.screen_name}`}>
                            <a>@{row.screen_name}</a>
                          </Link>
                          )
                        </span>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </TableCell>
              <TableCell align="right">{row.current}</TableCell>
              <TableCell align="right">
                {row.diff > 0 ? (
                  <span
                    css={css`
                      color: ${green["700"]};
                    `}
                  >
                    <FontAwesomeIcon icon={faArrowAltCircleUp} height="1em" />{" "}
                    {row.diff}
                  </span>
                ) : row.diff < 0 ? (
                  <span
                    css={css`
                      color: ${red["700"]};
                    `}
                  >
                    <FontAwesomeIcon icon={faArrowAltCircleDown} height="1em" />{" "}
                    {row.diff}
                  </span>
                ) : (
                  row.diff
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const RankingPage: React.FC = () => {
  const { authToken } = useAuthCtx();
  const { data: top } = useRankingTop(authToken);
  const { data: diff } = useRankingDiff(authToken);

  return (
    <>
      <Navbar />

      <main>
        <header
          css={css`
            margin-bottom: 2ex;
          `}
        >
          <Typography variant="h6">みょんポイントランキング</Typography>
          <Typography>ランキングはおよそ24時間ごとの更新です</Typography>
        </header>

        <Grid container justify="space-evenly" spacing={5}>
          <Grid item>
            <Typography>ポイント所持数ランキング</Typography>
            <RankingTable data={top ?? []} />
          </Grid>
          <Grid item>
            <Typography>ポイント差分ランキング</Typography>
            <RankingTable data={diff ?? []} />
          </Grid>
        </Grid>
      </main>

      <FooterNavigation />
    </>
  );
};

export default RankingPage;
