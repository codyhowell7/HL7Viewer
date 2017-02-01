import { IWorkspaceModeChangedPayload } from '../payloads/payloads';

export interface IAction {
    type: string;
    payload: {};
}

export interface IWorkspaceModeChangedAction {
    type: string;
    payload: IWorkspaceModeChangedPayload;
}