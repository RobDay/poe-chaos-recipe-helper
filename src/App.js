import React from 'react';
import logo from './logo.svg';
import './App.css';
import ItemCountList from './components/item-count/item-count-list'
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
const styles = {
  WebkitAppRegion: "drag"
}
  return (
    <div className="Appd" style={styles}>
      <ItemCountList itemCounts={itemCounts}/>
    </div>
  );
}

export default App;
