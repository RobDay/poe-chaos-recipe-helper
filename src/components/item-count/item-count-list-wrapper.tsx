import ItemCountList from "./item-count-list";
import { RefreshStashPayload, StashItem } from "../../models/index";
import React, { useEffect, useState } from "react";
import RecipeManager, { StashItemCounts } from "../../recipe-manager";
import { REFRESH_STASH_INFO_PAYLOAD } from "../hooks/constants";
const { ipcRenderer } = window.require("electron");

export default function ItemCountListWrapper() {
  const [stashItems, setStashItems] = useState<StashItem[]>([]);

  useEffect(() => {
    ipcRenderer.on(
      REFRESH_STASH_INFO_PAYLOAD,
      (event: any, payload: RefreshStashPayload) => {
        console.log("payload refreshed");
        setStashItems(payload.items);
      }
    );
  }, [stashItems]);

  const recipeManager = new RecipeManager(stashItems);
  const itemStats = recipeManager.generateItemStatistics();
  return <ItemCountList itemCounts={itemStats} />;
}
