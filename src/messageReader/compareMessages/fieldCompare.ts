import { HL7Segment } from '../../parser/HL7Segment';
import { Map } from 'immutable';
import {
    IMessageDiscrepancies, ISegmentDiscrepancies,
    IFieldDiscrepancies, IComponentDiscepancies, ISubComponentDiscrepancies
} from './IMessageDiscrepancies';

export class FieldCompare {

 public combFields(segment1: HL7Segment, segment2: HL7Segment): Map<number, IFieldDiscrepancies> {
        let fieldsSwapped: boolean;
        let fieldDiscrepancies = Map<number, IFieldDiscrepancies>();
        if (segment2.hl7Fields.length > segment1.hl7Fields.length) {
            let temp = segment1.hl7Fields;
            segment1.hl7Fields = segment2.hl7Fields;
            segment2.hl7Fields = temp;
            fieldsSwapped = true;
        }

        segment1.hl7Fields.filter(field => field.value !== '').forEach(field => {
            if (segment2.hl7Fields[field.index] == null) {
                fieldDiscrepancies = fieldDiscrepancies.set(field.index, {
                    components: Map<number, IComponentDiscepancies>(),
                    missing: true,
                    match: false
                });

            } else if (segment2.hl7Fields[field.index].value === segment1.hl7Fields[field.index].value) {
                fieldDiscrepancies = fieldDiscrepancies.set(field.index, {
                    components: Map<number, IComponentDiscepancies>(),
                    missing: false,
                    match: true
                });

            } else {
                if (!segment1.hl7Fields[field.index].hasHL7Components || !segment2.hl7Fields[field.index].hasHL7Components) {
                    fieldDiscrepancies = fieldDiscrepancies.set(field.index, {
                        components: Map<number, IComponentDiscepancies>(),
                        missing: false,
                        match: false
                    });

                } else {
                    fieldDiscrepancies = fieldDiscrepancies.set(field.index, {
                        components:  Map<number, IComponentDiscepancies>(),
                        missing: false,
                        match: false
                    });
                }
            }
        });

        segment2.hl7Fields.filter(field => field.value !== '').forEach(field => {
            if (segment1.hl7Fields[field.index] == null || segment1.hl7Fields[field.index].value === '') {
                fieldDiscrepancies = fieldDiscrepancies.set(field.index, {
                    components: Map<number, IComponentDiscepancies>(),
                    missing: true,
                    match: false
                });
            }
        });
        return fieldDiscrepancies;
    }
}