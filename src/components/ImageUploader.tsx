import React, { useRef } from "react";
import { css } from "@emotion/core";

export const ImageUploader: React.FC<{ clicked: boolean }> = props => {
  const anchorEl = useRef(null);

  return (
    <>
      <input
        accept="image/*"
        type="file"
        css={css`
          display: none;
        `}
        ref={anchorEl}
      />
      {props.children}
    </>
  );
};
