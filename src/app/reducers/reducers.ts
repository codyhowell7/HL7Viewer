import { Map } from 'immutable';

import {
    IMenuState, IMessage, IWorkspaceState, IAccordion, ISegmentAccordion,
    IFieldAccordion, IRepeatFieldAccordion, IConditionGroup,
    ICondition, ISearchConditions
} from '../states/states';
import {
    IAction, ISwitchMessageAction, IWorkspaceModeChangedAction, IAddToConidtionSize,
    IRemoveMessageAction, IMessageReceivedAction, IAccordionToggleAction, IAddConditionGroup,
    IAddSearchResults
} from '../actions/actions';
import {
    DEFAULT_STATE, MODE_CHANGED, SWITCH_MESSAGE, ADD_MESSAGE, REMOVE_MESSAGE, MESSAGE_RECEIVED,
    TOGGLE_SEGMENT_ACCORDION, DEFAULT_SEGMENT_ACCORDIONS, DEFAULT_FIELD_ACCORDIONS, TOGGLE_FIELD_ACCORDION,
    DEFAULT_COMPONENT_ACCORDIONS, TOGGLE_COMPONENT_ACCORDION, DEFAULT_MESSAGE_ACCORDIONS, TOGGLE_REPEAT_FIELD_ACCORDION,
    DEFAULT_REPEAT_FIELD_ACCORDIONS, DEFAULT_REPEAT_COMPONENT_ACCORDIONS, TOGGLE_REPEAT_COMPONENT_ACCORDION, ADD_SEARCH_CONDITION,
    ADD_SEARCH_GROUP_CONDITION, UPDATE_GROUP_OPERAND, UPDATE_SEARCH_OPERAND, DELETE_SINGLE_CONDITION, ADD_CONDITION_SIZE, ADD_GROUP_SIZE,
    NEW_SEARCH_RESULT, NEW_SEARCH_MESSAGE, REMOVE_SEARCH_FILTER, SAVE_SEARCH
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

// Messages Accordion State BEGIN //
export function reduceAccordion(state: IAccordion, action: IAction): IAccordion {
    switch (action.type) {
        case TOGGLE_SEGMENT_ACCORDION:
            return toggleSegmentAccordion(state, action as IAccordionToggleAction);
        case TOGGLE_FIELD_ACCORDION:
            return toggleFieldAccordion(state, action as IAccordionToggleAction);
        case TOGGLE_COMPONENT_ACCORDION:
            return toggleComponentAccordion(state, action as IAccordionToggleAction);
        case TOGGLE_REPEAT_FIELD_ACCORDION:
            return toggleRepeatFieldAccordion(state, action as IAccordionToggleAction);
        case TOGGLE_REPEAT_COMPONENT_ACCORDION:
            return toggleRepeatComponentAccordion(state, action as IAccordionToggleAction);
        case DEFAULT_MESSAGE_ACCORDIONS:
            return defaultAccordion(state, action as IAccordionToggleAction);
        case DEFAULT_SEGMENT_ACCORDIONS:
            return setDefaultSegmentAccordions(state, action as IAccordionToggleAction);
        case DEFAULT_FIELD_ACCORDIONS:
            return setDefaultFieldAccordions(state, action as IAccordionToggleAction);
        case DEFAULT_COMPONENT_ACCORDIONS:
            return setDefaultComponentAccordions(state, action as IAccordionToggleAction);
        case DEFAULT_REPEAT_FIELD_ACCORDIONS:
            return setDefaultRepeatFieldAccordions(state, action as IAccordionToggleAction);
        case DEFAULT_REPEAT_COMPONENT_ACCORDIONS:
            return setDefaultRepeatComponentAccordions(state, action as IAccordionToggleAction);
        case DEFAULT_STATE:
            return defaultAccordion();
        default:
            return state;
    }
}

function defaultAccordion(state?: IAccordion, action?: IAccordionToggleAction): IAccordion {
    if (typeof (action) === 'undefined') {
        let repeatFieldAccordionDefault: IRepeatFieldAccordion = {
            repeatFieldAccordionState: false,
            repeatComponent: Map<number, boolean>().set(0, false)
        };
        let fieldAccordionDefault: IFieldAccordion = {
            fieldAccordionState: false,
            component: Map<number, boolean>().set(0, false),
            repeatField: Map<number, IRepeatFieldAccordion>().set(0, repeatFieldAccordionDefault)
        };
        let segmentAccordionDefault: ISegmentAccordion = {
            segmentAccordionState: false,
            field: Map<number, IFieldAccordion>().set(0, fieldAccordionDefault)
        };
        let accordionState: IAccordion = {
            segment: Map<number, Map<number, ISegmentAccordion>>()
                .set(0, Map<number, ISegmentAccordion>().set(0, segmentAccordionDefault))
        };
        return accordionState;
    } else {
        let repeatFieldAccordionDefault: IRepeatFieldAccordion = {
            repeatFieldAccordionState: false,
            repeatComponent: Map<number, boolean>().set(0, false)
        };
        let fieldAccordionDefault: IFieldAccordion = {
            fieldAccordionState: false,
            component: Map<number, boolean>().set(0, false),
            repeatField: Map<number, IRepeatFieldAccordion>().set(0, repeatFieldAccordionDefault)
        };
        let segmentAccordionDefault: ISegmentAccordion = {
            segmentAccordionState: false,
            field: Map<number, IFieldAccordion>().set(0, fieldAccordionDefault)
        };
        let accordionState: IAccordion = {
            segment: state.segment.set(action.payload.messageID, Map<number, ISegmentAccordion>().set(0, segmentAccordionDefault))
        };
        return accordionState;
    }
}

function setDefaultSegmentAccordions(state: IAccordion, action: IAccordionToggleAction): IAccordion {
    let fieldRepeatAccordionDefault: IRepeatFieldAccordion = {
        repeatFieldAccordionState: action.payload.repeatToggleState,
        repeatComponent: Map<number, boolean>().set(action.payload.componentID, action.payload.componentToggleState)
    };
    let fieldAccordionDefault: IFieldAccordion = {
        fieldAccordionState: action.payload.fieldToggleState,
        component: Map<number, boolean>().set(action.payload.componentID, action.payload.componentToggleState),
        repeatField: Map<number, IRepeatFieldAccordion>().set(action.payload.repeatID, fieldRepeatAccordionDefault)
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
    let fieldRepeatAccordionDefault: IRepeatFieldAccordion = {
        repeatFieldAccordionState: action.payload.repeatToggleState,
        repeatComponent: Map<number, boolean>().set(action.payload.componentID, action.payload.componentToggleState)
    };
    let fieldAccordionDefault: IFieldAccordion = {
        fieldAccordionState: action.payload.fieldToggleState,
        component: Map<number, boolean>().set(action.payload.componentID, action.payload.componentToggleState),
        repeatField: Map<number, IRepeatFieldAccordion>().set(action.payload.repeatID, fieldRepeatAccordionDefault)
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

function setDefaultRepeatFieldAccordions(state: IAccordion, action: IAccordionToggleAction) {
    let componentRepeatAccordionDefault: IRepeatFieldAccordion = {
        repeatFieldAccordionState: action.payload.repeatToggleState, repeatComponent: Map<number, boolean>()
            .set(action.payload.componentID, action.payload.componentToggleState)
    };

    let fieldRepeatAccordionDefault: IFieldAccordion = {
        fieldAccordionState: action.payload.fieldToggleState,
        repeatField: state.segment.get(action.payload.messageID).get(action.payload.segmentID).field
            .get(action.payload.fieldID).repeatField.set(action.payload.repeatID, componentRepeatAccordionDefault)
    };
    let segmentAccordionDefault: ISegmentAccordion = {
        segmentAccordionState: action.payload.segmentToggleState, field: state.segment
            .get(action.payload.messageID).get(action.payload.segmentID).field
            .set(action.payload.fieldID, fieldRepeatAccordionDefault)
    };
    let accordion: IAccordion = {
        segment: (state.segment
            .set(action.payload.messageID, state.segment.get(action.payload.messageID)
                .set(action.payload.segmentID, segmentAccordionDefault)))
    };
    return accordion;
}

function setDefaultRepeatComponentAccordions(state: IAccordion, action: IAccordionToggleAction) {
    console.log(state);
    let componentRepeatAccordionDefault: IRepeatFieldAccordion = {
        repeatFieldAccordionState: action.payload.repeatToggleState, repeatComponent:
        state.segment.get(action.payload.messageID).get(action.payload.segmentID)
            .field.get(action.payload.fieldID).repeatField.get(action.payload.repeatID)
            .repeatComponent.set(action.payload.componentID, action.payload.componentToggleState)
    };

    let fieldRepeatAccordionDefault: IFieldAccordion = {
        fieldAccordionState: action.payload.fieldToggleState,
        repeatField: state.segment.get(action.payload.messageID).get(action.payload.segmentID).field
            .get(action.payload.fieldID).repeatField.set(action.payload.repeatID, componentRepeatAccordionDefault)
    };
    let segmentAccordionDefault: ISegmentAccordion = {
        segmentAccordionState: action.payload.segmentToggleState, field: state.segment
            .get(action.payload.messageID).get(action.payload.segmentID).field
            .set(action.payload.fieldID, fieldRepeatAccordionDefault)
    };
    let accordion: IAccordion = {
        segment: (state.segment
            .set(action.payload.messageID, state.segment.get(action.payload.messageID)
                .set(action.payload.segmentID, segmentAccordionDefault)))
    };
    return accordion;
}

function toggleSegmentAccordion(state: IAccordion, action: IAccordionToggleAction): IAccordion {
    let repeatFieldAccordionDefault: IRepeatFieldAccordion = {
        repeatFieldAccordionState: action.payload.componentToggleState,
        repeatComponent: state.segment.get(action.payload.messageID).get(action.payload.segmentID).field.get(action.payload.fieldID)
            .repeatField.get(action.payload.repeatID).repeatComponent.set(action.payload.componentID, action.payload.componentToggleState)
    };
    let fieldAccordionDefault: IFieldAccordion = {
        fieldAccordionState: action.payload.fieldToggleState,
        component: state.segment.get(action.payload.messageID).get(action.payload.segmentID).field
            .get(action.payload.fieldID).component
            .set(action.payload.componentID, action.payload.componentToggleState),
        repeatField: state.segment.get(action.payload.messageID).get(action.payload.segmentID).field
            .get(action.payload.fieldID).repeatField
            .set(action.payload.repeatID, repeatFieldAccordionDefault)
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
    if (!action.payload.fieldHasRepeat) {
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
    } else {
        let componentAccordioDefault: IRepeatFieldAccordion = {
            repeatFieldAccordionState: action.payload.repeatToggleState, repeatComponent:
            state.segment.get(action.payload.messageID).get(action.payload.segmentID).field
                .get(action.payload.fieldID).repeatField
                .get(action.payload.repeatID).repeatComponent
                .set(action.payload.componentID, action.payload.componentToggleState)
        };
        let fieldAccordionDefault: IFieldAccordion = {
            fieldAccordionState: !action.payload.fieldToggleState, repeatField:
            state.segment.get(action.payload.messageID).get(action.payload.segmentID).field
                .get(action.payload.fieldID).repeatField
                .set(action.payload.repeatID, componentAccordioDefault)
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

}

function toggleRepeatFieldAccordion(state: IAccordion, action: IAccordionToggleAction): IAccordion {
    let componentRepeatAccordionDefault: IRepeatFieldAccordion = {
        repeatFieldAccordionState: !action.payload.repeatToggleState, repeatComponent:
        state.segment.get(action.payload.messageID).get(action.payload.segmentID).field
            .get(action.payload.fieldID).repeatField
            .get(action.payload.repeatID).repeatComponent
            .set(action.payload.componentID, action.payload.componentToggleState)
    };

    let fieldRepeatAccordionDefault: IFieldAccordion = {
        fieldAccordionState: action.payload.fieldToggleState, repeatField:
        state.segment.get(action.payload.messageID).get(action.payload.segmentID).field
            .get(action.payload.fieldID).repeatField
            .set(action.payload.repeatID, componentRepeatAccordionDefault)
    };
    let segmentAccordionDefault: ISegmentAccordion = {
        segmentAccordionState: action.payload.segmentToggleState, field: state.segment
            .get(action.payload.messageID).get(action.payload.segmentID).field
            .set(action.payload.fieldID, fieldRepeatAccordionDefault)
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

function toggleRepeatComponentAccordion(state: IAccordion, action: IAccordionToggleAction): IAccordion {

    let componentRepeatAccordionDefault: IRepeatFieldAccordion = {
        repeatFieldAccordionState: action.payload.repeatToggleState, repeatComponent:
        state.segment.get(action.payload.messageID).get(action.payload.segmentID).field
            .get(action.payload.fieldID).repeatField
            .get(action.payload.repeatID).repeatComponent
            .set(action.payload.componentID, !action.payload.componentToggleState)
    };

    let fieldRepeatAccordionDefault: IFieldAccordion = {
        fieldAccordionState: action.payload.fieldToggleState, repeatField:
        state.segment.get(action.payload.messageID).get(action.payload.segmentID).field
            .get(action.payload.fieldID).repeatField
            .set(action.payload.repeatID, componentRepeatAccordionDefault)
    };
    let segmentAccordionDefault: ISegmentAccordion = {
        segmentAccordionState: action.payload.segmentToggleState, field: state.segment
            .get(action.payload.messageID).get(action.payload.segmentID).field
            .set(action.payload.fieldID, fieldRepeatAccordionDefault)
    };
    let accordion: IAccordion = {
        segment: (state.segment
            .set(action.payload.messageID, state.segment.get(action.payload.messageID)
                .set(action.payload.segmentID, segmentAccordionDefault)))
    };
    return accordion;
}
// Messages Accordion State END //

// Search Condition State BEGIN //

export function reduceSearchCondition(state: ISearchConditions, action: IAction): ISearchConditions {
    switch (action.type) {
        case SAVE_SEARCH:
            return saveSearch(state, action as IAddSearchResults);
        default:
            return state;
    }
}

function saveSearch(state: ISearchConditions, action: IAddSearchResults ) {
    return action.payload.search;
}


export function reduceSearchConditionSize(state: Map<number, number>, action: IAction): Map<number, number> {
    switch (action.type) {
        case ADD_CONDITION_SIZE:
            return addConditionSize(state);
        case ADD_GROUP_SIZE:
            return addGroupSize(state);
        case DEFAULT_STATE:
            return defaultSearchSize(state);
        default:
            return state;
    }
}

function defaultSearchSize(state: Map<number, number>): Map<number, number> {
    return Map<number, number>().set(0, 0);
}

function addConditionSize(state: Map<number, number>): Map<number, number> {
    return state.set(state.keySeq().max(), state.valueSeq().max() + 1);
}

function addGroupSize(state: Map<number, number>): Map<number, number> {
    return state.set(state.keySeq().max() + 1, state.valueSeq().max() + 1);
}

export function reduceSearchResults(state: Map<number, boolean>, action: IAction): Map<number, boolean> {
    switch (action.type) {
        case NEW_SEARCH_RESULT:
            return newSearchResult(state, action as IAddSearchResults);
        case NEW_SEARCH_MESSAGE:
            return defaultNewMessage(state);
        case REMOVE_SEARCH_FILTER:
            return removeSearchResult(state);
        case DEFAULT_STATE:
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


// Search Condition State END //
