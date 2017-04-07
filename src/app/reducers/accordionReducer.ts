import { Map } from 'immutable';
import { IAccordion, ISegmentAccordion, IFieldAccordion, IRepeatFieldAccordion } from '../states/states';
import { IAction, IAccordionToggleAction } from '../actions/actions';
import {
    DEFAULT_STATE, TOGGLE_SEGMENT_ACCORDION, DEFAULT_SEGMENT_ACCORDIONS, DEFAULT_FIELD_ACCORDIONS, TOGGLE_FIELD_ACCORDION,
    DEFAULT_COMPONENT_ACCORDIONS, TOGGLE_COMPONENT_ACCORDION, DEFAULT_MESSAGE_ACCORDIONS, TOGGLE_REPEAT_FIELD_ACCORDION,
    DEFAULT_REPEAT_FIELD_ACCORDIONS, DEFAULT_REPEAT_COMPONENT_ACCORDIONS, TOGGLE_REPEAT_COMPONENT_ACCORDION, RESET_STATE
} from '../constants/constants';


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
            if (state != null) {
                return state;
            }
            return defaultAccordion();
        case RESET_STATE:
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