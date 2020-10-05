import React from 'react';
import logo from './logo.svg';
import './App.css';
import ItemCount from './components/item-count'
import {ItemCategory} from './models/index'

import getStashContent from './client/get-stash-content'

function App() {
  let json = getStashContent('yousillygoose', 1);
  console.log(json);

  const itemCounts = {
    [ItemCategory.Helmet]: 5,
    [ItemCategory.Belt]: 1,
    [ItemCategory.Armor]: 2,
    [ItemCategory.Gloves]: 3,
    [ItemCategory.Boots]: 10,
    [ItemCategory.OneHandedWeapon]: 3,
    [ItemCategory.TwoHandedWeapon]: 2,
    [ItemCategory.Ring]: 1,
    [ItemCategory.Amulet]: 6
}
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <ItemCount itemCounts={itemCounts}/>
    </div>
  );
}

export default App;
