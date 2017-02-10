import { WorkspaceMode } from '../enums/enums';
import { HL7Message } from '../../parser/hl7Message';

export interface IWorkspaceModeChangedPayload {
    mode: WorkspaceMode;
}

export interface IIdPayload {
    id: number;
}

export interface IMessageReceivedPayload extends IIdPayload {
    message: HL7Message;
}
export interface IAccordionToggledPayload extends IIdPayload {
    messageID: number;
    segmentID: number;
    toggleState: boolean;
}
