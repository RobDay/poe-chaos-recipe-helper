import fs from "fs";
import util from "util";
import log from "electron-log";
import { FilterPlaceholder } from "../shared/constants";
import { FilterConfig, ItemCategory } from "../shared/models";
import { StashItemCounts } from "../src/recipe-manager";

const REPLACEMENT_VISIBILITY_PREFACE = "SHOW_CHAOS_";
const FILTER_REPLACE_RANGE_REGEX = new RegExp(
  `(?<=#+[ \t]*${FilterPlaceholder.start}).*(?=#+[ \t]*${FilterPlaceholder.stop})`,
  "sgm"
);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const ALL_CATEGORY_KEYS = [
  ItemCategory.Helmet,
  ItemCategory.Boots,
  ItemCategory.Armor,
  ItemCategory.Gloves,
  ItemCategory.Belt,
  ItemCategory.OneHandedWeapon,
  ItemCategory.TwoHandedWeapon,
  ItemCategory.Ring,
  ItemCategory.Amulet,
];
export default class FilterUpdater {
  private partialFilter: string | undefined;
  private lastCategoryIsVisibleMap = new Map<ItemCategory, boolean>();
  readonly pathToPartialFilter: string;
  readonly filterConfig: FilterConfig;

  constructor(pathToPartialFilter: string, filterConfig: FilterConfig) {
    this.filterConfig = filterConfig;
    this.pathToPartialFilter = pathToPartialFilter;
  }

  load = async () => {
    if (!this.partialFilter) {
      const partialFromFile = await readFile(this.pathToPartialFilter);
      this.partialFilter = String(partialFromFile);
    }
  };

  updateWithItemCounts = async (itemCounts: StashItemCounts) => {
    const newCategoryStateMap = this.buildCategoryStateMap(itemCounts);
    if (FilterUpdater.areMapsEqual(this.lastCategoryIsVisibleMap, newCategoryStateMap)) {
      log.info("Not updating the filter as no thresholds have changed");
      return;
    }
    return await this.updateFilterWithState(newCategoryStateMap);
  };

  private async updateFilterWithState(categoryStateMap: Map<ItemCategory, boolean>) {
    if (!this.partialFilter) {
      throw "You must first load the filter-updater";
    }
    this.lastCategoryIsVisibleMap = categoryStateMap;
    // Copy the constant
    let partialFilter = this.partialFilter;
    for (const category of ALL_CATEGORY_KEYS) {
      if (category === ItemCategory.Unknown) {
        // This shouldn't be needed as Unknown isn't in the above list, but TS doesn't realize this
        continue;
      }
      const replacementString = FilterUpdater.getReplacementVisibilityString(category);
      const shouldShow = categoryStateMap.get(category);
      partialFilter = partialFilter.replace(replacementString, shouldShow ? "Show" : "Hide");
    }

    await this.replaceTextInFilter(partialFilter + "\n");
    log.info(`Replaced items in the config`);
  }

  private async replaceTextInFilter(text: string) {
    let filterContents = String(await readFile(this.filterConfig.location));
    filterContents = filterContents.replace(FILTER_REPLACE_RANGE_REGEX, text);
    await writeFile(this.filterConfig.location, filterContents);
  }

  private buildCategoryStateMap(itemCounts: StashItemCounts) {
    let result = new Map<ItemCategory, boolean>();

    for (const category of ALL_CATEGORY_KEYS) {
      if (category === ItemCategory.Unknown) {
        // This shouldn't be needed as Unknown isn't in the above list, but TS doesn't realize this
        continue;
      }
      const limit = this.filterConfig.itemLimit[category] || this.filterConfig.itemLimit.default;
      result.set(category, itemCounts[category] < limit);
    }

    return result;
  }

  static areMapsEqual(map1: Map<string, any>, map2: Map<string, any>) {
    var testVal;
    if (map1.size !== map2.size) {
      return false;
    }
    // @ts-ignore
    for (const [key, val] of map1) {
      testVal = map2.get(key);
      // in cases of an undefined value, make sure the key
      // actually exists on the object so there are no false positives
      if (testVal !== val || (testVal === undefined && !map2.has(key))) {
        return false;
      }
    }
    return true;
  }

  static getReplacementVisibilityString(itemCategory: ItemCategory) {
    //TODO: This can just be a loop
    switch (itemCategory) {
      case ItemCategory.Amulet: {
        return `${REPLACEMENT_VISIBILITY_PREFACE}AMULET`;
      }
      case ItemCategory.Armor: {
        return `${REPLACEMENT_VISIBILITY_PREFACE}ARMOR`;
      }
      case ItemCategory.Belt: {
        return `${REPLACEMENT_VISIBILITY_PREFACE}BELT`;
      }
      case ItemCategory.Boots: {
        return `${REPLACEMENT_VISIBILITY_PREFACE}BOOTS`;
      }
      case ItemCategory.Gloves: {
        return `${REPLACEMENT_VISIBILITY_PREFACE}GLOVES`;
      }
      case ItemCategory.Helmet: {
        return `${REPLACEMENT_VISIBILITY_PREFACE}HELMET`;
      }
      case ItemCategory.OneHandedWeapon: {
        return `${REPLACEMENT_VISIBILITY_PREFACE}ONE_HANDED_WEAPON`;
      }
      case ItemCategory.TwoHandedWeapon: {
        return `${REPLACEMENT_VISIBILITY_PREFACE}TWO_HANDED_WEAPON`;
      }
      case ItemCategory.Ring: {
        return `${REPLACEMENT_VISIBILITY_PREFACE}RING`;
      }
      default: {
        return "";
      }
    }
  }
}
