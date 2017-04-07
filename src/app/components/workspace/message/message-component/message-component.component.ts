import { Component, OnInit, Input } from '@angular/core';
import { HL7Component } from '../../../../../parser/hl7Component';
import { IMessageHighlight } from '../../../../states/states';
import { Map } from 'immutable';

@Component({
  selector: 'hls-message-component',
  templateUrl: './message-component.component.html',
  styleUrls: ['./message-component.component.scss']
})
export class MessageComponentComponent implements OnInit {

  @Input() component: HL7Component;
  @Input() cIndex: number;
  @Input() fIndex: number;
  @Input() segName: string;
  @Input() rIndex: number;
  @Input() highlight: Map<string, IMessageHighlight>;

  constructor() { }

  ngOnInit() {
  }

  isHighlighted(segmentName, fieldIndex, componentIndex, repeatIndex) {
    if (!repeatIndex && this.highlight && this.highlight.has(segmentName) && this.highlight.get(segmentName).fieldID === fieldIndex
      && this.highlight.get(segmentName).componentID === componentIndex && this.highlight.get(segmentName).subComponentID == null) {
      return true;
    } else if (repeatIndex && this.highlight && this.highlight.has(segmentName) && this.highlight.get(segmentName).fieldID === fieldIndex
      && this.highlight.get(segmentName).repeatID === repeatIndex && this.highlight.get(segmentName).componentID === componentIndex 
      && this.highlight.get(segmentName).subComponentID == null) {
        return true;
    } else {
      return false;
    }
  }

}
