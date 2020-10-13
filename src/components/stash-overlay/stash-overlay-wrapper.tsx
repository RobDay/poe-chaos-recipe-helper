import React, { useEffect, useState } from "react";
import { RefreshStashPayload, StashItem } from "../../models/index";
import { REFRESH_STASH_INFO_PAYLOAD } from "../hooks/constants";
import StashOverlay from "./stash-overlay";
const { ipcRenderer } = window.require("electron");

type PropsType = {
  //   onStashOverlayClicked: () => void;
};
export default function StashOverlayWrapper(props: PropsType) {
  const [stashItems, setStashItems] = useState<StashItem[]>([]);
  useEffect(() => {
    ipcRenderer.on(
      REFRESH_STASH_INFO_PAYLOAD,
      (event: any, payload: RefreshStashPayload) => {
        setStashItems(payload.items);
      }
    );
  });

  console.log("rendering with items");
  console.log(stashItems.length);
  return <StashOverlay stashItems={stashItems} />;
}
