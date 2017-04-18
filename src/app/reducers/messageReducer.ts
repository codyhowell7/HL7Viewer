import { Map } from 'immutable';
import { IMessage } from '../states/states';
import { IAction, ISwitchMessageAction, IMessageReceivedAction, IRemoveMessageAction, IAllMessageReceivedAction } from '../actions/actions';
import {
    DEFAULT_STATE, SWITCH_MESSAGE, ADD_MESSAGE, REMOVE_MESSAGE, MESSAGE_RECEIVED, RESET_STATE,
    All_MESSAGE_RECEIVED
} from '../constants/constants';
import { HL7Message } from '../../parser/hl7Message';


export function reduceCurrentMessage(state: number, action: IAction): number {

    switch (action.type) {
        case SWITCH_MESSAGE:
            return (action as ISwitchMessageAction).payload.id;
        case DEFAULT_STATE:
            if (state != null) {
                return state;
            }
            return 0;
        case RESET_STATE:
            return 0;
        default:
            return state;
    }
}

export function reduceMessages(state: Map<number, IMessage>, action: IAction): Map<number, IMessage> {

    switch (action.type) {
        case ADD_MESSAGE:
            return addMessage(state, action as IMessageReceivedAction);
        case REMOVE_MESSAGE:
            return removeMessage(state, action as IRemoveMessageAction);
        case MESSAGE_RECEIVED:
            return messageReceived(state, action as IMessageReceivedAction);
        case All_MESSAGE_RECEIVED:
            return allMessageReceived(state, action as IAllMessageReceivedAction)
        case DEFAULT_STATE:
            if (state != null) {
                return state;
            }
            return getMessageDefaultState();
        case RESET_STATE:
            return getMessageDefaultState();
        default:
            return state;
    }
}

function allMessageReceived(state: Map<number, IMessage>, action: IAllMessageReceivedAction): Map<number, IMessage> {
    return action.payload.messages;
}

function messageReceived(state: Map<number, IMessage>, action: IMessageReceivedAction): Map<number, IMessage> {
    return state.set(action.payload.id, {
        id: action.payload.id,
        deleted: false,
        message: action.payload.message
    });
}

function addMessage(state: Map<number, IMessage>, action: IMessageReceivedAction): Map<number, IMessage> {
    let returnMessage;
    if (typeof (action.payload.message.hl7CorrectedMessage) !== 'undefined') {
        returnMessage = state.set(state.size, {
            id: state.size,
            message: action.payload.message,
            deleted: false
        });
    } else {
        returnMessage = state.set(state.size, {
            id: state.size,
            message: new HL7Message(''),
            deleted: false
        });
    }
    return returnMessage;

}

function removeMessage(state: Map<number, IMessage>, action: IRemoveMessageAction): Map<number, IMessage> {

    let current = state.get(action.payload.id);

    return state.set(action.payload.id, {
        id: current.id,
        deleted: true,
        message: current.message
    });
}

function getMessageDefaultState(): Map<number, IMessage> {

    return Map<number, IMessage>().set(0, {
        id: 0,
        message: new HL7Message(''),
        deleted: false
    });
}
