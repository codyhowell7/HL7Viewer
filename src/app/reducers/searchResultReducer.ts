import { Map } from 'immutable';
import { IAction, IAddSearchResults, IRemoveMessageAction } from '../actions/actions';
import {
    DEFAULT_STATE, NEW_SEARCH_RESULT, NEW_SEARCH_MESSAGE, REMOVE_SEARCH_FILTER,
    REMOVE_MESSAGE_FROM_FILTER, RESET_STATE
} from '../constants/constants';

export function reduceSearchResults(state: Map<number, boolean>, action: IAction): Map<number, boolean> {
    switch (action.type) {
        case NEW_SEARCH_RESULT:
            return newSearchResult(state, action as IAddSearchResults);
        case NEW_SEARCH_MESSAGE:
            return defaultNewMessage(state);
        case REMOVE_SEARCH_FILTER:
            return removeSearchResult(state);
        case REMOVE_MESSAGE_FROM_FILTER:
            return removeMessageFromFilter(state, action as IRemoveMessageAction);
        case DEFAULT_STATE:
            if (state != null) {
                return state;
            }
            return defaultSearchResult(state);
        case RESET_STATE:
            return defaultSearchResult(state);
        default:
            return state;
    }
}
function defaultSearchResult(state) {
    return Map<number, boolean>().set(0, true);
}

function defaultNewMessage(state: Map<number, boolean>) {
    return state.set(state.size, true);
}

function newSearchResult(state: Map<number, boolean>, action: IAddSearchResults) {
    return state = action.payload.messageFilterMap;
}
function removeSearchResult(state: Map<number, boolean>) {
    let newState = Map<number, boolean>().set(0, true);
    state.keySeq().forEach(id => newState = newState.set(id, true));
    return newState;
}
function removeMessageFromFilter(state: Map<number, boolean>, action: IRemoveMessageAction) {
    let newState = state.delete(action.payload.id);
    return newState;
}
