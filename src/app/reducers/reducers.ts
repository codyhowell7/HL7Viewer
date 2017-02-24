import { Map, List } from 'immutable';

import {
    IMenuState, IMessage, IWorkspaceState, IAccordion, ISegmentAccordion,
    IFieldAccordion, IRepeatFieldAccordion, IConditionGroup,
    ICondition, ISearchConditions
} from '../states/states';
import {
    IAction, ISwitchMessageAction, IWorkspaceModeChangedAction, IAddToConidtionSize,
    IRemoveMessageAction, IMessageReceivedAction, IAccordionToggleAction, IAddConditionGroup
} from '../actions/actions';
import {
    DEFAULT_STATE, MODE_CHANGED, SWITCH_MESSAGE, ADD_MESSAGE, REMOVE_MESSAGE, MESSAGE_RECEIVED,
    TOGGLE_SEGMENT_ACCORDION, DEFAULT_SEGMENT_ACCORDIONS, DEFAULT_FIELD_ACCORDIONS, TOGGLE_FIELD_ACCORDION,
    DEFAULT_COMPONENT_ACCORDIONS, TOGGLE_COMPONENT_ACCORDION, DEFAULT_MESSAGE_ACCORDIONS, TOGGLE_REPEAT_FIELD_ACCORDION,
    DEFAULT_REPEAT_FIELD_ACCORDIONS, DEFAULT_REPEAT_COMPONENT_ACCORDIONS, TOGGLE_REPEAT_COMPONENT_ACCORDION, ADD_SEARCH_CONDITION,
    ADD_SEARCH_GROUP_CONDITION, UPDATE_GROUP_OPERAND, UPDATE_SEARCH_OPERAND, DELETE_SINGLE_CONDITION, ADD_CONDITION_SIZE, ADD_GROUP_SIZE
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
        case ADD_SEARCH_GROUP_CONDITION:
            return addSearchGroupCondition(state, action as IAddConditionGroup);
        case ADD_SEARCH_CONDITION:
            return addSearchCondition(state, action as IAddConditionGroup);
        case UPDATE_GROUP_OPERAND:
            return updateGroupCondition(state, action as IAddConditionGroup);
        case UPDATE_SEARCH_OPERAND:
            return updateSearchCondition(state, action as IAddConditionGroup);
        case DELETE_SINGLE_CONDITION:
            return deleteSingleCondition(state, action as IAddConditionGroup);
        case DEFAULT_STATE:
            return defaultSearchGroup();
        default:
            return state;
    }
}

function defaultSearchGroup() {
    let defaultCondition: ICondition = {
        leftValue: '',
        rightValue: '',
        conditionOperand: '==',
        conditionID: 0,
    };
    let defaultGroup: IConditionGroup = {
        conditions: Map<number, ICondition>().set(0, defaultCondition),
        groupOperand: 'AND',
        groupID: 0
    };
    let defaultGroupConditions: ISearchConditions = {
        conditionGroups: Map<number, IConditionGroup>().set(0, defaultGroup),
        searchOperand: 'OR'
    };

    return defaultGroupConditions;
}

function addSearchCondition(state: ISearchConditions, action: IAddConditionGroup): ISearchConditions {
    let condition: ICondition = {
        leftValue: action.payload.leftValue,
        rightValue: action.payload.rightValue,
        conditionOperand: action.payload.conditionOperand,
        conditionID: action.payload.conditionID
    };
    let conditionGroup: IConditionGroup = {
        conditions: state.conditionGroups.get(action.payload.conditionGroupID)
            .conditions.set(action.payload.conditionID, condition),
        groupOperand: state.conditionGroups.get(action.payload.conditionGroupID).groupOperand,
        groupID: action.payload.conditionGroupID,
    };
    let newState: ISearchConditions = {
        conditionGroups: state.conditionGroups.set(action.payload.conditionGroupID, conditionGroup),
        searchOperand: state.searchOperand
    };

    return newState;
}
function addSearchGroupCondition(state: ISearchConditions, action: IAddConditionGroup): ISearchConditions {
    let condition: ICondition = {
        leftValue: '',
        rightValue: '',
        conditionOperand: '==',
        conditionID: action.payload.conditionID,

    };
    let conditionGroup: IConditionGroup = {
        conditions: Map<number, ICondition>().set(action.payload.conditionID, condition),
        groupOperand: 'AND',
        groupID: action.payload.conditionGroupID
    };
    let newState: ISearchConditions = {
        conditionGroups: state.conditionGroups.set(action.payload.conditionGroupID, conditionGroup),
        searchOperand: state.searchOperand
    };

    return newState;
}

function updateGroupCondition(state: ISearchConditions, action: IAddConditionGroup): ISearchConditions {
    let groupCondition: IConditionGroup = {
        groupOperand: action.payload.conditionGroupOperand,
        conditions: state.conditionGroups.get(action.payload.id).conditions,
        groupID: action.payload.id,
    };
    let newState: ISearchConditions = {
        conditionGroups: state.conditionGroups.set(action.payload.id, groupCondition),
        searchOperand: state.searchOperand
    };
    return newState;
}

function updateSearchCondition(state: ISearchConditions, action: IAddConditionGroup): ISearchConditions {
    let newState: ISearchConditions = {
        conditionGroups: state.conditionGroups,
        searchOperand: action.payload.searchOperand
    };
    return newState;
}

function deleteSingleCondition(state: ISearchConditions, action: IAddConditionGroup): ISearchConditions {
    let deleteCondtion: IConditionGroup = {
        conditions: state.conditionGroups.get(action.payload.conditionGroupID).conditions.delete(action.payload.conditionID),
        groupOperand: state.conditionGroups.get(action.payload.conditionGroupID).groupOperand,
        groupID: action.payload.conditionGroupID,
    };
    let newState: ISearchConditions = {
        conditionGroups: state.conditionGroups.set(action.payload.conditionGroupID, deleteCondtion),
        searchOperand: state.searchOperand
    };
    console.log(state.conditionGroups.get(action.payload.conditionGroupID).conditions);
    if (state.conditionGroups.get(action.payload.conditionGroupID).conditions.size === 1) {
        newState = {
            conditionGroups: state.conditionGroups.delete(action.payload.conditionGroupID),
            searchOperand: state.searchOperand
        };
    }
    return newState;
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
// Search Condition State END //
