import React, { useState, useCallback } from "react";
import { ButtonGroup, Button } from "@material-ui/core";

export const RadioButtonGroup: React.FC<{
  datalist: {
    label: React.ReactNode;
    startIcon?: React.ReactNode;
    key: string;
  }[];
  onChange: (key: string) => void;
  disabled?: boolean;
}> = props => {
  const [active, setActive] = useState<string>();
  const handleClick = useCallback(
    (key: string) => {
      setActive(key);
      props.onChange(key);
    },
    [props.onChange]
  );

  return (
    <ButtonGroup disabled={props.disabled}>
      {props.datalist.map(data => (
        <Button
          key={data.key}
          color="primary"
          variant={active !== data.key ? "contained" : undefined}
          onClick={() => handleClick(data.key)}
          startIcon={data.startIcon}
        >
          {data.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};
