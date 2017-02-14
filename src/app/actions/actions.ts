import {
    IWorkspaceModeChangedPayload, IMessageReceivedPayload,
    IIdPayload, IAccordionToggledPayload, IFieldAccordionToggledPayload, IFieldOffsetPayload,
    ISegmentOffsetPayload, IComponentOffsetPayload
} from '../payloads/payloads';

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

export interface IFieldAccordionToggleaction extends IAction {
    payload: IFieldAccordionToggledPayload;
}

export interface ISegmentOffsetAction extends IAction {
    payload: ISegmentOffsetPayload;
}

export interface IFieldOffsetAction extends IAction {
    payload: IFieldOffsetPayload;
}
export interface IComponentOffsetAction extends IAction {
    payload: IComponentOffsetPayload;
}
