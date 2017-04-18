import { WorkspaceMode } from '../enums/enums';
import { Map, List } from 'immutable';
import { HL7Message } from '../../parser/hl7Message';
import { IMessageDiscrepancies } from '../../messageReader/compareMessages/IMessageDiscrepancies';

export interface IAppState {

    currentMessage: number;
    messages: Map<number, IMessage>;
    menu: IMenuState;
    workspace: IWorkspaceState;
    accordion: IAccordion;
    searchConditions: ISearchConditions;
    searchConditionSize: Map<number, number>;
    searchFilter: Map<number, ISearchFilter>;
    messagesToCompare: Map<number, number>;
    discrepancies: IMessageDiscrepancies;
    jwt: string;
    findAll: IFindAll;
    findAllUnique: IUniqueFindAll;
    messageHighlight: Map<string, IMessageHighlight>;
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
    functionModifier: '' | 'Length';
}

export interface IFindAll {
    findAllResults: List<[number, string]>;
    uniqueSearch: string;
    searchValue: string;
}

export interface IUniqueFindAll {
    findAllResults: Map<string, number>;
}

export interface IMessageHighlight {
    fieldID: number;
    repeatID: number;
    componentID: number;
    subComponentID: number;
}

export interface ISearchFilter {
    searchTerm: string;
    includedInMess: boolean;
    searchConditions: string[];
    segmentSetID?: number;
}
