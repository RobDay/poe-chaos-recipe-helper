import React, { useState, useEffect } from "react";
import { styled } from "styletron-react";
import StashItemOverlay from "./stash-item-overlay";
import { ItemCategory, ItemType, StashItem } from "../models/index";
import withElectronClick from "./hoc/with-electron-ipc-comms";
import getStashContent from "../client/get-stash-content";
import RecipeManager, { RecipeSet } from "../recipe-manager";
import useManageInteractable from "./hooks/use-manage-interactable";

const Container = styled("div", {
  backgroundColor: "pink",
  position: "relative",
});

const INVENTORY_WIDTH = 560;
enum StashWidth {
  Normal = 12,
  Quad = 24,
}

type PropsType = {
  // stashItems: StashItem[];
  onStashOverlayClicked: () => void;
  // density: StashWidth.Quad;
};

// TODO: move IPC Calls injected here
function StashOverlay(props: PropsType) {
  const [clickedOverlayItemIDs, setClickedOverlayItemIDs] = useState(
    new Set<string>()
  );
  const [currentRecipeSet, setCurrentRecipeSet] = useState<
    RecipeSet | undefined
  >();
  const { enableInteractable, disableInteractable } = useManageInteractable();
  const [recipeSets, setRecipeSets] = useState(new Array<RecipeSet>());

  const getChaosRecipes = async () => {
    const stashItems = await getStashContent("", 5);

    const recipeManager = new RecipeManager(stashItems);
    const chaosRecipes = recipeManager.getChaosRecipes();
    console.log("Found chaos recipes");
    console.log(JSON.stringify(chaosRecipes, null, 2));
    setRecipeSets([...chaosRecipes]);
  };

  useEffect(() => {
    getChaosRecipes();
  }, []);

  const onOverlayItemClick = (stashItem: StashItem) => {
    props.onStashOverlayClicked();
    clickedOverlayItemIDs.add(stashItem.id);
    setClickedOverlayItemIDs(new Set(clickedOverlayItemIDs));
  };

  const onStashItemOverlayMouseEnter = (stashItem: StashItem) => {
    if (clickedOverlayItemIDs.has(stashItem.id)) {
      console.log("baililng early because already clicked");
      return;
    }
    enableInteractable();
  };

  const onStashItemOverlayMouseExit = (stashItem: StashItem) => {
    disableInteractable();
  };

  const getSizeInPixels = (size: number) => {
    // Check quad
    const cellCount: number = StashWidth.Quad;
    let cellSize = (size * INVENTORY_WIDTH) / cellCount;
    return `${cellSize}px`;
  };

  const _getRecipeSetItems = (recipeSet: RecipeSet) => {
    let items = [
      recipeSet.amulet,
      recipeSet.armor,
      recipeSet.belt,
      recipeSet.boots,
      recipeSet.gloves,
      recipeSet.helmet,
      recipeSet.ringA,
      recipeSet.ringB,
    ];
    if (recipeSet.twoHandedWeapon) {
      items.push(recipeSet.twoHandedWeapon);
    } else {
      items.push(recipeSet.oneHandedWeaponA);
      items.push(recipeSet.oneHandedWeaponB);
    }
    return items;
  };

  const _hasAddedAllInSet = (recipeSet: RecipeSet) => {
    const itemIDs = _getRecipeSetItems(recipeSet).flatMap((item) => {
      return item && item.id;
    });
    let difference = itemIDs.filter(
      (itemID) => itemID && !clickedOverlayItemIDs.has(itemID)
    );
    return difference.length > 0;
  };
  const renderStashItems = () => {
    console.log("top of render");
    console.log(`we have ${recipeSets.length} sets`);
    let recipeSet = currentRecipeSet;
    if ((!recipeSet || _hasAddedAllInSet(recipeSet)) && recipeSets.length > 0) {
      console.log("in the inner block");
      recipeSet = recipeSets.shift();
      setCurrentRecipeSet(recipeSet);
      setRecipeSets([...recipeSets]);
    }
    if (!recipeSet) {
      console.log("returning early here");
      return;
      // Need to exit here as we are done with this pass
    }

    // console.log("The chosen recipe set is");

    const items = _getRecipeSetItems(recipeSet);
    // console.log(`starting with ${stashItems.length}`);
    return items
      .filter((item) => {
        return !!item && !clickedOverlayItemIDs.has(item.id);
      })
      .map((item) => {
        if (!item) {
          return null;
        }
        const x = getSizeInPixels(item.x);
        const y = getSizeInPixels(item.y);
        console.log(`x: ${x}; y: ${y}`);
        return (
          <StashItemOverlay
            width={getSizeInPixels(item.width)}
            height={getSizeInPixels(item.height)}
            left={getSizeInPixels(item.x)}
            top={getSizeInPixels(item.y)}
            color="orange"
            onStashItemClicked={onOverlayItemClick}
            onStashItemOverlayMouseEnter={onStashItemOverlayMouseEnter}
            onStashItemOverlayMouseExit={onStashItemOverlayMouseExit}
            item={item}
            key={item.id}
          />
        );
      });
  };

  return <Container>{renderStashItems()}</Container>;
}

export default withElectronClick(StashOverlay, "onStashOverlayClicked");
