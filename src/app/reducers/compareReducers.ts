import { Map } from 'immutable';

import { IAction, ISaveLeftCompareArea, ISaveRightCompareArea } from '../actions/actions';
import { DEFAULT_STATE, SAVE_LEFT, SAVE_RIGHT } from '../constants/constants';

export function reduceMessagesToCompare(state: Map<number, number>, action: IAction) {
    switch (action.type) {
        case SAVE_LEFT:
            return saveLeft(state, action as ISaveLeftCompareArea);
        case SAVE_RIGHT:
            return saveRight(state, action as ISaveRightCompareArea);
        case DEFAULT_STATE:
            if (state != null) {
                return state;
            }
            return defaultCompareState();
        default:
            return state;
    }
}

function defaultCompareState(): Map<number, number> {
    return Map<number, number>();
}

function saveLeft(state: Map<number, number>, action: ISaveLeftCompareArea): Map<number, number> {
    return state = state.set(0, action.payload.leftArea);
}

function saveRight(state: Map<number, number>, action: ISaveRightCompareArea): Map<number, number> {
    return state = state.set(1, action.payload.rightArea);
}


