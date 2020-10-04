import { stat } from 'fs';
import RecipeManager from '../recipe-manager'
import { getValidResponseAdapted} from './mocks/gets-stashes-response'

describe("test recipe manager", () => {
    it('should generate item statistics properly', () => {
        const adaptedValue = getValidResponseAdapted();
        let recipeManager = new RecipeManager(adaptedValue);
        let statistics = recipeManager.generateItemStatistics();
        console.log(statistics);
        expect(statistics).toEqual({
            HELMET: 1,
            BELT: 3,
            ARMOR: 0,
            GLOVES: 0,
            BOOTS: 2,
            ONE_HANDED_WEAPON: 0,
            TWO_HANDED_WEAPON: 0,
            RING: 8,
            AMULET: 5
          });
    });
})