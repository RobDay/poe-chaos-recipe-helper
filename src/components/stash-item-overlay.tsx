import React from "react";
import { styled } from "styletron-react";
import { StashItem } from "../models";
const { ipcRenderer } = window.require('electron');

export type PropsType = {
  color: string;
  width: string;
  height: string;
  top: string;
  left: string;
  onStashItemClicked: (stashItem: StashItem) => void;
  // item: StashItem
};

const Container = styled("div", (props: PropsType) => {
  return {
    position: "absolute",
    opacity: "50%",
    backgroundColor: props.color,
    width: props.width,
    height: props.height,
    left: props.left,
    top: props.top,
  };
});

export default function StashItemOverlay(props: PropsType) {
    ipcRenderer.on('hi', () => {
        console.log('main told me hi');
    })
  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log("it was clicked");
    console.log(ipcRenderer.sendSync('synchronous-message', {x: e.currentTarget.offsetLeft, y: e.currentTarget.offsetTop})) // prints "pong"
  };
  return (
    <Container
      {...props}
      onPointerDown={() => console.log('on pointer down')}

      onTouchStart={() => console.log('on touch start')}
      onBeforeInput={() => console.log('before-input called')}
    //   on
      onMouseDown={() => console.log("mouse down")}
      onMouseDownCapture={() => console.log('on mouse down capture')}
      onMouseUp={() => console.log('on mouse up')}
      onClick={onClick}
      onMouseOver={() => console.log('on mouse over')}
      onMouseEnter={() => console.log("enter")}
    ></Container>
  );
}
