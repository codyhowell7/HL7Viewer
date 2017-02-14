import { WorkspaceMode } from '../enums/enums';
import { HL7Message } from '../../parser/hl7Message';
import { HL7Segment } from '../../parser/hl7Segment';

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

export interface IFieldAccordionToggledPayload extends IIdPayload {
    segmentID: number;
    fieldID: number;
    toggleState;
}

export interface ISegmentOffsetPayload {
    messageID: number;
    segmentIdOffset: number;
}

export interface IFieldOffsetPayload {
    segmentID: number;
    fieldIdOffset: number;
}

export interface IComponentOffsetPayload {
    fieldID: number;
    componentIdOffset: number;
}
