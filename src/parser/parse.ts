import { HL7Message } from './message';
import { HL7Segment } from './segment';
import { HL7Field } from './field';
import { HL7Component } from './hl7Component';
import { HL7SubComponent } from './hl7SubComponent';
import { ConvertTime } from './convertTime';
import * as moment from 'moment';


export class Parser {
   fieldSeparator: string;
   componentSeparator: string;
   fieldRepetitionSeparator: string;
   subcomponentSeparator: string;

   private setSeparators(messageEncodingChars: string) {
      this.fieldSeparator = messageEncodingChars.substr(0, 1);
      this.componentSeparator = messageEncodingChars.substr(1, 1);
      this.fieldRepetitionSeparator = messageEncodingChars.substr(2, 1);
      this.subcomponentSeparator = messageEncodingChars.substr(4, 1);
      //TODO: 
      //set field, component, repetition, subcomponent separators here
   }

   public parseHL7Message(strMessage: string) {
      let hl7Message: HL7Message = new HL7Message(strMessage);
      let separators: string = strMessage.substr(3, 5);
      this.setSeparators(separators);

      let segmentSplitter = new RegExp('[\\s](?=[A-Z][A-Z][A-Z,0-9][\\' + this.fieldSeparator + '])');
      let segmentArray = strMessage.split(segmentSplitter);
      segmentArray.forEach(segmentElement => {
         segmentElement = segmentElement.trim();
         hl7Message.HL7Segments.push(this.parseHL7Segment(segmentElement));
      });

      if (hl7Message.HL7Segments.length > 0 && hl7Message.HL7Segments[0].Name === 'MSH') {
         hl7Message.HL7MessageType = hl7Message.HL7Segments[0].HL7Fields[8].Value;
         hl7Message.HL7MessageControllerId = hl7Message.HL7Segments[0].HL7Fields[9].Value;
         hl7Message.HL7MessageDateTime = ConvertTime(hl7Message.HL7Segments[0].HL7Fields[6].Value);
      }

      return hl7Message;
   }

   private parseHL7Segment(segmentValue: string) {
      let hl7Segment: HL7Segment = new HL7Segment(segmentValue);
      hl7Segment.Name = segmentValue.substr(0, 3);

      let fieldSplitter = new RegExp('[\\' + this.fieldSeparator + ']');
      let fieldArray = segmentValue.split(fieldSplitter).slice(1);
      if (segmentValue.substring(0, 3) === 'MSH') {
         fieldArray.unshift(this.fieldSeparator);
      }
      fieldArray.forEach((fieldElement, fieldIndex) => {
         hl7Segment.HL7Fields.push(this.parseHL7Field(fieldElement, fieldIndex + 1));
      });

      return hl7Segment;
   }

   private parseHL7Field(fieldValue: string, fieldIndex: number) {
      let hl7Field: HL7Field = new HL7Field(fieldValue, fieldIndex);
      let repetitionSplitter = new RegExp('[\\' + this.fieldRepetitionSeparator + ']');

      let repetitionArray = fieldValue.split(repetitionSplitter);
      if (repetitionArray.length > 1) { // Only pushes to repeatArray when a ~ is found.
         //if (fieldValue !== this.messageEncodingChars.substr(1)) {TODO: need to understand this
         repetitionArray.forEach((repeatElement, repeatIndex) => {
            hl7Field.HL7RepeatedFields.push(this.parseHL7Field(repeatElement, repeatIndex + 1));
         });
         //}
      } else {
         let componentSplitter = new RegExp('[\\' + this.componentSeparator + ']');
         let hl7ComponentArray = fieldValue.split(componentSplitter);
         if (hl7ComponentArray.length > 1) {
            hl7ComponentArray.forEach((hl7ComponentElement, hl7ComponentIndex) => {
               hl7Field.HL7Components.push(new HL7Component(hl7ComponentElement, hl7ComponentIndex + 1));
            });
         }
      }
      hl7Field.HasRepetition = hl7Field.HL7RepeatedFields.length > 0;
      hl7Field.HasHL7Components = hl7Field.HL7Components.length > 0;
      return hl7Field;
   }

   private parseHL7Component(componentValue: string, componentIndex: number) {
      let hl7Component: HL7Component = new HL7Component(componentValue, componentIndex);
      let subComponentSplitter = new RegExp('[\\' + this.subcomponentSeparator + ']');
      let subComponentArray = componentValue.split(subComponentSplitter);
      if (subComponentArray.length > 1) {
         subComponentArray.forEach((hl7SubComponentElement, hl7SubComponentIndex) => {
            hl7Component.HL7SubComponents.push(new HL7SubComponent(hl7SubComponentElement, hl7SubComponentIndex + 1));
         });
      }
      hl7Component.HasSubComponents = hl7Component.HL7SubComponents.length > 1;
      return hl7Component;
   }
}
