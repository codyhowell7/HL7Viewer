import { Map } from 'immutable';
import { IAction, IAddSearchResults, IRemoveMessageAction, ICreateSearchBySize } from '../actions/actions';
import {
    DEFAULT_STATE, NEW_SEARCH_RESULT, NEW_SEARCH_MESSAGE, REMOVE_SEARCH_FILTER,
    REMOVE_MESSAGE_FROM_FILTER, RESET_STATE, CREATE_DEAFULT_SEARCH_BY_SIZE
} from '../constants/constants';
import { ISearchFilter } from '../states/states'

export function reduceSearchResults(state: Map<number, ISearchFilter>, action: IAction): Map<number, ISearchFilter> {
    switch (action.type) {
        case NEW_SEARCH_RESULT:
            return newSearchResult(state, action as IAddSearchResults);
        case NEW_SEARCH_MESSAGE:
            return defaultNewMessage(state);
        case REMOVE_SEARCH_FILTER:
            return removeSearchResult(state);
        case REMOVE_MESSAGE_FROM_FILTER:
            return removeMessageFromFilter(state, action as IRemoveMessageAction);
        case CREATE_DEAFULT_SEARCH_BY_SIZE:
            return createDefaultSearchBySize(action as ICreateSearchBySize);
        case DEFAULT_STATE:
            if (state != null) {
                return state;
            }
            return defaultSearchResult();
        case RESET_STATE:
            return defaultSearchResult();
        default:
            return state;
    }
}
function defaultSearchResult() {
    return Map<number, ISearchFilter>().set(0, {
        includedInMess: true,
        searchConditions: [],
        searchTerm: ''
    });
}

function createDefaultSearchBySize(action: ICreateSearchBySize) {
    let createSearchResults = Map<number, ISearchFilter>().set(0, {
        includedInMess: true,
        searchConditions: [],
        searchTerm: ''
    });
    for (let i = 0; i <= action.payload.messageSize; i++) {
        createSearchResults = createSearchResults.set(i, {
            includedInMess: true,
            searchConditions: [],
            searchTerm: ''
        });
    }
    return createSearchResults;
}

function defaultNewMessage(state: Map<number, ISearchFilter>) {
    return state.set(state.size, {
        includedInMess: true,
        searchConditions: [],
        searchTerm: ''
    });
}

function newSearchResult(state: Map<number, ISearchFilter>, action: IAddSearchResults) {
    return state = action.payload.messageFilterMap;
}
function removeSearchResult(state: Map<number, ISearchFilter>) {
    let newState = Map<number, ISearchFilter>().set(0, {
        includedInMess: true,
        searchConditions: [],
        searchTerm: ''
    });
    state.keySeq().forEach(id => newState = newState.set(id, {
        includedInMess: true,
        searchConditions: [],
        searchTerm: ''
    }));
    return newState;
}
function removeMessageFromFilter(state: Map<number, ISearchFilter>, action: IRemoveMessageAction) {
    let newState = state.delete(action.payload.id);
    return newState;
}
