import {
    IWorkspaceModeChangedPayload, IMessageReceivedPayload, ISaveSearchPayload,
    IIdPayload, IAccordionToggledPayload, IAddConditionPayload, IAddConditionGroupPayload
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

// export interface IFieldAccordionToggleaction extends IAction {
//     payload: IFieldAccordionToggledPayload;
// }

// export interface IComponentAccordionToggleAction extends IAction {
//     payload: IComponentAccordionToggledPayload;
// }

// export interface ISegmentOffsetAction extends IAction {
//     payload: ISegmentOffsetPayload;
// }

// export interface IFieldOffsetAction extends IAction {
//     payload: IFieldOffsetPayload;
// }
// export interface IComponentOffsetAction extends IAction {
//     payload: IComponentOffsetPayload;
// }
