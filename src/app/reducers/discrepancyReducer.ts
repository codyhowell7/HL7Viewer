import { Map } from 'immutable';
import { IAction, ISaveDiscrepancies } from '../actions/actions';
import { DEFAULT_STATE, SAVE_DISCREPANCY } from '../constants/constants';
import { IMessageDiscrepancies, ISegmentDiscrepancies } from '../../messageReader/compareMessages/IMessageDiscrepancies';

export function reduceDiscrepancies(state: IMessageDiscrepancies, action: IAction): IMessageDiscrepancies {
    switch (action.type) {
        case DEFAULT_STATE:
            if (state != null) {
                return state;
            }
            return defaultDiscrepancy();
        case SAVE_DISCREPANCY:
            return saveDiscrepancy(state, action as ISaveDiscrepancies);
        default:
            return state;
    }
}

function defaultDiscrepancy(): IMessageDiscrepancies {
    return { message1: Map<number, ISegmentDiscrepancies>(), message2: Map<number, ISegmentDiscrepancies>() };
}

function saveDiscrepancy(state: IMessageDiscrepancies, action: ISaveDiscrepancies): IMessageDiscrepancies {
    return state = action.payload.discrepancies;
}


