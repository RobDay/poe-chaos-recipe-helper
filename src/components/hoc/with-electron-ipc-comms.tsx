import React from "react";
const { ipcRenderer } = window.require("electron");
import { IPCAction } from "../../../shared/constants";
const withElectronClick = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  clickParamName: string
) => {
  class WithPathParam extends React.Component<any> {
    render() {
      const clickMapper = {
        [clickParamName]: () => {
          ipcRenderer.sendSync(IPCAction.stackOverlayClicked);
        },
      };
      return <WrappedComponent {...(this.props as P)} {...clickMapper} />;
    }
  }

  return WithPathParam;
};

export default withElectronClick;
