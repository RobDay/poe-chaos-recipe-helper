
import type { ItemCategory, StashItem } from "./models/index";
export default class RecipeManager {
    items: StashItem[]

    constructor(items: StashItem[]) {
        this.items = items;
    }

    generateItemStatistics() {
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
        return this.items.reduce((result, item) => {
            result[item.category]+=1
            return result;
        }, initialState);
    }
}