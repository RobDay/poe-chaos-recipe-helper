import React from "react";
import { styled } from "styletron-react";
import { BACKGROUND_COLOR } from "../hooks/constants";

type PropsType = {
  itemName: String;
  itemCount: number;
  color: string;
  style?: any;
};

const Box = styled("div", (props: PropsType) => {
  return {
    backgroundColor: props.color,
    border: `solid 1px ${BACKGROUND_COLOR}`,
    textAlign: "center",
  };
});

const H5 = styled("h5", {
  lineHeight: 0,
  marginBlockStart: "1em",
  marginBlockEnd: " 1em",
  filter: "grayscale(70%)",
});

const P = styled("p", {
  lineHeight: 0,
});

export default function ItemCountCell(props: PropsType) {
  return (
    <Box {...props}>
      <H5>{props.itemName}</H5>
      <P>{props.itemCount}</P>
    </Box>
  );
}
