import React from "react";
import { css } from "@emotion/core";

export const MultiColorBar: React.FC = props => {
  return (
    <div
      css={css`
        display: flex;
        background-image: linear-gradient(
          to right,
          #6cc2bd,
          #4d95ac,
          #7c79a2,
          #f3627b,
          #ffa494,
          #fee4c4
        );
        width: 100%;
        height: 5px;

        & > div {
          flex-grow: 1;
        }
      `}
    />
  );
};
