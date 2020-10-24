import React, { useState, useEffect } from "react";
import { styled } from "styletron-react";
import StashItemOverlay from "../stash-item-overlay";
import { StashItem } from "../../../shared/models";
import useManageInteractable from "../hooks/use-manage-interactable";
import { CATEGORY_COLORS } from "../hooks/constants";

const Container = styled("div", {
  backgroundColor: "pink",
  position: "relative",
});

const INVENTORY_WIDTH = 560;
enum StashWidth {
  Normal = 12,
  Quad = 24,
}

type PropsType = {
  stashItems: StashItem[];
  onStashOverlayClicked: (stashItem: StashItem) => void;
  // density: StashWidth.Quad;
};

// TODO: move IPC Calls injected here
function StashOverlay(props: PropsType) {
  const { enableInteractable, disableInteractable } = useManageInteractable();

  const onOverlayItemClick = (stashItem: StashItem) => {
    props.onStashOverlayClicked(stashItem);
  };

  const onStashItemOverlayMouseEnter = (stashItem: StashItem) => {
    enableInteractable();
  };

  const onStashItemOverlayMouseExit = (stashItem: StashItem) => {
    disableInteractable();
  };

  const getSizeInPixels = (size: number) => {
    // Check quad
    const cellCount: number = StashWidth.Quad;
    let cellSize = (size * INVENTORY_WIDTH) / cellCount;
    return `${cellSize}px`;
  };

  const renderStashItems = () => {
    if (props.stashItems.length === 0) {
      console.log("No items; Returning early");
      return;
    }

    return props.stashItems.map((item) => {
      if (!item) {
        return null;
      }

      return (
        <StashItemOverlay
          width={getSizeInPixels(item.width)}
          height={getSizeInPixels(item.height)}
          left={getSizeInPixels(item.x)}
          top={getSizeInPixels(item.y)}
          color={CATEGORY_COLORS[item.category]}
          onStashItemClicked={onOverlayItemClick}
          onStashItemOverlayMouseEnter={onStashItemOverlayMouseEnter}
          onStashItemOverlayMouseExit={onStashItemOverlayMouseExit}
          item={item}
          key={item.id}
        />
      );
    });
  };

  if (props.stashItems.length === 0) {
    return <div></div>;
  }

  return <Container>{renderStashItems()}</Container>;
}
export default StashOverlay;
