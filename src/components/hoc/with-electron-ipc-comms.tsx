import React from "react";
const { ipcRenderer } = window.require("electron");

const withElectronClick = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  clickParamName: string
) => {
  class WithPathParam extends React.Component<any> {
    render() {
      const clickMapper = {
        [clickParamName]: () => {
          ipcRenderer.sendSync("handle-clicked-stash-overlay-item");
        },
      };
      return <WrappedComponent {...(this.props as P)} {...clickMapper} />;
    }
  }

  return WithPathParam;
};

export default withElectronClick;
