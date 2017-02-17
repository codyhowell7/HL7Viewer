import { Map } from 'immutable';

import {
    IMenuState, IMessage, IWorkspaceState, IAccordion, ISegmentAccordion,
    IFieldAccordion
} from '../states/states';
import {
    IAction, ISwitchMessageAction, IWorkspaceModeChangedAction,
    IRemoveMessageAction, IMessageReceivedAction, IAccordionToggleAction
} from '../actions/actions';
import {
    DEFAULT_STATE, MODE_CHANGED, SWITCH_MESSAGE, ADD_MESSAGE, REMOVE_MESSAGE, MESSAGE_RECEIVED,
    TOGGLE_SEGMENT_ACCORDION, DEFAULT_SEGMENT_ACCORDIONS, DEFAULT_FIELD_ACCORDIONS, TOGGLE_FIELD_ACCORDION,
    DEFAULT_COMPONENT_ACCORDIONS, TOGGLE_COMPONENT_ACCORDION, DEFAULT_MESSAGE_ACCORDIONS
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
export function reduceAccordion(state: IAccordion, action: IAction): IAccordion {
    switch (action.type) {
        case TOGGLE_SEGMENT_ACCORDION:
            return toggleSegmentAccordion(state, action as IAccordionToggleAction);
        case TOGGLE_FIELD_ACCORDION:
            return toggleFieldAccordion(state, action as IAccordionToggleAction);
        case TOGGLE_COMPONENT_ACCORDION:
            return toggleComponentAccordion(state, action as IAccordionToggleAction);
        case DEFAULT_MESSAGE_ACCORDIONS:
            return defaultAccordion(state, action as IAccordionToggleAction);
        case DEFAULT_SEGMENT_ACCORDIONS:
            return setDefaultSegmentAccordions(state, action as IAccordionToggleAction);
        case DEFAULT_FIELD_ACCORDIONS:
            return setDefaultFieldAccordions(state, action as IAccordionToggleAction);
        case DEFAULT_COMPONENT_ACCORDIONS:
            return setDefaultComponentAccordions(state, action as IAccordionToggleAction);
        case DEFAULT_STATE:
            return defaultAccordion();
        default:
            return state;
    }
}

function defaultAccordion(state?: IAccordion, action?: IAccordionToggleAction): IAccordion {
    if (typeof (action) === 'undefined') {
        let fieldAccordionDefault: IFieldAccordion
            = { fieldAccordionState: false, component: Map<number, boolean>().set(0, false) };
        let segmentAccordionDefault: ISegmentAccordion
            = { segmentAccordionState: false, field: Map<number, IFieldAccordion>().set(0, fieldAccordionDefault) };
        let accordionState: IAccordion = {
            segment: Map<number, Map<number, ISegmentAccordion>>()
                .set(0, Map<number, ISegmentAccordion>().set(0, segmentAccordionDefault))
        };
        return accordionState;
    } else {
        let fieldAccordionDefault: IFieldAccordion
            = { fieldAccordionState: false, component: Map<number, boolean>().set(0, false) };
        let segmentAccordionDefault: ISegmentAccordion
            = { segmentAccordionState: false, field: Map<number, IFieldAccordion>().set(0, fieldAccordionDefault) };
        let accordionState: IAccordion = {
            segment: state.segment.set(action.payload.messageID, Map<number, ISegmentAccordion>().set(0, segmentAccordionDefault))
        };
        return accordionState;
    }
}

function setDefaultSegmentAccordions(state: IAccordion, action: IAccordionToggleAction): IAccordion {
    let fieldAccordionDefault: IFieldAccordion = {
        fieldAccordionState: action.payload.fieldToggleState, component: Map<number, boolean>()
            .set(action.payload.componentID, action.payload.componentToggleState)
    };
    let segmentAccordionDefault: ISegmentAccordion = {
        segmentAccordionState: action.payload.segmentToggleState, field: Map<number, IFieldAccordion>()
            .set(action.payload.fieldID, fieldAccordionDefault)
    };
    let accordion: IAccordion = {
        segment: (state.segment
            .set(action.payload.messageID, state.segment.get(action.payload.messageID)
                .set(action.payload.segmentID, segmentAccordionDefault)))
    };
    return accordion;
}
function setDefaultFieldAccordions(state: IAccordion, action: IAccordionToggleAction) {
    let fieldAccordionDefault: IFieldAccordion = {
        fieldAccordionState: action.payload.fieldToggleState, component: Map<number, boolean>()
            .set(action.payload.componentID, action.payload.componentToggleState)
    };
    let segmentAccordionDefault: ISegmentAccordion = {
        segmentAccordionState: action.payload.segmentToggleState, field: state.segment
            .get(action.payload.messageID).get(action.payload.segmentID).field
            .set(action.payload.fieldID, fieldAccordionDefault)
    };
    let accordion: IAccordion = {
        segment: (state.segment
            .set(action.payload.messageID, state.segment.get(action.payload.messageID)
                .set(action.payload.segmentID, segmentAccordionDefault)))
    };
    return accordion;
}

function setDefaultComponentAccordions(state: IAccordion, action: IAccordionToggleAction) {
    let fieldAccordionDefault: IFieldAccordion = {
        fieldAccordionState: action.payload.fieldToggleState, component:
        state.segment.get(action.payload.messageID).get(action.payload.segmentID).field
            .get(action.payload.fieldID).component
            .set(action.payload.componentID, action.payload.componentToggleState)
    };
    let segmentAccordionDefault: ISegmentAccordion = {
        segmentAccordionState: action.payload.segmentToggleState, field: state.segment
            .get(action.payload.messageID).get(action.payload.segmentID).field
            .set(action.payload.fieldID, fieldAccordionDefault)
    };
    let accordion: IAccordion = {
        segment: (state.segment
            .set(action.payload.messageID, state.segment.get(action.payload.messageID)
                .set(action.payload.segmentID, segmentAccordionDefault)))
    };
    return accordion;
}

function toggleSegmentAccordion(state: IAccordion, action: IAccordionToggleAction): IAccordion {
    let fieldAccordionDefault: IFieldAccordion = {
        fieldAccordionState: action.payload.fieldToggleState, component:
        state.segment.get(action.payload.messageID).get(action.payload.segmentID).field
            .get(action.payload.fieldID).component
            .set(action.payload.componentID, action.payload.componentToggleState)
    };
    let segmentAccordionDefault: ISegmentAccordion = {
        segmentAccordionState: !action.payload.segmentToggleState, field: state.segment
            .get(action.payload.messageID).get(action.payload.segmentID).field
            .set(action.payload.fieldID, fieldAccordionDefault)
    };
    let accordion: IAccordion = {
        segment: (state.segment
            .set(action.payload.messageID, state.segment.get(action.payload.messageID)
                .set(action.payload.segmentID, segmentAccordionDefault)))
    };
    return accordion;
}

function toggleFieldAccordion(state: IAccordion, action: IAccordionToggleAction): IAccordion {
    let fieldAccordionDefault: IFieldAccordion = {
        fieldAccordionState: !action.payload.fieldToggleState, component:
        state.segment.get(action.payload.messageID).get(action.payload.segmentID).field
            .get(action.payload.fieldID).component
            .set(action.payload.componentID, action.payload.componentToggleState)
    };
    let segmentAccordionDefault: ISegmentAccordion = {
        segmentAccordionState: action.payload.segmentToggleState, field: state.segment
            .get(action.payload.messageID).get(action.payload.segmentID).field
            .set(action.payload.fieldID, fieldAccordionDefault)
    };
    let accordion: IAccordion = {
        segment: (state.segment
            .set(action.payload.messageID, state.segment.get(action.payload.messageID)
                .set(action.payload.segmentID, segmentAccordionDefault)))
    };
    return accordion;
}

function toggleComponentAccordion(state: IAccordion, action: IAccordionToggleAction): IAccordion {
    let fieldAccordionDefault: IFieldAccordion = {
        fieldAccordionState: action.payload.fieldToggleState, component:
        state.segment.get(action.payload.messageID).get(action.payload.segmentID).field
            .get(action.payload.fieldID).component
            .set(action.payload.componentID, !action.payload.componentToggleState)
    };
    let segmentAccordionDefault: ISegmentAccordion = {
        segmentAccordionState: action.payload.segmentToggleState, field: state.segment
            .get(action.payload.messageID).get(action.payload.segmentID).field
            .set(action.payload.fieldID, fieldAccordionDefault)
    };
    let accordion: IAccordion = {
        segment: (state.segment
            .set(action.payload.messageID, state.segment.get(action.payload.messageID)
                .set(action.payload.segmentID, segmentAccordionDefault)))
    };
    return accordion;
}