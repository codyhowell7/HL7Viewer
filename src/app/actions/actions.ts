import { IWorkspaceModeChangedPayload, IMessageReceivedPayload, IIdPayload, IAccordionToggledPayload } from '../payloads/payloads';

export interface IAction {
    type: string;
    payload: {};
}

export interface ISwitchMessageAction extends IAction {
    payload: IIdPayload;
}

export interface IWorkspaceModeChangedAction extends IAction {
    payload: IWorkspaceModeChangedPayload;
}

export interface IRemoveMessageAction extends IAction {
    payload: IIdPayload;
}

export interface IMessageReceivedAction extends IAction {
    payload: IMessageReceivedPayload;
}

export interface IAccordionToggleAction extends IAction {
    payload: IAccordionToggledPayload;
}
