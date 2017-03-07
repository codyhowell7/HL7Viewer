import { IMenuState } from '../states/states';
import { IAction } from '../actions/actions';
import { DEFAULT_STATE} from '../constants/constants';

export function reduceMenu(state: IMenuState, action: IAction): IMenuState {

    switch (action.type) {
        case DEFAULT_STATE:
            return getMenuDefaultState();
        default:
            return state;
    }
}

function getMenuDefaultState(): IMenuState {

    return {};
}