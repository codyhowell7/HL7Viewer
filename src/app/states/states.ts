import { WorkspaceMode } from '../enums/enums';
import { Map } from 'immutable';
import { HL7Message } from '../../parser/hl7Message';

export interface IAppState {

    currentMessage: number;
    messages: Map<number, IMessage>;
    menu: IMenuState;
    workspace: IWorkspaceState;
    accordion: IAccordion;
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
}