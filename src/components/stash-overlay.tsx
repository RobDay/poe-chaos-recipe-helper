import React from "react";
import { styled } from "styletron-react";
import StashItemOverlay from "./stash-item-overlay";
import { ItemCategory, ItemType, StashItem } from "../models/index";

//TODO: Filter in the recipe generator for rate
const getTempStashItem = (id: string, x: number, y: number): StashItem => {
  return {
    type: ItemType.Rare,
    category: ItemCategory.Amulet,
    name: "Tacos",
    ilvl: 2,
    width: 2,
    height: 3,
    identified: true,
    id,
    x,
    y,
  };
};

const stashItems = [
  getTempStashItem("a", 0, 0),
  getTempStashItem("b", 4, 4),
  getTempStashItem("c", 7, 4),
  getTempStashItem("d", 10, 10),
  getTempStashItem("e", 13, 10),
  getTempStashItem("f", 17, 17),
];

const Container = styled("div", {
  backgroundColor: "red",
  position: "relative",
});

const INVENTORY_WIDTH = 1134;
enum StashWidth {
  Normal = 12,
  Quad = 24,
}

type PropsType = {
  // stashItems: StashItem[];
  // density: StashWidth.Quad;
};

function StashOverlay(props: PropsType) {
  const onOverlayItemClick = (stashItem: StashItem) => {};

  const getSizeInPixels = (size: number) => {
    // Check quad
    const cellCount: number = StashWidth.Quad;
    return `${(size * INVENTORY_WIDTH) / cellCount}px`;
  };

  const renderStashItems = () => {
    const itemOverlays = stashItems.map((item) => {
      return (
        <StashItemOverlay
          width={getSizeInPixels(item.width)}
          height={getSizeInPixels(item.height)}
          left={getSizeInPixels(item.x)}
          top={getSizeInPixels(item.y)}
          color="orange"
          onStashItemClicked={onOverlayItemClick}
        />
      );
    });
    return itemOverlays;
  };

  return <Container>{renderStashItems()}</Container>;
}

export default StashOverlay;
