import { Component, OnInit, Input } from '@angular/core';
import { HL7Field } from '../../../../../parser/hl7Field';
import { IMessageHighlight } from '../../../../states/states';
import { Map } from 'immutable';


@Component({
  selector: 'hls-message-repeat',
  templateUrl: './message-repeat.component.html',
  styleUrls: ['./message-repeat.component.scss']
})
export class MessageRepeatComponent implements OnInit {

  @Input() cIndex: number;
  @Input() fIndex: number;
  @Input() rIndex: number;
  @Input() repeat: HL7Field;
  @Input() segName: string;
  @Input() highlight: Map<string, IMessageHighlight>;

  constructor() { }

  ngOnInit() {
  }

  isHighlighted(segmentName, fieldIndex, repeatIndex) {
    if (this.highlight && this.highlight.has(segmentName) && this.highlight.get(segmentName).fieldID === fieldIndex
      && this.highlight.get(segmentName).repeatID === repeatIndex && this.highlight.get(segmentName).componentID == null) {
      return true;
    } else {
      return false;
    }
  }

}
