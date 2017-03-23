import {
    IWorkspaceModeChangedPayload, IMessageReceivedPayload, ISaveSearchPayload,
    IIdPayload, IAccordionToggledPayload, IAddConditionPayload, IAddConditionGroupPayload,
    ISaveLeftComparePayload, ISaveRightComparePayload, IDiscrepancyPayload, IJWTPayload
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

export interface IAddConditionGroup extends IAction {
    payload: IAddConditionPayload;
}

export interface IAddToConidtionSize extends IAction { }

export interface IAddSearchResults extends IAction {
    payload: ISaveSearchPayload;
}

export interface ISaveLeftCompareArea extends IAction {
    payload: ISaveLeftComparePayload;
}

export interface ISaveRightCompareArea extends IAction {
    payload: ISaveRightComparePayload;
}

export interface ISaveDiscrepancies extends IAction {
    payload: IDiscrepancyPayload;
}

export interface ISaveJWT extends IAction {
    payload: IJWTPayload;
}



