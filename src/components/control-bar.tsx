import React from "react";
import { styled } from "styletron-react";
import chaosOrb from "../images/chaos-orb.png";
import regalOrb from "../images/regal-orb.png";

const FlexContainer = styled("div", {
  display: "flex",
  height: "20px",
  backgroundColor: "white",
});

const IconBox = styled("div", {
  border: "solid 1px grey",
  height: "20px",
  width: "20px",
});
export default function ControlBar() {
  return (
    <FlexContainer>
      <IconBox>
        <img width="20px" src={chaosOrb} alt="Chaos" />
      </IconBox>
      <IconBox>
        <img width="20px" src={regalOrb} alt="Regal" />
      </IconBox>
    </FlexContainer>
  );
}
