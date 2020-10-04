
import type { ItemCategory, StashItem } from "./models/index";

type RecipeSet = {
    helmet?: StashItem;
    belt?: StashItem;
    armor?: StashItem;
    gloves?: StashItem;
    boots?: StashItem
    oneHandedWeaponA?: StashItem
    oneHandedWeaponB?: StashItem;
    twoHandedWeapon?: StashItem;
    ringA?: StashItem;
    ringB?: StashItem;
    amulet?: StashItem;
}

type GroupedStashItems = { [key: string]: StashItem[] };
export default class RecipeManager {
    items: StashItem[]

    constructor(items: StashItem[]) {
        this.items = items;
    }

    _generateItemStatistics(items: StashItem[]) {
        let initialState = {
            HELMET: 0,
            BELT: 0,
            ARMOR: 0,
            GLOVES: 0,
            BOOTS: 0,
            ONE_HANDED_WEAPON: 0,
            TWO_HANDED_WEAPON: 0,
            RING: 0,
            AMULET: 0
        }
        return items
        .filter((item) => {
            return item.ilvl >= 60
        }).reduce((result, item) => {
            result[item.category]+=1
            return result;
        }, initialState);
    }

    generateItemStatistics() {
        return this._generateItemStatistics(this.items);
    }

    // TODO: Need to handle if regal recipe is preferred, maybe?
    getChaosRecipes() {

        // TODO: Figure out consistent casing for this
        let regalLevelItems: GroupedStashItems = {
            HELMET: [],
            BELT: [],
            ARMOR: [],
            GLOVES: [],
            BOOTS: [],
            ONE_HANDED_WEAPON: [],
            TWO_HANDED_WEAPON: [],
            RING: [],
            AMULET: []
        }
        // TODO: Does this deep copy?
        let chaosLevelItems = {
            ...regalLevelItems
        }
        for (let item of this.items) {
            if (item.ilvl > 74) {
                regalLevelItems[item.category].push(item);
            } else {
                chaosLevelItems[item.category].push(item);
            }
        }

        let chaosRecipeItems: RecipeSet[] = []
        let regalRecipeItems: RecipeSet[] = []
        while (true)  {
            let recipeSet: RecipeSet = {}
            recipeSet.helmet = regalLevelItems.HELMET.pop()
            recipeSet.belt = regalLevelItems.BELT.pop()
            recipeSet.armor = regalLevelItems.ARMOR.pop()
            recipeSet.gloves = regalLevelItems.GLOVES.pop()
            recipeSet.boots = regalLevelItems.BOOTS.pop()
            recipeSet.ringA = regalLevelItems.RING.pop()
            recipeSet.ringB = regalLevelItems.RING.pop()
            recipeSet.amulet = regalLevelItems.AMULET.pop()
            recipeSet.twoHandedWeapon = regalLevelItems.TWO_HANDED_WEAPON.pop()
            if (!recipeSet.twoHandedWeapon) {
                recipeSet.oneHandedWeaponA = regalLevelItems.ONE_HANDED_WEAPON.pop()
                recipeSet.oneHandedWeaponB = regalLevelItems.ONE_HANDED_WEAPON.pop()
            }

            // TODO: Break this
            let finalRecipeSet;
            if (this._isRecipeSetComplete(recipeSet)) {
                let [newRecipeSet, removedItems] = this._replaceWithChaosItem(recipeSet, chaosLevelItems)
                if (removedItems) {
                    // Remove these items from being available in the regal list
                }
                finalRecipeSet = newRecipeSet;

                // TODO: Should our replace function mutate our regalRecipeItems? IDK. We will learn after implementing it
                
            } else {
                finalRecipeSet = this._fillMissingWithChaosItems(recipeSet, chaosLevelItems)
            }
            if (this._isRecipeSetComplete(finalRecipeSet)) {
                chaosRecipeItems.push(finalRecipeSet);
            } else {
                break;
            }
        }

        // TODO: If we bulid regal recipes here, we'd need to reserve the finalRecipe that wasn't complete and put them back onto the regal allowed list

    }

    // Swap an item with a chaos-level item. If no swap happens, return a null second param. It can potentially swap out two one-handed weaopns
    // NOTE: This will mutate the passed in chaosItems
    _replaceWithChaosItem(fullRecipeSet: RecipeSet, chaosItems: GroupedStashItems): [RecipeSet | null, StashItem[] | null] {
        // Using a heap would be better for this, but whatever;

        // TODO: Add a check to make sure the input is valid

        let maxCategory: ItemCategory | undefined;
        let maxItemCount = 0
        for (const [category, items] of Object.entries(chaosItems)) {
            if (items.length > maxItemCount) {
                maxCategory = category;
                maxItemCount = items.length;
            } else if (maxCategory === 'ONE_HANDED_WEAPON' && fullRecipeSet.twoHandedWeapon && items.length == maxItemCount) {
                // TODO: This is a special case that is really gross
                // Basically, we need to deprioritize using one handed weapons to swap out two handed weapons because we need two of them
                maxCategory = category;
            }
        }
        if (!maxCategory) {
            return [null, null];
        }

        let swappedItems: StashItem[] = []
        if (maxCategory === 'HELMET') {
            swappedItems.push(fullRecipeSet.helmet!);
            fullRecipeSet.helmet = chaosItems[maxCategory].pop();
        } else if (maxCategory === 'BELT') {
            swappedItems.push(fullRecipeSet.belt!);
            fullRecipeSet.belt = chaosItems[maxCategory].pop();
        } else if (maxCategory === 'ARMOR') {
            swappedItems.push(fullRecipeSet.armor!);
            fullRecipeSet.armor = chaosItems[maxCategory].pop();
        } else if (maxCategory === 'GLOVES') {
            swappedItems.push(fullRecipeSet.gloves!);
            fullRecipeSet.gloves = chaosItems[maxCategory].pop();
        } else if (maxCategory === 'BOOTS') {
            swappedItems.push(fullRecipeSet.boots!);
            fullRecipeSet.boots = chaosItems[maxCategory].pop();
        } else if (maxCategory === 'AMULET') {
            swappedItems.push(fullRecipeSet.amulet!);
            fullRecipeSet.amulet = chaosItems[maxCategory].pop();
        } else if (maxCategory === 'RING') {
            swappedItems.push(fullRecipeSet.ringA!);
            fullRecipeSet.ringA = chaosItems[maxCategory].pop();
        } else if (maxCategory === "TWO_HANDED_WEAPON") {
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
        } else if (maxCategory === "ONE_HANDED_WEAPON") {
            if (fullRecipeSet.oneHandedWeaponA) {
                swappedItems.push(fullRecipeSet.oneHandedWeaponA);
                fullRecipeSet.oneHandedWeaponA = chaosItems[maxCategory].pop();
            } else if (chaosItems[maxCategory].length <= 1) {
                    // we can't make the swap 
            } else {
                swappedItems.push(fullRecipeSet.twoHandedWeapon!)
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
    _fillMissingWithChaosItems(partialRecipeSet: RecipeSet, chaosItems: GroupedStashItems): RecipeSet {

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

        let hasTwoHandedWeapon = recipeSet.twoHandedWeapon && !(recipeSet.oneHandedWeaponA || recipeSet.oneHandedWeaponB)
        let hasOneHandedWeapons = !recipeSet.twoHandedWeapon && (recipeSet.oneHandedWeaponA && recipeSet.oneHandedWeaponB)
        let weaponIsValid = hasTwoHandedWeapon || hasOneHandedWeapons;
        return requiredSimpleItems && weaponIsValid;
    }
}