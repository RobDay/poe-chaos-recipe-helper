import { IPCAction } from "../../../shared/constants";
const { ipcRenderer } = window.require("electron");

function useManageInteractable() {
  function enableInteractable() {
    // console.log("sending ignore to false");
    ipcRenderer.send(IPCAction.manageInteractable, false);
  }

  function disableInteractable() {
    // console.log("sending ignore to true");
    ipcRenderer.send(IPCAction.manageInteractable, true);
  }

  return {
    enableInteractable,
    disableInteractable,
  };
}

export default useManageInteractable;
