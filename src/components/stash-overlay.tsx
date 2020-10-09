import React, { useState } from "react";
import { styled } from "styletron-react";
import StashItemOverlay from "./stash-item-overlay";
import { ItemCategory, ItemType, StashItem } from "../models/index";
import withElectronClick from "./hoc/with-electron-ipc-comms";

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
  backgroundColor: "pink",
  position: "relative",
});

const INVENTORY_WIDTH = 1134;
enum StashWidth {
  Normal = 12,
  Quad = 24,
}

type PropsType = {
  // stashItems: StashItem[];
  onStashOverlayClicked: () => void;
  // density: StashWidth.Quad;
};

// TODO: move IPC Calls injected here
function StashOverlay(props: PropsType) {
  const [clickedOverlayItems, setClickedOverlayItems] = useState(
    new Set<StashItem>()
  );
  const onOverlayItemClick = (stashItem: StashItem) => {
    //TODO: move to const
    console.log("setting clicked here");
    props.onStashOverlayClicked();
    clickedOverlayItems.add(stashItem);
    setClickedOverlayItems(new Set(clickedOverlayItems));
  };

  const getSizeInPixels = (size: number) => {
    // Check quad
    const cellCount: number = StashWidth.Quad;
    return `${(size * INVENTORY_WIDTH) / cellCount}px`;
  };

  const renderStashItems = () => {
    console.log("it contains");
    console.log(clickedOverlayItems);
    const itemOverlays = stashItems
      .filter((item) => {
        return !clickedOverlayItems.has(item);
      })
      .map((item) => {
        return (
          <StashItemOverlay
            width={getSizeInPixels(item.width)}
            height={getSizeInPixels(item.height)}
            left={getSizeInPixels(item.x)}
            top={getSizeInPixels(item.y)}
            color="orange"
            onStashItemClicked={onOverlayItemClick}
            item={item}
          />
        );
      });
    return itemOverlays;
  };

  return <Container>{renderStashItems()}</Container>;
}

export default withElectronClick(StashOverlay, "onStashOverlayClicked");
