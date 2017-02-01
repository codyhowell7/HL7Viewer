import { WorkspaceMode } from '../enums/enums';

export interface IAppState {

    menu: IMenuState;
    workspace: IWorkspaceState;
}

export interface IMenuState { }

export interface IWorkspaceState {
    
    workspaceMode: WorkspaceMode;
}