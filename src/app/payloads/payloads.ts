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

// export interface IAccordionToggledPayload {
//     messageID: number;
//     segment: Map<SegmentAccordion, boolean>;
// }

// export interface SegmentAccordion {
//     segmentID: number;
//     field: Map<FieldAccordion, boolean>;
// }

// export interface FieldAccordion {
//     fieldID: number;
//     component?: Map<ComponentAccordion, boolean>;
// }

// export interface ComponentAccordion {
//     componentID: number;
//     subComponent: boolean;
// }



export interface IAccordionToggledPayload extends IIdPayload {
    messageID: number;
    segmentID: number;
    toggleState: boolean;
}

export interface IFieldAccordionToggledPayload extends IIdPayload {
    segmentID: number;
    fieldID: number;
    toggleState: boolean;
}

export interface IComponentAccordionToggledPayload {
    fieldID: number;
    componentID: number;
    toggleState: boolean;
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
