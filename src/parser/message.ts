import { Segment } from './segment';
import { ConvertTime } from './convertTime';

export class Message {
    Segments: Segment[] = [];
    MessageType: string;
    MessageControllerId: string;
    MessageDateTime: Date;
    isHighlighted: boolean;

    constructor(hl7message: string) {
        if (typeof(hl7message) !== 'undefined') { // TODO: Run message through validation before parsing.
            this.Parse(hl7message);
            if (this.Segments.length > 0 && this.Segments[0].Name === 'MSH') {
                this.MessageType = this.Segments[0].Fields[8].Value;
                this.MessageControllerId = this.Segments[0].Fields[9].Value;
                this.MessageDateTime = ConvertTime(this.Segments[0].Fields[6].Value);
            }
        }
    }

    Parse(message: string) {
        let segmentArray = message.split(/[\s](?=[A-Z][A-Z][A-Z,0-9][|])/);
        segmentArray.forEach((element, index) => {
            element = element.trim();
            this.Segments.push(new Segment(element));
        });
    }
}
