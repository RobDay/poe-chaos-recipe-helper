import {
  ItemType,
  ItemCategory,
  StashItem,
  StashAPIContentItem,
  StashAPIResponse,
} from "../../shared/models";
import log from "electron-log";

const BELT_REGEX: RegExp = /Chain Belt|Rustic Sash|Stygian Vise|Heavy Belt|Leather Belt|Cloth Belt|Studded Belt|Vanguard Belt|Crystal Belt/;
const RING_REGEX = / Ring$/;
const AMULET_REGEX = / Amulet$/;
const GLOVE_REGEX = / Gauntlets$| Gloves$| Mitts$/;
const BOOTS_REGEX = / Greaves$| Boots$| Shoes$| Slippers$/;
const CHEST_REGEX = / Vest$| Chestplate$| Plate$| Jerkin$| Tunic$| Leather$| Garb$| Robe$| Vestment$| Regalia$| Wrap$| Silks$| Brigandine$| Doublet$| Full Sale Armour$| Lamellar$| Wyrmscale$| Dragonscale$| Coat$| Ringmail$| Chainmail$| Hauberk$| Jacket$| Raiment$| Armour$/;
const HAT_REGEX = / Hat$| Helmet$| Burgonet$| Cap$| Pelt$| Hood$| Tricorne$| Circlet$| Cage$| Helm$| Sallet$| Bascinet$| Coif$| Crown$| Mask$/;
const JEWEL_REGEX = /Jewel/;
const SPLINTER_REGEX = / Splinter$/;

// TODO: There are so many more, but we just need the equipable inventory items

const BOW_REGEX = /Bow$/;
const TWO_HANDED_REGEX = new RegExp(
  "" +
    /|Bow$/.source + //Bows
    /| Branch$| Staff$|Quarterstaff$|Lathi$/.source + //Staves
    /|Woodsplitter|Poleaxe| Chopper|Labrys/.source + //Axes
    /| Maul$|Mallet|Sledgehammer| Star$|Steelhead|Piledriver|Meatgrinder/
      .source + // Maces
    /|Longsword$| Greatsword$/.source //Swords
);

const WEAPON_REGEX = new RegExp(
  "" +
    /Fist$| Claw$| Paw$|Blinder$|Gouger$| Ripper$| Stabber$| Awl$|Fleshripper$/
      .source + // claws
    /|Shank$| Knife$| Stiletto$| Dagger$| Poignard$| Trisula$| Ambusher$| Sai$| Kris$|Skean$| Blade$/
      .source + //Daggers
    /| Hatchet$| Axe$| Cleaver$|Tomahawk$| Splitter$/.source + //Axes
    /| Club$| Hammer$| Mace$| Breaker$|Tenderizer$|Gavel$|Pernach$/.source + //Maces
    /| Sceptre$| Fetish$| Sekhem$/.source + //Sceptres
    /| Sword$|Sabre$| Blade$|Cutlass$|Baselard$|Grappler$|Gladius$|Hook$/
      .source + //Swords
    /| Spike$| Rapier$| Foil$|Smallsword$|Estoc$|Pecoraro$/.source + //Thursting one handed swords
    /|Wand$| Horn$/.source + //Wands
    /| Shield$/.source + // Shields
    TWO_HANDED_REGEX.source
);

// This supports everything but weapons
const REGEX_TO_CATEGORY = new Map([
  [BELT_REGEX, ItemCategory.Belt],
  [AMULET_REGEX, ItemCategory.Amulet],
  [GLOVE_REGEX, ItemCategory.Gloves],
  [BOOTS_REGEX, ItemCategory.Boots],
  [CHEST_REGEX, ItemCategory.Armor],
  [HAT_REGEX, ItemCategory.Helmet],
  [RING_REGEX, ItemCategory.Ring],
  // [JEWEL_REGEX, ItemCategory.Jewel],
  // [SPLINTER_REGEX, ItemCategory.Splinter]
]);

export default function adaptStashAPIResponse(
  response: StashAPIResponse
): StashItem[] {
  log.info("response is");
  //   log.info(JSON.stringify(response));
  return response.items.map((responseItem) => {
    return {
      x: responseItem.x,
      y: responseItem.y,
      width: responseItem.w,
      height: responseItem.h,
      ilvl: responseItem.ilvl,
      name: `${responseItem.name} ${responseItem.typeLine}`,
      category: typelineToItemCategory(
        responseItem.typeLine,
        responseItem.w,
        responseItem.h
      ),
      type: frameTypeToItemType(responseItem.frameType),
      identified: responseItem.identified,
      id: responseItem.id,
    };
  });
}

// log.info(/^([a-z0-9]{5,})$/.test('abc1'));
function typelineToItemCategory(
  typeLine: string,
  width: number,
  height: number
): ItemCategory {
  // Regexes which are mutually exclusive
  let deterministicRegexes = Array.from(REGEX_TO_CATEGORY.keys());
  for (let regex of deterministicRegexes) {
    if (regex.test(typeLine)) {
      return REGEX_TO_CATEGORY.get(regex) || ItemCategory.Unknown;
    }
  }

  // If we didn't hit the deterministic case, it's probably a weapon
  if (WEAPON_REGEX.test(typeLine) === true) {
    // 2x3 are one handed unless they are bows
    // 2x4 are always 2h
    // 1x3 are always 1h
    // log.info(`${typeLine} is a one handed weapon`);
    if (width === 2 && height === 4) {
      return ItemCategory.TwoHandedWeapon;
    } else if (width === 1) {
      return ItemCategory.OneHandedWeapon;
    } else if (width === 2 && height === 3 && BOW_REGEX.test(typeLine)) {
      return ItemCategory.TwoHandedWeapon;
    }
    return ItemCategory.OneHandedWeapon;
  }

  if (width !== 1 && height !== 1) {
    log.info(`No known item category for typeLine: ${typeLine}`);
  }
  return ItemCategory.Unknown;
}

function frameTypeToItemType(frameType: number): ItemType {
  return frameType;
}
