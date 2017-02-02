import { HL7Segment } from './hl7Segment';


export class HL7Message {
   HL7Segments: HL7Segment[] = [];
   HL7MessageType: string;
   HL7MessageControllerId: string;
   HL7MessageDateTime: Date;
   isHighlighted: boolean;
   Value: string;

   constructor(hl7Message: string) {
      this.Value = hl7Message;
   }
}
