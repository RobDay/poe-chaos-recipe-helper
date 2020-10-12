import React from "react";
import { styled } from "styletron-react";
import chaosOrb from "../images/chaos-orb.png";
import regalOrb from "../images/regal-orb.png";
import { BACKGROUND_COLOR } from "./hooks/constants";

const width = "25px";
const FlexContainer = styled("div", {
  display: "flex",
  height: width,
  backgroundColor: BACKGROUND_COLOR,
});

const SpreadFlexContainer = styled(FlexContainer, {
  justifyContent: "space-between",
  paddingLeft: "2px",
  paddingRight: "2px",
});

const IconBox = styled("div", {
  border: `solid 1px ${BACKGROUND_COLOR}`,
  height: width,
  width: width,
});
export default function ControlBar() {
  return (
    <SpreadFlexContainer>
      <FlexContainer>
        <IconBox>
          <img width={"20"} src={chaosOrb} alt="Chaos" />
        </IconBox>
        <IconBox>
          <img width={"20"} src={regalOrb} alt="Regal" />
        </IconBox>
      </FlexContainer>
      <div>
        <span role="image">🔄</span>
      </div>
    </SpreadFlexContainer>
  );
}
