import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
} from "react-router-dom";
import MainComponent from "./main-component";
import StashOverlay from "./stash-overlay";

class ViewManager extends Component {
  static Views() {
    const result: { [key: string]: any } = {
      mainWindow: <MainComponent />,
      overlay: <StashOverlay />,
    };

    return result;
  }

  static View(props: RouteComponentProps<any>) {
    let name = props.location.search.substr(1) as string;
    let view = ViewManager.Views()[name];
    if (view == null) throw new Error(`View ${name} is undefined`);
    return view;
  }

  render() {
    return (
      <Router>
        <div style={{ backgroundColor: "transparent" }}>
          <Route path="/" component={ViewManager.View} />
        </div>
      </Router>
    );
  }
}
export default ViewManager;
