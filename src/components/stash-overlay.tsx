import React, { useState, useEffect } from "react";
import { styled } from "styletron-react";
import StashItemOverlay from "./stash-item-overlay";
import { ItemCategory, ItemType, StashItem } from "../models/index";
import withElectronClick from "./hoc/with-electron-ipc-comms";
import getStashContent from "../client/get-stash-content";
import RecipeManager, { RecipeSet } from "../recipe-manager";
import useManageInteractable from "./hooks/use-manage-interactable";

//TODO: Filter in the recipe generator for rate
const getTempStashItem = (id: string, x: number, y: number): StashItem => {
  return {
    type: ItemType.Rare,
    category: ItemCategory.Amulet,
    name: "Tacos",
    ilvl: 2,
    width: 2,
    height: 3,
    identified: true,
    id,
    x,
    y,
  };
};

const stashItems = [
  getTempStashItem("a", 0, 0),
  getTempStashItem("b", 4, 4),
  getTempStashItem("c", 7, 4),
  getTempStashItem("d", 10, 10),
  getTempStashItem("e", 13, 10),
  getTempStashItem("f", 17, 17),
];

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
  const [clickedOverlayItems, setClickedOverlayItems] = useState(
    new Set<StashItem>()
  );
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
    clickedOverlayItems.add(stashItem);
    setClickedOverlayItems(new Set(clickedOverlayItems));
  };

  const onStashItemOverlayMouseEnter = (stashItem: StashItem) => {
    if (clickedOverlayItems.has(stashItem)) {
      console.log("baililng early because already clicked");
      return;
    }
    enableInteractable();
  };

  const onStashItemOverlayMouseExit = (stashItem: StashItem) => {
    disableInteractable();
  };

  // const getSizeInPixels = (size: number) => {
  //   // Check quad
  //   const cellCount: number = StashWidth.Quad;
  //   return `${(size * INVENTORY_WIDTH) / cellCount}px`;
  // };

  const getSizeInPixels = (size: number) => {
    // Check quad
    const cellCount: number = StashWidth.Quad;
    let cellSize = (size * INVENTORY_WIDTH) / cellCount;
    return `${cellSize}px`;
  };

  const renderStashItems = () => {
    console.log("top of render");
    const firstTwoSets = recipeSets.slice(0, 2).flat();
    console.log(firstTwoSets);

    const itemOverlays = firstTwoSets.map((recipeSet) => {
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
      console.log(`starting with ${stashItems.length}`);
      return items
        .filter((item) => {
          return !!item && !clickedOverlayItems.has(item);
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
            />
          );
        });
    });
    console.log("rendering: " + itemOverlays.flat().length);
    return itemOverlays.flat();
  };

  return <Container>{renderStashItems()}</Container>;
}

export default withElectronClick(StashOverlay, "onStashOverlayClicked");
