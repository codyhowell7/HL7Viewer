import {
    IWorkspaceModeChangedPayload, IMessageReceivedPayload, ISaveSearchPayload,
    IIdPayload, IAccordionToggledPayload, IAddConditionPayload, IAddConditionGroupPayload,
    ISaveLeftComparePayload, ISaveRightComparePayload, IDiscrepancyPayload, IJWTPayload, IFindAllPayload,
    IFindAllUniquePayload, IAllMessageReceivedPayload, IHighlightMessagePayload, ICreateSearchBySizePayload,
    IAddSearchSizePayload, IAddToCopyListPayload
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

export interface IAllMessageReceivedAction extends IAction {
    payload: IAllMessageReceivedPayload;
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

export interface ISaveFindAll extends IAction {
    payload: IFindAllPayload;
}

export interface ISaveFindAllUnique extends IAction {
    payload: IFindAllUniquePayload;
}

export interface IHighlightMessage extends IAction {
    payload: IHighlightMessagePayload;
}

export interface ICreateSearchBySize extends IAction {
    payload: ICreateSearchBySizePayload;
}

export interface IAddSearchSize extends IAction {
    payload: IAddSearchSizePayload;
}

export interface IAddToCopy extends IAction {
    payload: IAddToCopyListPayload;
}


