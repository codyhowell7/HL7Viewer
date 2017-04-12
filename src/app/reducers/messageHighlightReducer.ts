import { Map } from 'immutable';
import { IMessageHighlight } from '../states/states';
import { IAction, IHighlightMessage } from '../actions/actions';
import {
    DEFAULT_STATE, RESET_STATE, HIGHLIGHT_FIELD, HIGHLIGHT_COMPONENT,
    HIGHLIGHT_SUBCOMPONENT, HIGHLIGHT_REPEAT_FIELD, HIGHLIGHT_REPEAT_COMPONENT, HIGHLIGHT_REPEAT_SUBCOMPONENT
} from '../constants/constants';

export function reduceMessageHighlight(state: Map<string, IMessageHighlight>, action: IAction) {

    switch (action.type) {
        case DEFAULT_STATE:
            return defaultMessageHighlight();
        case HIGHLIGHT_FIELD:
            return highlightField(action as IHighlightMessage);
        case HIGHLIGHT_COMPONENT:
            return highlightComponent(action as IHighlightMessage);
        case HIGHLIGHT_SUBCOMPONENT:
            return highlightSubComponent(action as IHighlightMessage);
        case HIGHLIGHT_REPEAT_FIELD:
            return highlightRepeatField(action as IHighlightMessage);
        case HIGHLIGHT_REPEAT_COMPONENT:
            return highlightRepeatComponent(action as IHighlightMessage);
        case HIGHLIGHT_REPEAT_SUBCOMPONENT:
            return highlightRepeatSubComponent(action as IHighlightMessage);
        case RESET_STATE:
            return defaultMessageHighlight();
        default:
            return state;
    }
}

function defaultMessageHighlight(): Map<string, IMessageHighlight> {
    return Map<string, IMessageHighlight>();
}

function highlightField(action: IHighlightMessage): Map<string, IMessageHighlight> {
    let newState = Map<string, IMessageHighlight>();
    newState = newState.set(action.payload.segmentName, {
        fieldID: action.payload.fieldID,
        repeatID: null,
        componentID: null,
        subComponentID: null
    });
    return newState;
}

function highlightComponent(action: IHighlightMessage): Map<string, IMessageHighlight> {
    let newState = Map<string, IMessageHighlight>();
    newState = newState.set(action.payload.segmentName, {
        fieldID: action.payload.fieldID,
        repeatID: null,
        componentID: action.payload.componentID,
        subComponentID: null
    });
    return newState;
}

function highlightSubComponent(action: IHighlightMessage): Map<string, IMessageHighlight> {
    let newState = Map<string, IMessageHighlight>();
    newState = newState.set(action.payload.segmentName, {
        fieldID: action.payload.fieldID,
        repeatID: null,
        componentID: action.payload.componentID,
        subComponentID: action.payload.subComponentID
    });
    return newState;
}

function highlightRepeatField(action: IHighlightMessage): Map<string, IMessageHighlight> {
    let newState = Map<string, IMessageHighlight>();
    newState = newState.set(action.payload.segmentName, {
        fieldID: action.payload.fieldID,
        repeatID: action.payload.repeatID,
        componentID: null,
        subComponentID: null
    });
    return newState;
}

function highlightRepeatComponent(action: IHighlightMessage): Map<string, IMessageHighlight> {
    let newState = Map<string, IMessageHighlight>();
    newState = newState.set(action.payload.segmentName, {
        fieldID: action.payload.fieldID,
        repeatID: action.payload.repeatID,
        componentID: action.payload.componentID,
        subComponentID: null
    });
    return newState;
}

function highlightRepeatSubComponent(action: IHighlightMessage): Map<string, IMessageHighlight> {
    let newState = Map<string, IMessageHighlight>();
    newState = newState.set(action.payload.segmentName, {
        fieldID: action.payload.fieldID,
        repeatID: action.payload.repeatID,
        componentID: action.payload.componentID,
        subComponentID: action.payload.subComponentID
    });
    return newState;
}
