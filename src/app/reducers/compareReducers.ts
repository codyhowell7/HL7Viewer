import { Map } from 'immutable';

import { IAction, IToggleMessageOnCompareList } from '../actions/actions';
import { DEFAULT_STATE, SAVE_COMPARE } from '../constants/constants';

export function reduceMessagesToCompare(state: Map<number, number>, action: IAction) {
    switch(action.type) {
        case SAVE_COMPARE:
            return saveCompare(state, action as IToggleMessageOnCompareList);
        case DEFAULT_STATE:
            return defaultCompareState(state, action as IToggleMessageOnCompareList);
        default:
            return state;
    }
}

function defaultCompareState(state: Map<number, number>, action: IToggleMessageOnCompareList): Map<number, number> {
    return Map<number, number>();
}

function saveCompare(state: Map<number, number>, action: IToggleMessageOnCompareList): Map<number, number> {
    return state = action.payload.localCompare;
}


