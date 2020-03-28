import React from "react";
import { css } from "@emotion/core";

export const NumberBoard: React.FC<{
  label: string;
  number: number;
}> = props => {
  return (
    <div
      css={css`
        width: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: center;
        `}
      >
        <p
          css={css`
            color: #444;
          `}
        >
          {props.label}
        </p>
      </div>
      <div
        css={css`
          display: flex;
          justify-content: center;
          font-size: 128px;
        `}
      >
        {props.number}
      </div>
    </div>
  );
};
