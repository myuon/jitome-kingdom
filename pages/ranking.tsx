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
import { useRankingTop, useRankingDiff } from "../src/hooks/useRanking";

const RankingPage: React.FC = () => {
  const { authToken } = useAuthCtx();
  const { data: top } = useRankingTop(authToken);
  const { data: diff } = useRankingDiff(authToken);

  return (
    <>
      <Navbar />

      <main>
        <Typography variant="h6">みょんポイントランキング</Typography>

        <Grid container spacing={2}>
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
                  {top?.map(row => (
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
        </Grid>
      </main>

      <FooterNavigation />
    </>
  );
};

export default RankingPage;
