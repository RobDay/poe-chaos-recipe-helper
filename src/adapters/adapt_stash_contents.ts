 import type { ItemType, StashItem, StashAPIContentItem, StashAPIResponse } from "../models/index";
import { ItemCategory } from "../models/index";

const BELT_REGEX: RegExp = /Chain Belt|Rustic Sash|Stygian Vise|Heavy Belt|Leather Belt|Cloth Belt|Studded Belt|Vanguard Belt|Crystal Belt/;
const RING_REGEX = / Ring$/
const AMULET_REGEX = / Amulet$/
const GLOVE_REGEX = / Gauntlets$| Gloves$| Mitts$/
const BOOTS_REGEX = / Greaves$| Boots$| Shoes$| Slippers$/
const CHEST_REGEX = / Vest$| Chestplate$| Plate$| Jerkin$| Tunic$| Leather$| Garb$| Robe$| Vestment$| Regalia$| Wrap$| Silks$| Brigandine$| Doublet$| Full Sale Armour$| Lamellar$| Wyrmscale$| Dragonscale$| Coat$| Ringmail$| Chainmail$| Hauberk$| Jacket$| Raiment$| Armour$/
const HAT_REGEX = / Hat$| Helmet$| Burgonet$| Cap$| Pelt$| Hood$| Tricorne$| Circlet$| Cage$| Helm$| Sallet$| Bascinet$| Coif$| Crown$| Mask$/

const TWO_HANDED_REGEX = new RegExp(''
    + / Bow$/.source //Bows
    + / Branch$| Staff$|Quarterstaff$|Lathi$/.source //Staves
    + /Woodsplitter|Poleaxe| Chopper|Labrys/.source //Axes
    + / Maul$|Mallet|Sledgehammer| Star$|Steelhead|Piledriver|Meatgrinder/.source // Maces
    + /Longsword$| Greatsword$/.source //Swords
)

const WEAPON_REGEX = new RegExp(''
    + / Fist$| Claw$| Paw$|Blinder$|Gouger$| Ripper$| Stabber$| Awl$/.source // claws
    + /Shank$| Knife$| Stiletto$| Dagger$| Poignard$| Trisula$| Ambusher$| Sai$| Kris$|Skean$| Blade$/.source //Daggers
    + / Hatchet$| Axe$| Cleaver$|Tomahawk$| Splitter$/.source //Axes
    + / Club$| Hammer$| Mace$| Breaker$|Tenderizer$|Gavel$|Pernach$/.source //Maces
    + / Sceptre$| Fetish$| Sekhem$/.source //Sceptres
    + / Sword$|Sabre$| Blade$|Cutlass$|Baselard$|Grappler$|Gladius$|Hook$/.source //Swords
    + / Spike$| Rapier$| Foil$|Smallsword$|Estoc$|Pecoraro$/.source //Thursting one handed swords
    + /Wand$| Horn$/.source //Wands
    + TWO_HANDED_REGEX.source
)

// This supports everything but weapons
const REGEX_TO_CATEGORY = new Map([
    [BELT_REGEX, ItemCategory.Belt],
    [AMULET_REGEX, ItemCategory.Amulet],
    [GLOVE_REGEX, ItemCategory.Gloves],
    [BOOTS_REGEX, ItemCategory.Boots],
    [CHEST_REGEX, ItemCategory.Amulet],
    [HAT_REGEX, ItemCategory.Helmet],
    [RING_REGEX, ItemCategory.Ring]
])

export function adaptStashAPIResponse(response: StashAPIResponse): StashItem[] {
    

    return [];
}

// console.log(/^([a-z0-9]{5,})$/.test('abc1'));
function typelineToItemCategory(typeLine: string, width: number): ItemCategory {

    // Regexes which are mutually exclusive
    let deterministicRegexes = [BELT_REGEX, RING_REGEX, AMULET_REGEX, GLOVE_REGEX, BOOTS_REGEX, CHEST_REGEX, HAT_REGEX];
    for (let regex of deterministicRegexes) {
        if (regex.test(typeLine)) {
            return REGEX_TO_CATEGORY.get(regex) || ItemCategory.Unknown
        }
    }

    // If we didn't hit the deterministic case, it's probably a weapon
    if (WEAPON_REGEX.test(typeLine)) {
        if (width === 1) {
            return ItemCategory.OneHandedWeapon
        } else {
            return ItemCategory.TwoHandedWeapon
        }
    }


    console.log(`No known item category for typeLine: ${typeLine}`)
    return ItemCategory.Unknown
}