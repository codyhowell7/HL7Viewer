import { WorkspaceMode } from '../enums/enums';
import { Map } from 'immutable';

export interface IAppState {

    currentMessage: number;
    messages: Map<number, IMessage>
    menu: IMenuState;
    workspace: IWorkspaceState;
}

export interface IMenuState { }

export interface IMessage {
    id: number;
    messageText: string;
    deleted: boolean;
}

export interface IWorkspaceState {
    workspaceMode: WorkspaceMode;
}