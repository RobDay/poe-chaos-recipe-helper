import React, { Component } from "react";
import { BrowserRouter as Router, Route, RouteComponentProps } from "react-router-dom";
import MainComponent from "./primary-component";
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
    console.log(props.location);
    console.log(`Name is ${name}`)
    console.log(window.location.href);
    let view = ViewManager.Views()[name];
    if (view == null) throw new Error(`View ${name} is undefined`);
    return view;
  }

  render() {
    return (
      <Router>
        <div>
          <Route path="/" component={ViewManager.View} />
        </div>
      </Router>
    );
  }
}
export default ViewManager;
