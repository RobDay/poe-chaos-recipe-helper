import React, { useEffect } from "react";
import { Config, ToggleInventoryPayload } from "../models/index";
import getStashContent from "../client/get-stash-content";
import ItemCountListWrapper from "./item-count/item-count-list-wrapper";
import { IPCAction } from "../../shared/constants";
import { WindowID } from "./hooks/constants";
import ControlBar from "./control-bar";
import log from "electron-log";
const { ipcRenderer } = window.require("electron");

function MainComponent() {
  const refreshData = async () => {
    log.info("loading data");
    const config: Config = await ipcRenderer.invoke(IPCAction.requestConfig);
    log.info("config is");
    log.info(config);
    const stashItems = await getStashContent(config.account.username, config.stash.tabIndex, config.account.league);
    //TODO: Remove magic 10
    log.info("sending refresh to other window");
    ipcRenderer.sendTo(WindowID.Overlay, IPCAction.stashItemsRefreshed, {
      items: stashItems,
    });
    ipcRenderer.sendTo(WindowID.Main, IPCAction.stashItemsRefreshed, {
      items: stashItems,
    });
    ipcRenderer.send(IPCAction.stashItemsRefreshed, {
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
    log.info("sending");
    ipcRenderer.send(IPCAction.toggleInventoryOverlay, payload);
    ipcRenderer.sendTo(WindowID.Overlay, IPCAction.toggleInventoryOverlay, payload);
  };

  const onRegalClicked = () => {
    // const payload: ToggleInventoryPayload = {
    //   type: "Regal",
    // };
    // ipcRenderer.send(IPCAction.toggleInventoryOverlay, payload);
    // ipcRenderer.sendTo(
    //   WindowID.Overlay,
    //   IPCAction.toggleInventoryOverlay,
    //   payload
    // );
  };
  const styles = {
    "-webkit-app-region": "drag",
    color: "clear",
  };
  return (
    <div style={styles}>
      <ControlBar onChaosClicked={onChaosClicked} onRefreshClicked={onRefreshClicked} onRegalClicked={onRegalClicked} />
      <ItemCountListWrapper />
    </div>
  );
}

export default MainComponent;
