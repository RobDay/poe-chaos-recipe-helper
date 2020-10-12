import React from "react";
// import logo from './logo.svg';
// import './App.css';
import ItemCountList from "./item-count/item-count-list";
import ControlBar from "./control-bar";

function MainComponent() {
  const styles = {
    "-webkit-app-region": "drag",
    color: "clear",
  };
  return (
    <div style={styles}>
      <ControlBar />
      <ItemCountList />
    </div>
  );
}

export default MainComponent;
