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
  alignItems: "center",
});

const IconBox = styled("button", {
  backgroundColor: "transparent",
  ":focus": {
    outline: "none",
    boxShadow: "none",
  },
  marginLeft: "4px",
});

const RefreshIcon = styled(IconBox, {
  paddingTop: "0px",
  filter: "grayscale(70%)",
});

type PropsType = {
  onRefreshClicked: () => void;
  onChaosClicked: () => void;
  onRegalClicked: () => void;
};
export default function ControlBar(props: PropsType) {
  return (
    <SpreadFlexContainer>
      <FlexContainer>
        <IconBox onClick={props.onChaosClicked}>
          <img width={"20"} src={chaosOrb} alt="Chaos" />
        </IconBox>
        <IconBox onClick={props.onRegalClicked}>
          <img width={"20"} src={regalOrb} alt="Regal" />
        </IconBox>
      </FlexContainer>

      <RefreshIcon onClick={props.onRefreshClicked}>
        <span role="image" aria-label="refresh">
          🔄
        </span>
      </RefreshIcon>
    </SpreadFlexContainer>
  );
}
