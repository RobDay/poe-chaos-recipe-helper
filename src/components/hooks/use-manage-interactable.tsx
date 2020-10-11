import { MANAGE_INTERACTION_KEY } from "./constants";
const { ipcRenderer } = window.require("electron");

function useManageInteractable() {
  function enableInteractable() {
    // console.log("sending ignore to false");
    ipcRenderer.send(MANAGE_INTERACTION_KEY, false);
  }

  function disableInteractable() {
    // console.log("sending ignore to true");
    ipcRenderer.send(MANAGE_INTERACTION_KEY, true);
  }

  return {
    enableInteractable,
    disableInteractable,
  };
}

export default useManageInteractable;
