import { ItemCategory } from "../../../shared/models";

export const CATEGORY_COLORS = {
  [ItemCategory.Helmet]: "#7a2817",
  [ItemCategory.Belt]: "#8c1911",
  [ItemCategory.Armor]: "#a86223",
  //   [ItemCategory.Gloves]: "#EAC251",
  [ItemCategory.Boots]: "#48742C",
  [ItemCategory.Ring]: "#254E5A",
  [ItemCategory.OneHandedWeapon]: "#2358C5",
  [ItemCategory.TwoHandedWeapon]: "#22538F",
  [ItemCategory.Amulet]: "#312170",
  [ItemCategory.Gloves]: "#6B2346",
  [ItemCategory.Unknown]: "white",
};

export const BACKGROUND_COLOR = "#2F3646";

export enum WindowID {
  Overlay = 2,
  Main = 1,
}
