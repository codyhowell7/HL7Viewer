import { Map } from 'immutable';

import { IMenuState, IMessage, IWorkspaceState } from '../states/states';
import {
    IAction, ISwitchMessageAction, IWorkspaceModeChangedAction,
    IRemoveMessageAction, IMessageReceivedAction, IAccordionToggleAction, IDefaultSegments
} from '../actions/actions';
import {
    DEFAULT_STATE, MODE_CHANGED, SWITCH_MESSAGE, ADD_MESSAGE, REMOVE_MESSAGE, MESSAGE_RECEIVED,
    TOGGLE_ACCORDION, DEFAULT_ACCORDIONS_MESS, DEFAULT_ACCORDIONS_SEGS, NEW_MESSAGE
} from '../constants/constants';
import { WorkspaceMode } from '../enums/enums';
import { HL7Message } from '../../parser/HL7Message';


export function reduceCurrentMessage(state: number, action: IAction): number {

    switch (action.type) {
        case SWITCH_MESSAGE:
            return (action as ISwitchMessageAction).payload.id;
        case DEFAULT_STATE:
            return 0;
        default:
            return state;
    }
}

export function reduceMessages(state: Map<number, IMessage>, action: IAction): Map<number, IMessage> {

    switch (action.type) {
        case ADD_MESSAGE:
            return addMessage(state, action as IMessageReceivedAction);
        case REMOVE_MESSAGE:
            return removeMessage(state, action as IRemoveMessageAction);
        case MESSAGE_RECEIVED:
            return messageReceived(state, action as IMessageReceivedAction);
        case DEFAULT_STATE:
            return getMessageDefaultState();
        default:
            return state;
    }
}

function messageReceived(state: Map<number, IMessage>, action: IMessageReceivedAction): Map<number, IMessage> {
    return state.set(action.payload.id, {
        id: action.payload.id,
        deleted: false,
        message: action.payload.message
    });
}

function addMessage(state: Map<number, IMessage>, action: IMessageReceivedAction): Map<number, IMessage> {
    let returnMessage;
    if (typeof (action.payload.message.hl7CorrectedMessage) !== 'undefined') {
        returnMessage = state.set(state.size, {
            id: state.size,
            message: action.payload.message,
            deleted: false
        });
    } else {
        returnMessage = state.set(state.size, {
            id: state.size,
            message: new HL7Message(''),
            deleted: false
        });
    }
    return returnMessage;

}

function removeMessage(state: Map<number, IMessage>, action: IRemoveMessageAction): Map<number, IMessage> {

    let current = state.get(action.payload.id);

    console.log(current);

    return state.set(action.payload.id, {
        id: current.id,
        deleted: true,
        message: current.message
    });
}

function getMessageDefaultState(): Map<number, IMessage> {

    return Map<number, IMessage>().set(0, {
        id: 0,
        message: new HL7Message(''),
        deleted: false
    });
}

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

export function reduceWorkspace(state: IWorkspaceState, action: IAction): IWorkspaceState {

    switch (action.type) {
        case DEFAULT_STATE:
            return getWorkspaceDefaultState();
        case MODE_CHANGED:
            return getWorkspaceOnModeChange(action as IWorkspaceModeChangedAction);
        default:
            return state;
    }
}

function getWorkspaceDefaultState(): IWorkspaceState {

    return {
        workspaceMode: WorkspaceMode.messages
    };
}

function getWorkspaceOnModeChange(action: IWorkspaceModeChangedAction): IWorkspaceState {

    return {
        workspaceMode: action.payload.mode
    };
}
export function reduceAccordion(state: Map<number, Map<number, boolean>>, action: IAction): Map<number, Map<number, boolean>> {
    switch (action.type) {
        case TOGGLE_ACCORDION:
            return
        case DEFAULT_ACCORDIONS_MESS:
            return
        case DEFAULT_ACCORDIONS_SEGS:
            return;
        case DEFAULT_STATE:
            return;
        default:
            return state;
    }
}

export function reduceSegments(state: Map<number, number>, action: IAction): Map<number, number> {
    switch (action.type) {
        case NEW_MESSAGE:
            defaultSegments(state, action as IDefaultSegments);
    }
    return;
}

function defaultSegments(state: Map<number, number>, action: IDefaultSegments): Map<number, number> {
    for (let i = 1; i <= action.payload.segments.length; i++) {
        state.set(action.payload.id, i + action.payload.segmentOffset);
    }
    return state;
}