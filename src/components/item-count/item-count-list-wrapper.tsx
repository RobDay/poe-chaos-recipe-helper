import ItemCountList from "./item-count-list";
import log from "electron-log";
import { RefreshStashPayload, StashItem } from "../../models/index";
import React, { useEffect, useState } from "react";
import RecipeManager, { StashItemCounts } from "../../recipe-manager";
import { IPCAction } from "../../../shared/constants";
const { ipcRenderer } = window.require("electron");

export default function ItemCountListWrapper() {
  const [stashItems, setStashItems] = useState<StashItem[]>([]);

  useEffect(() => {
    ipcRenderer.on(
      IPCAction.stashItemsRefreshed,
      (event: any, payload: RefreshStashPayload) => {
        log.info("payload refreshed");
        setStashItems(payload.items);
      }
    );
  }, [stashItems]);

  const recipeManager = new RecipeManager(stashItems);
  const itemStats = recipeManager.generateItemStatistics();
  return <ItemCountList itemCounts={itemStats} />;
}
