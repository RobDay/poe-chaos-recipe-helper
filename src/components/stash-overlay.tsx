import React from "react";
import { styled } from "styletron-react";
import StashItemOverlay from "./stash-item-overlay";
import {StashItem} from '../models/index'

const Container = styled("div", {
  backgroundColor: "red",
  position: "relative"
});

const INVENTORY_WIDTH = 1134;
enum StashWidth {
  Normal = 12,
  Quad = 24,
}

type PropsType = {
  stashItems: StashItem[]
}

function StashOverlay() {

  const onOverlayItemClick = (stashItem: StashItem) => {
  }

    const renderStashItems = () => {

      return (
<StashItemOverlay
        width={`${(INVENTORY_WIDTH / 24) * 2}px`}
        height={`${(INVENTORY_WIDTH / 24) * 3}px`}
        left={`${(INVENTORY_WIDTH / 24) * 2}px`}
        top={`${(INVENTORY_WIDTH / 24) * 2}px`}
        color="orange"
        onStashItemClicked={onOverlayItemClick}
      />
      )
    }
      
  return (
    <Container>
      {renderStashItems()}
    </Container>
  );
}

export default StashOverlay;
