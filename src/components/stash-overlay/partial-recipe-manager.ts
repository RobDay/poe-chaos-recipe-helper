import {
  ItemCategory,
  StashItem,
  ItemCategoryKeys,
  ItemType,
} from "../../models/index";
import RecipeManager, { CompleteRecipeSet } from "../../recipe-manager";

export enum PartialRecipeManagerMode {
  chaos,
  regal,
}

export default class PartialRecipeManager {
  items: StashItem[];
  currentRecipeSet: CompleteRecipeSet | undefined;
  recipeSets = new Array<CompleteRecipeSet>();
  usedStashItemIDs = new Set<string>();
  processingUNID = true;

  constructor(items: StashItem[], mode: PartialRecipeManagerMode) {
    this.items = items
      .filter((item) => {
        return item.type === ItemType.Rare;
      })
      .filter((item) => {
        // TODO: Implement regal eventually
        // if (mode === PartialRecipeManagerMode.regal) {
        //   return item.ilvl > 74;
        // } else {
        return item.ilvl >= 60;
        // }
      });

    // TODO: Implement regal eventually

    const unidItems = this.items.filter((item) => {
      return !item.identified;
    });
    const recipeManager = new RecipeManager(unidItems);
    this.recipeSets = recipeManager.getChaosRecipes();
  }

  hasUsedItem(item: StashItem) {
    return this.usedStashItemIDs.has(item.id);
  }

  markItemUsedAndGetNewItems(item: StashItem) {
    this.usedStashItemIDs.add(item.id);
    return this.getRecipeItems();
  }

  // This needs to first iterate through unID items and then process ID items
  getRecipeItems(): StashItem[] | null {
    this._dequeueNextItem();
    if (
      !this.currentRecipeSet ||
      this._hasAddedAllInSet(this.currentRecipeSet)
    ) {
      return null;
    }

    const currentItems = this._getRecipeSetItems(this.currentRecipeSet).filter(
      (item) => {
        return item && !this.usedStashItemIDs.has(item.id);
      }
    );
    return currentItems;
  }

  _dequeueNextItem() {
    if (
      !this.currentRecipeSet ||
      (this._hasAddedAllInSet(this.currentRecipeSet) &&
        this.recipeSets.length > 0)
    ) {
      // Pull the next recipe set in the list
      this.currentRecipeSet = this.recipeSets[0];
      this.recipeSets = this.recipeSets.slice(1);
    }
    if (!this.currentRecipeSet && this.processingUNID) {
      // If we didn't repopulate a new recipe set, but still can process ID'd items, let's do that
      this.processingUNID = false;
      // As this is our second pass, we can include id or unid items. Only the UNID pass needs to be homogenious
      const remainingItems = this.items.filter((item) => {
        return !this.usedStashItemIDs.has(item.id);
      });
      const recipeManager = new RecipeManager(remainingItems);
      this.recipeSets = recipeManager.getChaosRecipes();
      this._dequeueNextItem();
    }
  }
  _hasAddedAllInSet(recipeSet: CompleteRecipeSet) {
    const itemIDs = this._getRecipeSetItems(recipeSet).flatMap((item) => {
      return item && item.id;
    });
    let difference = itemIDs.filter(
      (itemID) => itemID && !this.usedStashItemIDs.has(itemID)
    );
    return difference.length === 0;
  }

  _getRecipeSetItems(recipeSet: CompleteRecipeSet) {
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
      items.push(recipeSet.oneHandedWeaponA!);
      items.push(recipeSet.oneHandedWeaponB!);
    }
    return items;
  }
}
