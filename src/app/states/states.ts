import { WorkspaceMode } from '../enums/enums';
import { Map } from 'immutable';
import { HL7Message } from '../../parser/hl7Message';

export interface IAppState {

    currentMessage: number;
    messages: Map<number, IMessage>;
    menu: IMenuState;
    workspace: IWorkspaceState;
    segmentOffset: Map<number, number>;
    fieldOffset: Map<number, number>;
    componentOffset: Map<number, number>;
    accordion: Map<number, Map<number, boolean>>;
    fieldAccordion: Map<number, Map<number, boolean>>;
    componentAccordion: Map<number, Map<number, boolean>>;
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
