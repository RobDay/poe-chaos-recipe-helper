import React from 'react';

import {ItemCategory} from '../../models/index'
import ItemCountCell from './item-count-cell'

type PropsType  = {
    itemCounts: {
        [ItemCategory.Helmet]: number,
        [ItemCategory.Belt]: number,
        [ItemCategory.Armor]: number,
        [ItemCategory.Gloves]: number,
        [ItemCategory.Boots]: number,
        [ItemCategory.OneHandedWeapon]: number,
        [ItemCategory.TwoHandedWeapon]: number,
        [ItemCategory.Ring]: number,
        [ItemCategory.Amulet]: number
    }
    
}

export default function ItemCount(props: PropsType) {

    return (
        <div>
            {JSON.stringify(props)}
        </div>
    )
}