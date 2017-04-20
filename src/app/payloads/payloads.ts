import { WorkspaceMode } from '../enums/enums';
import { HL7Message } from '../../parser/hl7Message';
import { HL7Segment } from '../../parser/hl7Segment';
import { Map, List } from 'immutable';
import { ISearchConditions, IMessage, ISearchFilter } from  '../states/states';
import { IMessageDiscrepancies } from '../../messageReader/compareMessages/IMessageDiscrepancies';


export interface IWorkspaceModeChangedPayload {
    mode: WorkspaceMode;
}

export interface IIdPayload {
    id: number;
}

export interface IMessageReceivedPayload extends IIdPayload {
    message: HL7Message;
}

export interface IAllMessageReceivedPayload {
    messages: Map<number, IMessage>;
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
    functionModifier: '' | 'Length';
}

export interface IAddConditionGroupPayload extends IIdPayload {
    groupOperand: 'AND' | 'OR';
}

export interface ISaveSearchPayload {
    search: ISearchConditions;
    messageFilterMap: Map<number, ISearchFilter>;
}

export interface ISaveLeftComparePayload {
    leftArea: number;
}

export interface ISaveRightComparePayload {
    rightArea: number;
}

export interface IDiscrepancyPayload {
    discrepancies: IMessageDiscrepancies;
}

export interface IJWTPayload {
    JWT: string;
}

export interface IFindAllPayload {
    FindAllSearch: List<[number, string]>;
    uniqueSearch: string;
    searchValue: string;
}

export interface IFindAllUniquePayload {
    FindAllSearchUnique: Map<string, number>;
}

export interface IHighlightMessagePayload {
    segmentName: string;
    fieldID: number;
    repeatID?: number;
    componentID?: number;
    subComponentID?: number;
}

export interface ICreateSearchBySizePayload {
    messageSize: number;
}

export interface IAddSearchSizePayload {
    searchId: number;
}

export interface IAddToCopyListPayload {
    hl7Message: string;
    messageId: number;
}
