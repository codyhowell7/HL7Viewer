import { HL7Segment } from './hl7Segment';


export class HL7Message {
   hl7Segments: HL7Segment[] = [];
   hl7MessageType: string;
   hl7MessageControllerId: string;
   hl7MessageDateTime: Date;
   isHighlighted: boolean;

   constructor(private value: string) {  }
}
