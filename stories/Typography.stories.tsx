import {
  Typography,
  MuiThemeProvider,
  Container,
  Grid
} from "@material-ui/core";
import { muiTheme } from "../pages/_app";
import React from "react";

export default {
  title: "Typography"
};

export const TypographyPage: React.FC = () => {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <Container maxWidth="md">
        <div>
          <Typography variant="h1">タイポグラフィー H1</Typography>
          <Typography variant="h2">タイポグラフィー H2</Typography>
          <Typography variant="h3">タイポグラフィー H3</Typography>
          <Typography variant="h4">タイポグラフィー H4</Typography>
          <Typography variant="body1">タイポグラフィー Body1</Typography>
          <Typography variant="caption">タイポグラフィー Caption</Typography>
        </div>
        <Typography variant="button">ボタン</Typography>
      </Container>
    </MuiThemeProvider>
  );
};

export const Example: React.FC = () => {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <Container maxWidth="md">
        <Grid container direction="column" spacing={4}>
          <Grid item>
            <Typography variant="h1">竹取物語</Typography>
            <Typography variant="caption">
              たけとりものがたり 作者不詳
            </Typography>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item>
              <Typography variant="h2">
                色は匂へど散りぬるを 我が世誰ぞ常ならむ 有為の奥山今日越えて
                浅き夢見し酔ひもせず
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                春は、あけぼの。やうやう白くなりゆく山ぎは少し明りて紫だちたる雲の細くたなびきたる。
                夏は、夜。月の頃はさらなり。闇もなほ。螢の多く飛び違ひたる。また、ただ一つ二つなど、ほのかにうち光りて行くもをかし。雨など降るもをかし。
                秋は、夕暮。夕日のさして、山の端いと近うなりたるに、烏の寝どころへ行くとて、三つ四つ、二つ三つなど、飛び急ぐさへあはれなり。まいて雁などの列ねたるがいと小さく見ゆるは、いとをかし。日入り果てて、風の音、虫の音など、はたいふべきにあらず。
                冬は、つとめて。雪の降りたるはいふべきにもあらず。霜のいと白きも、またさらでも、いと寒きに、火など急ぎ熾して、炭もて渡るも、いとつきづきし。昼になりて、ぬるくゆるびもていけば、火桶の火も、白き灰がちになりて、わろし。
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </MuiThemeProvider>
  );
};
