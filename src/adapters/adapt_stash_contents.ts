import type { ItemType, StashItem, StashAPIContentItem, StashAPIResponse } from "../models/index";
import { ItemCategory } from "../models/index";

const BELT_REGEX: RegExp = /Chain Belt|Rustic Sash|Stygian Vise|Heavy Belt|Leather Belt|Cloth Belt|Studded Belt|Vanguard Belt|Crystal Belt/;
const RING_REGEX = / Ring$/
const AMULET_REGEX = / Amulet$/
const GLOVE_REGEX = / Gauntlets$| Gloves$| Mitts$/
const BOOTS_REGEX = / Greaves$| Boots$| Shoes$| Slippers$/
const CHEST_REGEX = / Vest$| Chestplate$| Plate$| Jerkin$| Tunic$| Leather$| Garb$| Robe$| Vestment$| Regalia$| Wrap$| Silks$| Brigandine$| Doublet$| Full Sale Armour$| Lamellar$| Wyrmscale$| Dragonscale$| Coat$| Ringmail$| Chainmail$| Hauberk$| Jacket$| Raiment$| Armour$/
const HAT_REGEX = / Hat$| Helmet$| Burgonet$| Cap$| Pelt$| Hood$| Tricorne$| Circlet$| Cage$| Helm$| Sallet$| Bascinet$| Coif$| Crown$| Mask$/


export function adaptStashAPIResponse(response: StashAPIResponse): StashItem[] {
    

    return [];
}

function typelineToItemCategory(typeLine: string): ItemCategory {
    return ItemCategory.Helmet;
}