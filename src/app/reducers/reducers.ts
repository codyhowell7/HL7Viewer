import { IMenuState, IWorkspaceState } from '../states/states';
import { IAction, IWorkspaceModeChangedAction } from '../actions/actions';
import { DEFAULT_STATE, MODE_CHANGED } from '../constants/constants';
import { WorkspaceMode } from '../enums/enums';
import { IWorkspaceModeChangedPayload } from '../payloads/payloads';

export function reduceMenu(state: IMenuState, action: IAction): IMenuState {
    
    switch(action.type){
        case DEFAULT_STATE:
            return getMenuDefaultState();
        default:
            return state;
    }
}

function getMenuDefaultState(): IMenuState{
    return {};
}

export function reduceWorkspace(state: IWorkspaceState, action: IAction): IWorkspaceState {
    
    switch(action.type){
        case DEFAULT_STATE:
            return getWorkspaceDefaultState();
        case MODE_CHANGED:
            return getWorkspaceOnModeChange(action as IWorkspaceModeChangedAction);
        default:
            return state;
    }
}

function getWorkspaceDefaultState(): IWorkspaceState {
    return {
        workspaceMode: WorkspaceMode.messages
    }
}

function getWorkspaceOnModeChange(action: IWorkspaceModeChangedAction): IWorkspaceState {
    return {
        workspaceMode: action.payload.mode
    }
}