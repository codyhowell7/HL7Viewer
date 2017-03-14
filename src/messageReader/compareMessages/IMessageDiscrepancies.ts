import { Map } from 'immutable';

export interface IMessageDiscrepancies {
    message1: Map<number, ISegmentDiscrepancies>;
    message2: Map<number, ISegmentDiscrepancies>;
}

export interface ISegmentDiscrepancies {
    fields: Map<number, IFieldDiscrepancies>;
    missing: boolean;
    offset?: number;
}

export interface IFieldDiscrepancies {
    components?: Map<number, IComponentDiscepancies>;
    missing: boolean;
    match: boolean;
}

export interface IComponentDiscepancies {
    subComponents?: Map<number, ISubComponentDiscrepancies>;
    missing: boolean;
    match: boolean;
}

export interface ISubComponentDiscrepancies {
    missing: boolean;
    match: boolean;
}