import { Map, List } from 'immutable';

import { IAction, IAddToCopy} from '../actions/actions';
import { ADD_TO_COPY_LIST, CLEAR_COPY_LIST, DEFAULT_STATE } from '../constants/constants';

export function reduceSelectCopy(state: Map<number, string>, action: IAction): Map<number, string> {
    switch (action.type) {
        case ADD_TO_COPY_LIST:
            return addToCopyList(state, action as IAddToCopy);
        case CLEAR_COPY_LIST:
            return clearCopyList();
        case DEFAULT_STATE:
            return clearCopyList();
        default:
            return state;
    }
}

function addToCopyList(state: Map<number, string>, action: IAddToCopy): Map<number, string> {
    return state = state.set(action.payload.messageId, action.payload.hl7Message);
}

function clearCopyList() {
    return Map<number, string>();
}
