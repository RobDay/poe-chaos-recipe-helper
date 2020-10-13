import React, { useEffect } from "react";
import { ToggleInventoryPayload } from "../models/index";
import getStashContent from "../client/get-stash-content";
import ItemCountListWrapper from "./item-count/item-count-list-wrapper";
import {
  REFRESH_STASH_INFO_PAYLOAD,
  TOGGLE_INVENTORY_OVERLAY,
  WindowID,
} from "./hooks/constants";
import ControlBar from "./control-bar";
const { ipcRenderer } = window.require("electron");

function MainComponent() {
  const refreshData = async () => {
    console.log("loading data");
    const stashItems = await getStashContent("", 5);
    //TODO: Remove magic 10
    console.log("sending refresh to other window");
    ipcRenderer.sendTo(WindowID.Overlay, REFRESH_STASH_INFO_PAYLOAD, {
      items: stashItems,
    });
    ipcRenderer.sendTo(WindowID.Main, REFRESH_STASH_INFO_PAYLOAD, {
      items: stashItems,
    });
  };
  useEffect(() => {
    refreshData();
  });

  const onRefreshClicked = () => {
    refreshData();
  };

  const onChaosClicked = () => {
    const payload: ToggleInventoryPayload = {
      type: "Chaos",
    };
    console.log("sending");
    ipcRenderer.send(TOGGLE_INVENTORY_OVERLAY, payload);
    ipcRenderer.sendTo(WindowID.Overlay, TOGGLE_INVENTORY_OVERLAY, payload);
  };

  const onRegalClicked = () => {
    const payload: ToggleInventoryPayload = {
      type: "Regal",
    };
    ipcRenderer.send(TOGGLE_INVENTORY_OVERLAY, payload);
    ipcRenderer.sendTo(WindowID.Overlay, TOGGLE_INVENTORY_OVERLAY, payload);
  };
  const styles = {
    "-webkit-app-region": "drag",
    color: "clear",
  };
  return (
    <div style={styles}>
      <ControlBar
        onChaosClicked={onChaosClicked}
        onRefreshClicked={onRefreshClicked}
        onRegalClicked={onRegalClicked}
      />
      <ItemCountListWrapper />
    </div>
  );
}

export default MainComponent;
