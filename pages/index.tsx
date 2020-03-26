import React from "react";
import { css } from "@emotion/core";

const Index: React.FC = props => {
  return (
    <>
      {/* <React.Fragment>
      <Navbar />

      <main>
        <img
          src="/image/top_jitome.png"
          css={css`
            max-width: 95%;
            display: block;
            margin: 1.5em auto;
          `}
          decoding="async"
        />
        <img
          src="/image/logo.png"
          css={css`
            max-width: 85%;
            display: block;
            margin: 1.5em auto;
          `}
          decoding="async"
          width="200px"
        />
        <div
          css={css`
            display: flex;
            justify-content: center;
          `}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={tryLogin}
            size="large"
          >
            ログインしてスタート
          </Button>
        </div>
      </main>
    </React.Fragment>
    */}
      <main>
        <div
          css={css`
            display: flex;
            justify-content: center;
          `}
        >
          <h1>メンテナンス中です。しばらくお待ちください。</h1>
        </div>
        <img
          src="/image/top_jitome.png"
          css={css`
            max-width: 95%;
            display: block;
            margin: 1.5em auto;
          `}
          decoding="async"
        />
      </main>
    </>
  );
};

export default Index;
