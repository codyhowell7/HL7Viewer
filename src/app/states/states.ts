import { WorkspaceMode } from '../enums/enums';
import { Map, List } from 'immutable';
import { HL7Message } from '../../parser/hl7Message';

export interface IAppState {

    currentMessage: number;
    messages: Map<number, IMessage>;
    menu: IMenuState;
    workspace: IWorkspaceState;
    accordion: IAccordion;
    searchConditions: ISearchConditions;
    searchConditionSize: Map<number, number>;
    searchFilter: Map<number, boolean>;
    messagesToCompare: Map<number, number>;
}

export interface IMenuState { }

export interface IMessage {
    id: number;
    message: HL7Message;
    deleted: boolean;
}

export interface IWorkspaceState {
    workspaceMode: WorkspaceMode;
}

export interface IAccordion {
    segment: Map<number, Map<number, ISegmentAccordion>>;
}

export interface ISegmentAccordion {
    segmentAccordionState: boolean;
    field?: Map<number, IFieldAccordion>;
}

export interface IFieldAccordion {
    fieldAccordionState: boolean;
    component?: Map<number, boolean>;
    repeatField?: Map<number, IRepeatFieldAccordion>;
}
export interface IRepeatFieldAccordion {
    repeatFieldAccordionState: boolean;
    repeatComponent?: Map<number, boolean>;
}
export interface ISearchConditions {
    conditionGroups: Map<number, IConditionGroup>;
    searchOperand: 'AND' | 'OR';
}

export interface IConditionGroup {
    conditions: Map<number, ICondition>;
    groupOperand: 'AND' | 'OR';
    groupID: number;
}

export interface ICondition {
    conditionID: number;
    leftValue: string;
    rightValue: string;
    conditionOperand: '==' | '!=' | 'Like' | 'Contains' | '>' | '<' | '>=' | '<=';
    functionModifier: '' | 'Length' | 'Concat';
}