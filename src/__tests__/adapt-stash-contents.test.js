import adaptStashAPIResponse from '../adapters/adapt-stash-contents'
import { getValidResponse , getValidResponseAdapted} from './mocks/gets-stashes-response'

describe('adapt stash contents', () => {
    test('renders without crashing', () => {
        let result = adaptStashAPIResponse(getValidResponse());
        console.log(result);
        expect(result).toEqual(getValidResponseAdapted());
     });
})
