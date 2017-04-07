import { Component, OnInit, Input } from '@angular/core';
import { HL7Segment } from '../../../../../parser/hl7Segment';
import { IMessageHighlight } from '../../../../states/states';
import { Map } from 'immutable';

@Component({
  selector: 'hls-message-segment',
  templateUrl: './message-segment.component.html',
  styleUrls: ['./message-segment.component.scss']
})
export class MessageSegmentComponent implements OnInit {

  @Input() segment: HL7Segment;
  @Input() sIndex: number;
  @Input() highlight: Map<string, IMessageHighlight>;

  constructor() { }

  ngOnInit() {
  }

  correctIndex(segmentIndex, fieldIndex) {
    return segmentIndex !== 0 || fieldIndex > 0;
  }

  controlChars(segmentIndex, fieldIndex) {
    return segmentIndex === 0 && fieldIndex === 1;
  }

  isHightlighted(segmentName, fieldIndex) {
    if (this.highlight.has(segmentName) && this.highlight.get(segmentName).fieldID === fieldIndex &&
      this.highlight.get(segmentName).componentID == null) {
      return true;
    } else {
      return false;
    }
  }
}
