import { Map } from 'immutable';

import { IAction, ISaveJWT } from '../actions/actions';
import { SAVE_JWT } from '../constants/constants';

export function reduceJWT(state: string, action: IAction) {
    switch(action.type) {
        case SAVE_JWT:
            return saveJWT(state, action as ISaveJWT);
        default:
            return state;
    }
}

function saveJWT(state: string, action: ISaveJWT): string {
    return action.payload.JWT;
}