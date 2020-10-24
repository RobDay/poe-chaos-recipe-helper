import React, { useEffect, useState } from "react";
import { RefreshStashPayload, StashItem } from "../../models/index";
import withElectronClick from "../hoc/with-electron-ipc-comms";
import log from "electron-log";
import { IPCAction } from "../../../shared/constants";

import StashOverlay from "./stash-overlay";
import PartialRecipeManager, {
  PartialRecipeManagerMode,
} from "./partial-recipe-manager";
const { ipcRenderer } = window.require("electron");

type PropsType = {
  onStashOverlayClicked: () => void;
};
export function StashOverlayWrapper(props: PropsType) {
  const [stashItems, setStashItems] = useState<StashItem[]>([]);
  const [currentItems, setCurrentItems] = useState<StashItem[]>([]);
  const [partialRecipeManager, setPartialRecipeManager] = useState<
    PartialRecipeManager | undefined
  >();
  useEffect(() => {
    ipcRenderer.on(
      IPCAction.stashItemsRefreshed,
      (event: any, payload: RefreshStashPayload) => {
        setStashItems(payload.items);
        setPartialRecipeManager(
          new PartialRecipeManager(
            payload.items,
            PartialRecipeManagerMode.chaos
          )
        );
        const items = partialRecipeManager?.getRecipeItems();
        if (items) {
          setCurrentItems(items);
        }
      }
    );
  });
  const onStashOverlayClicked = (stashItem: StashItem) => {
    const newItems = partialRecipeManager!.markItemUsedAndGetNewItems(
      stashItem
    );

    if (newItems) {
      setCurrentItems([...newItems]);
    } else {
      setCurrentItems([]);
    }
    props.onStashOverlayClicked();
  };

  return (
    <StashOverlay
      stashItems={currentItems}
      onStashOverlayClicked={onStashOverlayClicked}
    />
  );
}

export default withElectronClick(StashOverlayWrapper, "onStashOverlayClicked");
