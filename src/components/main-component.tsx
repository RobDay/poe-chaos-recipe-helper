import React, { useEffect } from "react";
import getStashContent from "../client/get-stash-content";
// import logo from './logo.svg';
// import './App.css';
import ItemCountListWrapper from "./item-count/item-count-list-wrapper";
import { REFRESH_STASH_INFO_PAYLOAD } from "./hooks/constants";
import ControlBar from "./control-bar";
const { ipcRenderer } = window.require("electron");

function MainComponent() {
  const refreshData = async () => {
    console.log("loading data");
    const stashItems = await getStashContent("", 5);
    console.log("sending sync");
    //TODO: Remove magic 10
    ipcRenderer.sendTo(10, REFRESH_STASH_INFO_PAYLOAD, {
      items: stashItems,
    });
    ipcRenderer.sendTo(1, REFRESH_STASH_INFO_PAYLOAD, {
      items: stashItems,
    });
  };
  useEffect(() => {
    refreshData();
  });
  const styles = {
    "-webkit-app-region": "drag",
    color: "clear",
  };
  return (
    <div style={styles}>
      <ControlBar />
      <ItemCountListWrapper />
    </div>
  );
}

export default MainComponent;
