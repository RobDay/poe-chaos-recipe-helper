import React from "react";
import { styled } from "styletron-react";
import { StashItem } from "../../shared/models";

export type PropsType = {
  color: string;
  width: string;
  height: string;
  top: string;
  left: string;
  onStashItemClicked: (stashItem: StashItem) => void;
  onStashItemOverlayMouseEnter: (stashItem: StashItem) => void;
  onStashItemOverlayMouseExit: (stashItem: StashItem) => void;
  item: StashItem;
};

const Container = styled("div", (props: PropsType) => {
  return {
    position: "absolute",
    opacity: "70%",
    backgroundColor: props.color,
    width: props.width,
    height: props.height,
    left: props.left,
    top: props.top,
  };
});

export default function StashItemOverlay(props: PropsType) {
  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    props.onStashItemClicked(props.item);
  };
  const onMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log("mouse enter");
    props.onStashItemOverlayMouseEnter(props.item);
  };
  const onMouseExit = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log("mouse exit");
    props.onStashItemOverlayMouseExit(props.item);
  };
  return (
    <Container
      {...props}
      onClick={onClick}
      // onMouseOut={() => console.log("mouse out")}
      onMouseEnter={onMouseEnter}
      onMouseOut={onMouseExit}
    ></Container>
  );
}
