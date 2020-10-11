import { ItemCategory, StashItem, ItemCategoryKeys } from "./models/index";

export type RecipeSet = {
  helmet?: StashItem;
  belt?: StashItem;
  armor?: StashItem;
  gloves?: StashItem;
  boots?: StashItem;
  oneHandedWeaponA?: StashItem;
  oneHandedWeaponB?: StashItem;
  twoHandedWeapon?: StashItem;
  ringA?: StashItem;
  ringB?: StashItem;
  amulet?: StashItem;
};

export type StashItemCounts = {
  [ItemCategory.Helmet]: number;
  [ItemCategory.Belt]: number;
  [ItemCategory.Armor]: number;
  [ItemCategory.Gloves]: number;
  [ItemCategory.Boots]: number;
  [ItemCategory.OneHandedWeapon]: number;
  [ItemCategory.TwoHandedWeapon]: number;
  [ItemCategory.Ring]: number;
  [ItemCategory.Amulet]: number;
};

type RecipeSetKeys = keyof RecipeSet;

type GroupedStashItems = {
  [ItemCategory.Helmet]: StashItem[];
  [ItemCategory.Belt]: StashItem[];
  [ItemCategory.Armor]: StashItem[];
  [ItemCategory.Gloves]: StashItem[];
  [ItemCategory.Boots]: StashItem[];
  [ItemCategory.OneHandedWeapon]: StashItem[];
  [ItemCategory.TwoHandedWeapon]: StashItem[];
  [ItemCategory.Ring]: StashItem[];
  [ItemCategory.Amulet]: StashItem[];
  [ItemCategory.Unknown]: StashItem[];
};
export default class RecipeManager {
  items: StashItem[];

  constructor(items: StashItem[]) {
    console.log("items here are");
    console.log(items);
    this.items = items;
  }

  _generateItemStatistics(items: StashItem[]) {
    let initialState: StashItemCounts = {
      [ItemCategory.Helmet]: 0,
      [ItemCategory.Belt]: 0,
      [ItemCategory.Armor]: 0,
      [ItemCategory.Gloves]: 0,
      [ItemCategory.Boots]: 0,
      [ItemCategory.OneHandedWeapon]: 0,
      [ItemCategory.TwoHandedWeapon]: 0,
      [ItemCategory.Ring]: 0,
      [ItemCategory.Amulet]: 0,
    };
    const result = items
      .filter((item) => {
        return item.ilvl >= 60;
      })
      .reduce((result, item) => {
        if (item.category === ItemCategory.Unknown) {
          return result;
        }
        result[item.category] += 1;
        return result;
      }, initialState);
    console.log("returning stats");
    console.log(result);
    return result;
  }

  generateItemStatistics() {
    console.log("generating stats");
    return this._generateItemStatistics(this.items);
  }

  _generateItemCountObject(): GroupedStashItems {
    return {
      [ItemCategory.Helmet]: [],
      [ItemCategory.Belt]: [],
      [ItemCategory.Armor]: [],
      [ItemCategory.Gloves]: [],
      [ItemCategory.Boots]: [],
      [ItemCategory.OneHandedWeapon]: [],
      [ItemCategory.TwoHandedWeapon]: [],
      [ItemCategory.Ring]: [],
      [ItemCategory.Amulet]: [],
      [ItemCategory.Unknown]: [],
    };
  }

  // TODO: Need to handle if regal recipe is preferred, maybe?
  getChaosRecipes() {
    // TODO: Figure out consistent casing for this
    console.log("Generating chaos recipes");
    let regalLevelItems = this._generateItemCountObject();
    // TODO: Does this deep copy?
    let chaosLevelItems = this._generateItemCountObject();
    let totalChaosItems = 0;
    for (let item of this.items) {
      //TODO: This is jsut for testing
      if (item.ilvl > 100) {
        console.log("pushing regal item");
        regalLevelItems[item.category].push(item);
      } else {
        console.log("pushing chaos item");
        totalChaosItems += 1;
        chaosLevelItems[item.category].push(item);
      }
    }

    console.log("total chaos items: " + totalChaosItems);

    console.log("Regal Items");
    // console.log(chaosL)
    console.log(JSON.stringify(regalLevelItems, null, 2));
    console.log("!!!");

    let chaosRecipeItems: RecipeSet[] = [];
    let regalRecipeItems: RecipeSet[] = [];
    while (true) {
      let recipeSet: RecipeSet = {};
      recipeSet.helmet = regalLevelItems.HELMET.pop();
      recipeSet.belt = regalLevelItems.BELT.pop();
      recipeSet.armor = regalLevelItems.ARMOR.pop();
      recipeSet.gloves = regalLevelItems.GLOVES.pop();
      recipeSet.boots = regalLevelItems.BOOTS.pop();
      recipeSet.ringA = regalLevelItems.RING.pop();
      recipeSet.ringB = regalLevelItems.RING.pop();
      recipeSet.amulet = regalLevelItems.AMULET.pop();
      recipeSet.twoHandedWeapon = regalLevelItems.TWO_HANDED_WEAPON.pop();
      if (!recipeSet.twoHandedWeapon) {
        recipeSet.oneHandedWeaponA = regalLevelItems.ONE_HANDED_WEAPON.pop();
        recipeSet.oneHandedWeaponB = regalLevelItems.ONE_HANDED_WEAPON.pop();
      }

      // TODO: Break this
      let finalRecipeSet;
      console.log("Recipe Set Progress");
      console.log(JSON.stringify(recipeSet, null, 2));
      if (this._isRecipeSetComplete(recipeSet)) {
        console.log("Have a complete recipe set. Will replace an item");
        let [newRecipeSet, removedItems] = this._replaceWithChaosItem(
          recipeSet,
          chaosLevelItems
        );
        if (removedItems) {
          // Remove these items from being available in the regal list
          for (let removedItem of removedItems) {
            regalLevelItems[removedItem.category].push(removedItem);
          }
        }
        finalRecipeSet = newRecipeSet;
      } else {
        console.log("Have an incomplete recipe set. Will replace an item");
        finalRecipeSet = this._fillMissingWithChaosItems(
          recipeSet,
          chaosLevelItems
        );
      }
      if (finalRecipeSet && this._isRecipeSetComplete(finalRecipeSet)) {
        chaosRecipeItems.push(finalRecipeSet);
      } else {
        break;
      }
    }
    return chaosRecipeItems;

    // TODO: If we bulid regal recipes here, we'd need to reserve the finalRecipe that wasn't complete and put them back onto the regal allowed list
  }

  // Swap an item with a chaos-level item. If no swap happens, return a null second param. It can potentially swap out two one-handed weaopns
  // NOTE: This will mutate the passed in chaosItems
  _replaceWithChaosItem(
    fullRecipeSet: RecipeSet,
    chaosItems: GroupedStashItems
  ): [RecipeSet | null, StashItem[] | null] {
    // Using a heap would be better for this, but whatever;

    // TODO: Add a check to make sure the input is valid

    let maxCategory: ItemCategory | undefined;
    let maxItemCount = 0;

    const properties: ItemCategory[] = [
      ItemCategory.Helmet,
      ItemCategory.Belt,
      ItemCategory.Armor,
      ItemCategory.Gloves,
      ItemCategory.Boots,
      ItemCategory.OneHandedWeapon,
      ItemCategory.TwoHandedWeapon,
      ItemCategory.Ring,
      ItemCategory.Amulet,
    ];

    for (const category of properties) {
      const items = chaosItems[category];
      if (items.length > maxItemCount) {
        maxItemCount = items.length;
      } else if (
        maxCategory === ItemCategory.OneHandedWeapon &&
        fullRecipeSet.twoHandedWeapon &&
        items.length == maxItemCount
      ) {
        // TODO: This is a special case that is really gross
        // Basically, we need to deprioritize using one handed weapons to swap out two handed weapons because we need two of them
        maxCategory = category;
      }
    }
    if (!maxCategory) {
      return [null, null];
    }

    let swappedItems: StashItem[] = [];
    if (maxCategory === ItemCategory.Helmet) {
      swappedItems.push(fullRecipeSet.helmet!);
      fullRecipeSet.helmet = chaosItems[maxCategory].pop();
    } else if (maxCategory === ItemCategory.Belt) {
      swappedItems.push(fullRecipeSet.belt!);
      fullRecipeSet.belt = chaosItems[maxCategory].pop();
    } else if (maxCategory === ItemCategory.Armor) {
      swappedItems.push(fullRecipeSet.armor!);
      fullRecipeSet.armor = chaosItems[maxCategory].pop();
    } else if (maxCategory === ItemCategory.Gloves) {
      swappedItems.push(fullRecipeSet.gloves!);
      fullRecipeSet.gloves = chaosItems[maxCategory].pop();
    } else if (maxCategory === ItemCategory.Boots) {
      swappedItems.push(fullRecipeSet.boots!);
      fullRecipeSet.boots = chaosItems[maxCategory].pop();
    } else if (maxCategory === ItemCategory.Amulet) {
      swappedItems.push(fullRecipeSet.amulet!);
      fullRecipeSet.amulet = chaosItems[maxCategory].pop();
    } else if (maxCategory === ItemCategory.Ring) {
      swappedItems.push(fullRecipeSet.ringA!);
      fullRecipeSet.ringA = chaosItems[maxCategory].pop();
    } else if (maxCategory === ItemCategory.TwoHandedWeapon) {
      // The weapon logic is fairly convoluted because a 2H weapon can replace two 1H, and vice-versa
      if (fullRecipeSet.twoHandedWeapon) {
        swappedItems.push(fullRecipeSet.twoHandedWeapon);
        fullRecipeSet.twoHandedWeapon = chaosItems[maxCategory].pop();
      } else {
        swappedItems.push(fullRecipeSet.oneHandedWeaponA!);
        swappedItems.push(fullRecipeSet.oneHandedWeaponB!);
        fullRecipeSet.oneHandedWeaponA = undefined;
        fullRecipeSet.oneHandedWeaponB = undefined;
        fullRecipeSet.twoHandedWeapon = chaosItems[maxCategory].pop();
      }
    } else if (maxCategory === ItemCategory.OneHandedWeapon) {
      if (fullRecipeSet.oneHandedWeaponA) {
        swappedItems.push(fullRecipeSet.oneHandedWeaponA);
        fullRecipeSet.oneHandedWeaponA = chaosItems[maxCategory].pop();
      } else if (chaosItems[maxCategory].length <= 1) {
        // we can't make the swap
      } else {
        swappedItems.push(fullRecipeSet.twoHandedWeapon!);
        fullRecipeSet.twoHandedWeapon = undefined;
        fullRecipeSet.oneHandedWeaponA = chaosItems[maxCategory].pop();
        fullRecipeSet.oneHandedWeaponB = chaosItems[maxCategory].pop();
      }
    }

    if (swappedItems.length == 0) {
      return [null, null];
    }

    return [fullRecipeSet, swappedItems];
  }

  // Append a partialrecipe with chaosItems. The resulting recipe set will potentially fail if not enough chaos items remain
  // NOTE: This will mutate the passed in chaosItems
  _fillMissingWithChaosItems(
    partialRecipeSet: RecipeSet,
    chaosItems: GroupedStashItems
  ): RecipeSet {
    const deterministicProperties: RecipeSetKeys[] = [
      "helmet",
      "belt",
      "armor",
      "gloves",
      "boots",
      "ringA",
      "ringB",
      "amulet",
    ];
    for (let deterministicProperty of deterministicProperties) {
      console.log("Chaos items here is");
      console.log(this._propertyNameToItemCategory(deterministicProperty));
      console.log(
        chaosItems[this._propertyNameToItemCategory(deterministicProperty)!]
      );
      console.log(chaosItems["BELT"]);
      if (
        !chaosItems[this._propertyNameToItemCategory(deterministicProperty)!]
      ) {
        console.log(
          `no match for ${this._propertyNameToItemCategory(
            deterministicProperty
          )!} and property ${deterministicProperty}`
        );
      }
      partialRecipeSet[deterministicProperty] = chaosItems[
        this._propertyNameToItemCategory(deterministicProperty)!
      ].pop();
    }

    // Weapons are always fun.
    // TODO: We need to refactor out the above logic
    if (
      partialRecipeSet.twoHandedWeapon ||
      (partialRecipeSet.oneHandedWeaponA && partialRecipeSet.oneHandedWeaponB)
    ) {
      // Do nothing. We have both weapons
    } else if (
      !partialRecipeSet.twoHandedWeapon &&
      !partialRecipeSet.oneHandedWeaponA &&
      !partialRecipeSet.oneHandedWeaponB
    ) {
      // No weapons are there
      if (chaosItems.TWO_HANDED_WEAPON.length > 0) {
        partialRecipeSet.twoHandedWeapon = chaosItems.TWO_HANDED_WEAPON.pop();
      } else {
        partialRecipeSet.oneHandedWeaponA = chaosItems.ONE_HANDED_WEAPON.pop();
        partialRecipeSet.oneHandedWeaponB = chaosItems.ONE_HANDED_WEAPON.pop();
      }
    } else {
      // We know it doesn't have a two handed weapon, but must have a one-handed weapon
      if (!partialRecipeSet.oneHandedWeaponA) {
        partialRecipeSet.oneHandedWeaponA = chaosItems.ONE_HANDED_WEAPON.pop();
      }
      if (!partialRecipeSet.oneHandedWeaponB) {
        partialRecipeSet.oneHandedWeaponB = chaosItems.ONE_HANDED_WEAPON.pop();
      }

      if (
        !partialRecipeSet.oneHandedWeaponA ||
        !partialRecipeSet.oneHandedWeaponB
      ) {
        // If we hit this case, we dont have enough chas items to fall back
        if (partialRecipeSet.oneHandedWeaponA) {
          chaosItems.ONE_HANDED_WEAPON.push(partialRecipeSet.oneHandedWeaponA);
          partialRecipeSet.oneHandedWeaponA = undefined;
        }
        if (partialRecipeSet.oneHandedWeaponB) {
          chaosItems.ONE_HANDED_WEAPON.push(partialRecipeSet.oneHandedWeaponB);
          partialRecipeSet.oneHandedWeaponB = undefined;
        }
        partialRecipeSet.oneHandedWeaponA = undefined;
        partialRecipeSet.oneHandedWeaponB = undefined;
        partialRecipeSet.twoHandedWeapon = chaosItems.TWO_HANDED_WEAPON.pop();
      }
    }
    return partialRecipeSet;
  }

  // TODO: Should this do chaos or regal validation?
  _isRecipeSetComplete(recipeSet: RecipeSet) {
    let requiredSimpleItems =
      recipeSet.helmet &&
      recipeSet.belt &&
      recipeSet.armor &&
      recipeSet.gloves &&
      recipeSet.boots &&
      recipeSet.ringA &&
      recipeSet.ringB &&
      recipeSet.amulet;

    let hasTwoHandedWeapon =
      recipeSet.twoHandedWeapon &&
      !(recipeSet.oneHandedWeaponA || recipeSet.oneHandedWeaponB);
    let hasOneHandedWeapons =
      !recipeSet.twoHandedWeapon &&
      recipeSet.oneHandedWeaponA &&
      recipeSet.oneHandedWeaponB;
    let weaponIsValid = hasTwoHandedWeapon || hasOneHandedWeapons;
    return requiredSimpleItems && weaponIsValid;
  }

  _itemCategoryToPropertyName(
    itemCategory: ItemCategory
  ): RecipeSetKeys | undefined {
    switch (itemCategory) {
      case ItemCategory.Helmet: {
        return "helmet";
      }
      case ItemCategory.Belt: {
        return "belt";
      }
      case ItemCategory.Armor: {
        return "armor";
      }
      case ItemCategory.Gloves: {
        return "gloves";
      }
      case ItemCategory.Boots: {
        return "boots";
      }
      case ItemCategory.Amulet: {
        return "amulet";
      }
      case ItemCategory.TwoHandedWeapon: {
        return "twoHandedWeapon";
      }
    }
    // Ring and one handed weapon is not supportable
    return;
  }

  _propertyNameToItemCategory(propertyName: RecipeSetKeys) {
    switch (propertyName) {
      case "helmet": {
        return ItemCategory.Helmet;
      }
      case "belt": {
        return ItemCategory.Belt;
      }
      case "gloves": {
        return ItemCategory.Gloves;
      }
      case "boots": {
        return ItemCategory.Boots;
      }
      case "oneHandedWeaponA": {
        return ItemCategory.OneHandedWeapon;
      }
      case "oneHandedWeaponB": {
        return ItemCategory.OneHandedWeapon;
      }
      case "twoHandedWeapon": {
        return ItemCategory.TwoHandedWeapon;
      }
      case "ringA": {
        return ItemCategory.Ring;
      }
      case "ringB": {
        return ItemCategory.Ring;
      }
      case "amulet": {
        return ItemCategory.Amulet;
      }
      case "armor": {
        return ItemCategory.Armor;
      }
    }
  }
}
