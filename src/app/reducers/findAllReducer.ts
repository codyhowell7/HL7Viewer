import { Map, List } from 'immutable';
import { IAction, ISaveFindAll, ISaveFindAllUnique } from '../actions/actions';
import { DEFAULT_STATE, RESET_STATE, SAVE_FIND_ALL, SAVE_FIND_ALL_UNIQUE } from '../constants/constants';
import { IFindAll, IUniqueFindAll } from '../states/states';

export function reduceFindAll(state: IFindAll, action: IAction) {
    switch (action.type) {
        case SAVE_FIND_ALL:
            return saveFindAll(action as ISaveFindAll);
        case DEFAULT_STATE:
            if (state != null) {
                return state;
            }
            return defaultFindAll();
        case RESET_STATE:
            return defaultFindAll();
        default:
            return state;
    }
}

function defaultFindAll() {
    return {
        findAllResults: List<[number, string]>(),
        uniqueSearch: 'false',
        searchValue: ''
    };
}

function saveFindAll(action: ISaveFindAll): IFindAll {
    return {
        findAllResults: action.payload.FindAllSearch,
        uniqueSearch: action.payload.uniqueSearch,
        searchValue: action.payload.searchValue
    };
}

export function reduceFindAllUnique(state: IUniqueFindAll, action: IAction) {
    switch (action.type) {
        case SAVE_FIND_ALL_UNIQUE:
            return saveFindAllUnique(action as ISaveFindAllUnique);
        case DEFAULT_STATE:
            if (state != null) {
                return state;
            }
            return defaultFindAllUnique();
        case RESET_STATE:
            return defaultFindAllUnique();
        default:
            return state;
    }
}

function defaultFindAllUnique() {
    return {
        findAllResults: Map<string, number>()
    };
}

function saveFindAllUnique(action: ISaveFindAllUnique): IUniqueFindAll {
    return {
        findAllResults: action.payload.FindAllSearchUnique
    };
}
