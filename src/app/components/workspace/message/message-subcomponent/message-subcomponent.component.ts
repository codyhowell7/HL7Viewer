import { Component, OnInit, Input } from '@angular/core';
import { HL7SubComponent } from '../../../../../parser/hl7SubComponent';
import { IMessageHighlight } from '../../../../states/states';
import { Map } from 'immutable';

@Component({
  selector: 'hls-message-subcomponent',
  templateUrl: './message-subcomponent.component.html',
  styleUrls: ['./message-subcomponent.component.scss']
})
export class MessageSubcomponentComponent implements OnInit {

  @Input() subComponent: HL7SubComponent;
  @Input() scIndex: number;
  @Input() fIndex: number;
  @Input() cIndex: number;
  @Input() rIndex: number;
  @Input() segName: string;
  @Input() highlight: Map<string, IMessageHighlight>;

  constructor() { }

  ngOnInit() {
  }

  isHighlighted(segmentName, fieldIndex, componentIndex, subComponentIndex, repeatIndex) {
    if (!repeatIndex && this.highlight && this.highlight.has(segmentName)
      && this.highlight.get(segmentName).fieldID === fieldIndex
      && this.highlight.get(segmentName).componentID === componentIndex
      && this.highlight.get(segmentName).subComponentID - 1 === subComponentIndex) {
      return true;
    } else if (this.highlight && this.highlight.has(segmentName)
      && this.highlight.get(segmentName).fieldID === fieldIndex
      && this.highlight.get(segmentName).componentID === componentIndex
      && this.highlight.get(segmentName).subComponentID - 1 === subComponentIndex
      && this.highlight.get(segmentName).repeatID === repeatIndex) {
    } else {
      return false;
    }
  }

}
