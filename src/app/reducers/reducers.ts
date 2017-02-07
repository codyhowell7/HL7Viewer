import { Map } from 'immutable';

import { IMenuState, IMessage, IWorkspaceState } from '../states/states';
import { IAction, ISwitchMessageAction, IWorkspaceModeChangedAction, IRemoveMessageAction, IMessageReceivedAction } from '../actions/actions';
import { DEFAULT_STATE, MODE_CHANGED, SWITCH_MESSAGE, ADD_MESSAGE, REMOVE_MESSAGE, MESSAGE_RECEIVED } from '../constants/constants';
import { WorkspaceMode } from '../enums/enums';

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
            return addMessage(state);
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
        messageText: action.payload.message
    });
}

function addMessage(state: Map<number, IMessage>): Map<number, IMessage>{

    return state.set(state.size, {
        id: state.size,
        messageText: '',
        deleted: false
    });
}

function removeMessage(state: Map<number, IMessage>, action: IRemoveMessageAction): Map<number, IMessage>{

    let current = state.get(action.payload.id);

    console.log(current);

    return state.set(action.payload.id, {
        id: current.id,
        deleted: true,
        messageText: current.messageText
    });
}

function getMessageDefaultState(): Map<number, IMessage> {

    return Map<number, IMessage>().set(0, {
        id: 0,
        messageText: '',
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
    }
}

function getWorkspaceOnModeChange(action: IWorkspaceModeChangedAction): IWorkspaceState {

    return {
        workspaceMode: action.payload.mode
    }
}