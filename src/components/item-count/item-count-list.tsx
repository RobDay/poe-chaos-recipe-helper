import React, { useEffect, useState } from "react";
import { styled } from "styletron-react";

import { ItemCategory } from "../../models/index";
import { CATEGORY_COLORS } from "../hooks/constants";
import ItemCountCell from "./item-count-cell";
import getStashContent from "../../client/get-stash-content";

import RecipeManager, { StashItemCounts } from "../../recipe-manager";

const boxSize = "45px";
type PropsType = {
  //   itemCounts: StashItemCounts;
};

const SizedItemCountCell = styled(ItemCountCell, {
  width: boxSize,
  pointerEvents: "none",
  userSelect: "none",
});

const FlexContainer = styled("div", {
  display: "flex",
});

export default function ItemCountList(props: PropsType) {
  const [itemCounts, setItemCounts] = useState<StashItemCounts | undefined>();

  const getItemCounts = async () => {
    const stashItems = await getStashContent("", 5);
    // const blah = {
    //   numTabs: stashContents["numTabs"]!,
    //   quadTab: stashContents["quadTab"],
    //   items: stashContents["items"],
    // };
    // const stashItems = adaptStashAPIResponse(blah);
    const recipeManager = new RecipeManager(stashItems);
    const itemStats = recipeManager.generateItemStatistics();
    console.log("setting counts to");
    console.log(itemStats);
    setItemCounts(itemStats);
  };

  useEffect(() => {
    getItemCounts();
  }, []);

  if (itemCounts) {
    return (
      <FlexContainer style={{ height: boxSize }}>
        <SizedItemCountCell
          itemName="🎩"
          itemCount={itemCounts.HELMET}
          color={CATEGORY_COLORS[ItemCategory.Helmet]}
        />
        <SizedItemCountCell
          itemName="🥋"
          itemCount={itemCounts.BELT}
          color={CATEGORY_COLORS[ItemCategory.Belt]}
        />
        <SizedItemCountCell
          itemName="🧥"
          itemCount={itemCounts.ARMOR}
          color={CATEGORY_COLORS[ItemCategory.Armor]}
        />
        <SizedItemCountCell
          itemName="🥊"
          itemCount={itemCounts.GLOVES}
          color={CATEGORY_COLORS[ItemCategory.Gloves]}
        />
        <SizedItemCountCell
          itemName="🥾"
          itemCount={itemCounts.BOOTS}
          color={CATEGORY_COLORS[ItemCategory.Boots]}
        />
        <SizedItemCountCell
          itemName="⚔️"
          itemCount={itemCounts.ONE_HANDED_WEAPON}
          color={CATEGORY_COLORS[ItemCategory.OneHandedWeapon]}
        />
        <SizedItemCountCell
          itemName="🏹"
          itemCount={itemCounts.TWO_HANDED_WEAPON}
          color={CATEGORY_COLORS[ItemCategory.TwoHandedWeapon]}
        />
        <SizedItemCountCell
          itemName="💍"
          itemCount={itemCounts.RING}
          color={CATEGORY_COLORS[ItemCategory.Ring]}
        />
        <SizedItemCountCell
          itemName="📿"
          itemCount={itemCounts.AMULET}
          color={CATEGORY_COLORS[ItemCategory.Amulet]}
        />
      </FlexContainer>
    );
  }

  return <FlexContainer style={{ height: boxSize }}></FlexContainer>;
}

function ItemCountListContainer(props: PropsType) {}
