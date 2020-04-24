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
import { useRankingTop } from "../src/hooks/useRanking";
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

const RankingPage: React.FC = () => {
  const { authToken } = useAuthCtx();
  const { data: top } = useRankingTop(authToken);

  return (
    <>
      <Navbar />

      <main>
        <Typography variant="h6">みょんポイントランキング</Typography>

        <Grid container spacing={2} justify="space-evenly">
          <Grid item>
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
                  {top?.map((row, index) => (
                    <TableRow key={row.user_id}>
                      <TableCell>
                        {index === 0 ? (
                          <span
                            css={css`
                              color: #d9b400;
                            `}
                          >
                            <FontAwesomeIcon icon={faCrown} />
                          </span>
                        ) : index === 1 ? (
                          <span
                            css={css`
                              color: #b7b7b7;
                            `}
                          >
                            <FontAwesomeIcon icon={faCrown} />
                          </span>
                        ) : index === 2 ? (
                          <span
                            css={css`
                              color: #cf8e6a;
                            `}
                          >
                            <FontAwesomeIcon icon={faCrown} />
                          </span>
                        ) : (
                          <></>
                        )}
                      </TableCell>
                      <TableCell>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>
                            <Avatar
                              src={row.picture_url}
                              css={css`
                                margin-right: 1em;
                              `}
                            />
                          </Grid>
                          <Grid item>{row.display_name}</Grid>
                          <Grid item>
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
                      </TableCell>
                      <TableCell align="right">{row.point}</TableCell>
                      <TableCell align="right">
                        {row.diff > 0 ? (
                          <span
                            css={css`
                              color: ${green["700"]};
                            `}
                          >
                            <FontAwesomeIcon icon={faArrowAltCircleUp} />{" "}
                            {row.diff}
                          </span>
                        ) : row.diff < 0 ? (
                          <span
                            css={css`
                              color: ${red["700"]};
                            `}
                          >
                            <FontAwesomeIcon icon={faArrowAltCircleDown} />{" "}
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
          </Grid>
          {/*
          <Grid item>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ユーザー</TableCell>
                    <TableCell>ポイント</TableCell>
                    <TableCell>差分</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {diff?.map(row => (
                    <TableRow key={row.user_id}>
                      <TableCell>
                        <Avatar src={row.picture_url} />
                        {row.display_name} (@{row.screen_name})
                      </TableCell>
                      <TableCell>{row.point}</TableCell>
                      <TableCell>{row.diff}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          */}
        </Grid>
      </main>

      <FooterNavigation />
    </>
  );
};

export default RankingPage;
