import { Map } from 'immutable';

import { IMenuState, IMessage, IWorkspaceState } from '../states/states';
import {
    IAction, ISwitchMessageAction, IWorkspaceModeChangedAction, IFieldAccordionToggleaction,
    IRemoveMessageAction, IMessageReceivedAction, IAccordionToggleAction, IFieldOffsetAction,
    ISegmentOffsetAction, IComponentOffsetAction
} from '../actions/actions';
import {
    DEFAULT_STATE, MODE_CHANGED, SWITCH_MESSAGE, ADD_MESSAGE, REMOVE_MESSAGE, MESSAGE_RECEIVED,
    TOGGLE_ACCORDION, DEFAULT_ACCORDIONS, DEFAULT_FIELD_ACCORDIONS, TOGGLE_FIELD_ACCORDION, FIELD_OFFSET,
    SEGMENT_OFFSET, COMPONENT_OFFSET
} from '../constants/constants';
import { WorkspaceMode } from '../enums/enums';
import { HL7Message } from '../../parser/HL7Message';
import { GetNextSegment } from '../services/get-next-segment-service';


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
            return toggleAccordion(state, action as IAccordionToggleAction);
        case DEFAULT_ACCORDIONS:
            return setDefaultAccordions(state, action as IAccordionToggleAction);
        case DEFAULT_STATE:
            return defaultAccordion();
        default:
            return state;
    }
}
function defaultAccordion(): Map<number, Map<number, boolean>> {
    let stateSet = Map<number, Map<number, boolean>>().set(0, Map<number, boolean>().set(0, false));
    return stateSet;
}

function setDefaultAccordions(state, action: IAccordionToggleAction): Map<number, Map<number, boolean>> {
    if (state.get(action.payload.messageID) == null) {
        return state.set(action.payload.messageID, Map<number, boolean>().set(action.payload.segmentID, false));
    }
    if (state.get(action.payload.messageID).get(action.payload.segmentID) != null) {
        return state;
    }
    return state.set(action.payload.messageID, state.get(action.payload.messageID).set(action.payload.segmentID, false));
}

function toggleAccordion(state: Map<number, Map<number, boolean>>, action: IAccordionToggleAction): Map<number, Map<number, boolean>> {
    let stateSet = state.set(action.payload.messageID,
        state.get(action.payload.messageID).set(action.payload.segmentID, !action.payload.toggleState));
    return stateSet;
}

export function reduceFieldAccordion(state: Map<number, Map<number, boolean>>, action: IAction): Map<number, Map<number, boolean>> {
    switch (action.type) {
        case DEFAULT_FIELD_ACCORDIONS:
            return setDefaultFieldAccordions(state, action as IFieldAccordionToggleaction);
        case TOGGLE_FIELD_ACCORDION:
            return toggleFieldAccordion(state, action as IFieldAccordionToggleaction);
        case DEFAULT_STATE:
            return defaultFieldAccordion();
        default:
            return state;

    }
}
function defaultFieldAccordion(): Map<number, Map<number, boolean>> {
    return Map<number, Map<number, boolean>>().set(0, Map<number, boolean>().set(0, false));
}

function setDefaultFieldAccordions(state: Map<number, Map<number, boolean>>,
    action: IFieldAccordionToggleaction): Map<number, Map<number, boolean>> {
    if (state.get(action.payload.segmentID) == null) {
        return state.set(action.payload.segmentID, Map<number, boolean>().set(action.payload.fieldID, false));
    }
    if (state.get(action.payload.segmentID).get(action.payload.fieldID) != null) {
        return state;
    }
    return state.set(action.payload.segmentID, state.get(action.payload.segmentID).set(action.payload.fieldID, false));
}

function toggleFieldAccordion(state: Map<number, Map<number, boolean>>,
    action: IFieldAccordionToggleaction): Map<number, Map<number, boolean>> {
        return state.set(action.payload.segmentID,
            state.get(action.payload.segmentID).set(action.payload.fieldID, !action.payload.toggleState));
}

export function reduceSegmentOffset(state: Map<number, number>, action: IAction) {
    switch (action.type) {
        case SEGMENT_OFFSET:
            return setSegmentOffset(state, action as ISegmentOffsetAction);
        case DEFAULT_STATE:
            return defaultSegmentOffset();
        default:
            return state;

    }
}
function defaultSegmentOffset(): Map<number, number> {
    return Map<number, number>().set(0, 0);
}

 function setSegmentOffset(state: Map<number, number>, action: ISegmentOffsetAction) {
    return state.set(action.payload.messageID, action.payload.segmentIdOffset);
 }

 export function reduceFieldOffset(state: Map<number, number>, action: IAction): Map<number, number> {
    switch (action.type) {
        case FIELD_OFFSET:
            return setFieldOffset(state, action as IFieldOffsetAction);
        case DEFAULT_STATE:
            return defaultFieldOffset();
        default:
            return state;
    }
 }

function defaultFieldOffset(): Map<number, number> {
    return Map<number, number>().set(0, 0);
}

function setFieldOffset(state: Map<number, number>, action: IFieldOffsetAction): Map<number, number> {
    return state.set(action.payload.segmentID, action.payload.fieldIdOffset);
}

export function reduceComponentOffset(state: Map<number, number>, action: IAction): Map<number, number> {
    switch ( action.type) {
        case COMPONENT_OFFSET:
            return setComponentOffset(state, action as IComponentOffsetAction);
        case DEFAULT_STATE:
            return defaultComponentOffset();
        default:
            return state;
    }
}

function defaultComponentOffset(): Map<number, number> {
    return Map<number, number>().set(0, 0);
}

function setComponentOffset(state: Map<number, number>, action: IComponentOffsetAction): Map<number, number> {
    return state.set(action.payload.fieldID, action.payload.componentIdOffset);
}
