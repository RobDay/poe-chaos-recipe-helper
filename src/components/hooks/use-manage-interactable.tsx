import { IPCAction } from "../../../shared/constants";
const { ipcRenderer } = window.require("electron");
import log from "electron-log";

function useManageInteractable() {
  function enableInteractable() {
    // log.info("sending ignore to false");
    ipcRenderer.send(IPCAction.manageInteractable, false);
  }

  function disableInteractable() {
    // log.info("sending ignore to true");
    ipcRenderer.send(IPCAction.manageInteractable, true);
  }

  return {
    enableInteractable,
    disableInteractable,
  };
}

export default useManageInteractable;
