import React, {useEffect, useState} from 'react';
import { styled } from "styletron-react";

import {ItemCategory} from '../../models/index'
import ItemCountCell from './item-count-cell'
import getStashContent from '../../client/get-stash-content'
import adaptStashAPIResponse from '../../adapters/adapt-stash-contents'
import RecipeManager, {StashItemCounts} from '../../recipe-manager';

const boxSize = "50px"
type PropsType  = {
    itemCounts: StashItemCounts
}

const SizedItemCountCell = styled(ItemCountCell, {
    width: boxSize,
    pointerEvents: "none",
    userSelect: "none"
})

const FlexContainer = styled("div", {
    display: 'flex'
});


export default function ItemCountList(props: PropsType) {
    const [itemCounts, setItemCounts] = useState<StashItemCounts | undefined>();

    const getItemCounts = async () => {
        const stashContents = await getStashContent('', 5);
          const blah = {
              numTabs: stashContents["numTabs"]!,
              quadTab: stashContents["quadTab"],
              items: stashContents["items"]
          }
          const stashItems = adaptStashAPIResponse(blah)
          const recipeManager = new RecipeManager(stashItems);
          const itemStats = recipeManager.generateItemStatistics();
          console.log('setting counts to');
          console.log(itemStats);
          setItemCounts(itemStats);
    }

    useEffect(() => {
        getItemCounts()
      }, []); 

      if (itemCounts) {
        return (
            <FlexContainer style={{height: boxSize  }}>
            <SizedItemCountCell itemName="Helm" itemCount={itemCounts.HELMET} color="red"/>
            <SizedItemCountCell itemName="Belt" itemCount={itemCounts.BELT} color="orange" />
            <SizedItemCountCell itemName="Armr" itemCount={itemCounts.ARMOR} color="yellow" />
            <SizedItemCountCell itemName="Glov" itemCount={itemCounts.GLOVES} color="green" />
            <SizedItemCountCell itemName="Boot" itemCount={itemCounts.HELMET} color="blue" />
            <SizedItemCountCell itemName="1H" itemCount={itemCounts.ONE_HANDED_WEAPON} color="indigo" />
            <SizedItemCountCell itemName="2H" itemCount={itemCounts.TWO_HANDED_WEAPON} color="violet" />
            <SizedItemCountCell itemName="Ring" itemCount={itemCounts.RING} color="cyan" />
            <SizedItemCountCell itemName="Ammy" itemCount={itemCounts.AMULET} color="gray" />
        </FlexContainer>
        );
      }

    return (
        <FlexContainer style={{height: boxSize  }}></FlexContainer>
    )
}

function ItemCountListContainer(props: PropsType) {

}