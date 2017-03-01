import { WorkspaceMode } from '../enums/enums';
import { HL7Message } from '../../parser/hl7Message';
import { HL7Segment } from '../../parser/hl7Segment';
import { Map } from 'immutable';
import { ISearchConditions } from  '../states/states';


export interface IWorkspaceModeChangedPayload {
    mode: WorkspaceMode;
}

export interface IIdPayload {
    id: number;
}

export interface IMessageReceivedPayload extends IIdPayload {
    message: HL7Message;
}

export interface IAccordionToggledPayload {
    messageID: number;
    segmentID: number;
    segmentToggleState: boolean;
    fieldID: number;
    fieldToggleState: boolean;
    fieldHasRepeat: boolean;
    repeatID: number;
    repeatToggleState: boolean;
    componentID: number;
    componentToggleState: boolean;
}

export interface IAddConditionPayload extends IIdPayload {
    conditionID: number;
    conditionGroupID: number;
    conditionGroupOperand: 'AND' | 'OR';
    searchOperand: 'AND' | 'OR';
    leftValue: string;
    rightValue: string;
    conditionOperand: '==' | '!=' | 'Like' | 'Contains' | '>' | '<' | '>=' | '<=';
    functionModifier: '' | 'Length' | 'Concat';
}

export interface IAddConditionGroupPayload extends IIdPayload {
    groupOperand: 'AND' | 'OR';
}

export interface ISaveSearchPayload {
    search: ISearchConditions;
    messageFilterMap: Map<number, boolean>;
}