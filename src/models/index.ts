export enum ItemCategory {
    Helmet = "HELMET",
    Belt = "BELT",
    Armor = "ARMOR",
    OneHandedWeapon = "ONE_HANDED_WEAPON",
    TwoHandedWeapon = "TWO_HANDED_WEAPON",
    Ring = "RING",
    Amulet = "Amulet"
}

export enum ItemType  {
    Normal,
    Magic,
    Rare,
    Unique,
    Gem,
    Currency,
    DivinationCard,
    QuestItem,
    Prophecy,
    Relic
}

export type StashItem = {
    type: ItemType;
    category: ItemCategory
    name: string;
    x: number;
    y: number;
    ilvl: number;
    width: number;
    height: number;
    itemType: string
}

export type StashAPIContentItem = {
    w: number;
    h: number;
    name: string;
    x: number;
    y: number;
    typeLine: string;
    frameType: number;
    inventoryId: string;
}

export type StashAPIResponse = {
    numTabs: number;
    quadTab: boolean;
    items: StashAPIContentItem[];
}