import React, { useState, useEffect } from "react";
import { styled } from "styletron-react";
import StashItemOverlay from "../stash-item-overlay";
import { StashItem } from "../../models/index";
import withElectronClick from "../hoc/with-electron-ipc-comms";
import useManageInteractable from "../hooks/use-manage-interactable";
import { CATEGORY_COLORS } from "../hooks/constants";
import PartialRecipeManager, {
  PartialRecipeManagerMode,
} from "./partial-recipe-manager";

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
  onStashOverlayClicked: () => void;
  // density: StashWidth.Quad;
};

// TODO: move IPC Calls injected here
function StashOverlay(props: PropsType) {
  const [partialRecipeManager, setPartialRecipeManager] = useState<
    PartialRecipeManager | undefined
  >();
  const [currentItems, setCurrentItems] = useState<StashItem[]>([]);
  const { enableInteractable, disableInteractable } = useManageInteractable();

  useEffect(() => {
    console.log("in user effect");
    if (!props.stashItems) {
      console.log("bailing");
      return;
    }
    setPartialRecipeManager(
      new PartialRecipeManager(props.stashItems, PartialRecipeManagerMode.chaos)
    );
    const items = partialRecipeManager?.getRecipeItems();
    if (items) {
      setCurrentItems(items);
    }
  }, [props.stashItems]);

  const onOverlayItemClick = (stashItem: StashItem) => {
    props.onStashOverlayClicked();
    const newItems = partialRecipeManager!.markItemUsedAndGetNewItems(
      stashItem
    );
    if (newItems) {
      setCurrentItems([...newItems]);
    } else {
      setCurrentItems([]);
    }
  };

  const onStashItemOverlayMouseEnter = (stashItem: StashItem) => {
    if (partialRecipeManager!.hasUsedItem(stashItem)) {
      console.log("baililng early because already clicked");
      return;
    }
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
    if (currentItems.length === 0) {
      console.log("No items; Returning early");
      return;
    }

    return currentItems.map((item) => {
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

  const items = partialRecipeManager?.getRecipeItems();
  if (!items || items.length === 0) {
    return <div></div>;
  }

  return <Container>{renderStashItems()}</Container>;
}

export default withElectronClick(StashOverlay, "onStashOverlayClicked");
