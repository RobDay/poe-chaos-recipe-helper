import { RecipeSet } from "../../recipe-manager";

export enum ItemCategory {
  Helmet = "HELMET",
  Belt = "BELT",
  Armor = "ARMOR",
  Gloves = "GLOVES",
  Boots = "BOOTS",
  OneHandedWeapon = "ONE_HANDED_WEAPON",
  TwoHandedWeapon = "TWO_HANDED_WEAPON",
  Ring = "RING",
  Amulet = "AMULET",
  // Jewel = "Jewel",
  // Splinter = "Splinter",
  Unknown = "Unknown",
}

export type ItemCategoryKeys = keyof ItemCategory;

// TODO: Add influence

export enum ItemType {
  Normal = 0,
  Magic = 1,
  Rare = 2,
  Unique = 3,
  Gem = 4,
  Currency = 5,
  DivinationCard = 6,
  QuestItem = 7,
  Prophecy = 8,
  Relic = 9,
}

export type StashItem = {
  type: ItemType;
  category: ItemCategory;
  name: string;
  x: number;
  y: number;
  ilvl: number;
  width: number;
  height: number;
  identified: boolean;
  id: string;
};

export type StashAPIContentItem = {
  w: number;
  h: number;
  name: string;
  x: number;
  y: number;
  typeLine: string;
  frameType: number;
  inventoryId: string;
  ilvl: number;
  identified: boolean;
  id: string;
};

export type StashAPIResponse = {
  numTabs: number;
  quadTab: boolean;
  items: StashAPIContentItem[];
};

export type RefreshStashPayload = {
  items: StashItem[];
};

export type ToggleInventoryPayload = {
  type: "Chaos" | "Regal";
};

export type WindowConfig = {
  resolutionX: number;
  resolutionY: number;
};

export type StashConfig = {
  tabIndex: number;
  quadTab: boolean;
  overlay: {
    offset: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
};

export type RecipeConfig = {
  preferRegal: boolean;
};
export type ItemLimitConfig = {
  default: number;
  ring?: number;
  amulet?: number;
  belt?: number;
  helmet?: number;
  armor?: number;
  oneHand?: number;
  twoHand?: number;
  boots?: number;
  gloves?: number;
};
export type FilterConfig = {
  location: string;
  itemLimit: ItemLimitConfig;
};

export type AccountConfig = {
  username: string;
  poeSessID: string;
  league: string;
};

export type Config = {
  window: WindowConfig;
  stash: StashConfig;
  recipe: RecipeSet;
  filter: FilterConfig;
  account: AccountConfig;
};