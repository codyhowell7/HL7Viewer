import { Map } from 'immutable';
import { IConditionGroup, ICondition, ISearchConditions } from '../states/states';
import { IAction, IAddConditionGroup, IAddSearchResults } from '../actions/actions';
import { DEFAULT_STATE, ADD_SEARCH_CONDITION, ADD_CONDITION_SIZE, ADD_GROUP_SIZE, SAVE_SEARCH } from '../constants/constants';

export function reduceSearchCondition(state: ISearchConditions, action: IAction): ISearchConditions {
    switch (action.type) {
        case SAVE_SEARCH:
            return saveSearch(state, action as IAddSearchResults);
        default:
            return state;
    }
}

function saveSearch(state: ISearchConditions, action: IAddSearchResults) {
    return action.payload.search;
}


export function reduceSearchConditionSize(state: Map<number, number>, action: IAction): Map<number, number> {
    switch (action.type) {
        case ADD_CONDITION_SIZE:
            return addConditionSize(state);
        case ADD_GROUP_SIZE:
            return addGroupSize(state);
        case DEFAULT_STATE:
            if (state != null) {
                return state;
            }
            return defaultSearchSize(state);
        default:
            return state;
    }
}

function defaultSearchSize(state: Map<number, number>): Map<number, number> {
    return Map<number, number>().set(0, 0);
}

function addConditionSize(state: Map<number, number>): Map<number, number> {
    return state.set(state.keySeq().max(), state.valueSeq().max() + 1);
}

function addGroupSize(state: Map<number, number>): Map<number, number> {
    return state.set(state.keySeq().max() + 1, state.valueSeq().max() + 1);
}