import { Component, OnInit, Input } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { IAppState, IMessage } from '../../../../../states/states';
import { IMessageDiscrepancies, ISegmentDiscrepancies } from '../../../../../../messageReader/compareMessages/IMessageDiscrepancies';
import { Map } from 'immutable';

@Component({
  selector: 'hls-comparespace-field-highlighting',
  templateUrl: './comparespace-field-highlighting.component.html',
  styleUrls: ['./comparespace-field-highlighting.component.scss']
})
export class ComparespaceFieldHighlightingComponent implements OnInit {

  @Input() segmentIndex: number;
  @Input() discrepancies: Map<number, ISegmentDiscrepancies>;
  @Input() oppositeDiscrepancies: Map<number, ISegmentDiscrepancies>;
  @Input() messages: Map<number, IMessage>;
  @Input() messageID: number;
  @Input() fieldDiscrepancies: Map<number, ISegmentDiscrepancies>;

  constructor() { }

  ngOnInit() {  }

  getSegmentHeader(segmentIndex: number) {
    if (this.messages.get(this.messageID - 1).message.hl7Segments[segmentIndex] != null) {
      return this.messages.get(this.messageID - 1).message.hl7Segments[segmentIndex].segmentName;
    } else {
      return;
    }
  }

  getCorrectedIndex(segmentIndex: number) {
    let currentSlice = this.discrepancies.slice(0, segmentIndex);
    let missingLines = currentSlice.filter(current => current.missing === true).size;
    return segmentIndex - missingLines;
  }


  getFields(segmentIndex: number) {
    if (this.messages.get(this.messageID - 1).message.hl7Segments[segmentIndex] != null) {
      return this.messages.get(this.messageID - 1).message.hl7Segments[segmentIndex].hl7Fields;
    } else {
      return;
    }
  }

  fieldNoMatchMissing(segmentIndex: number, fieldIndex: number) {

    if (this.fieldDiscrepancies.get(segmentIndex).fields.get(fieldIndex) != null) {
      return (this.fieldDiscrepancies.get(segmentIndex).fields.get(fieldIndex).match);
    } else {
      return false;
    }
  }

  addPipeBeforeCheck(segmentIndex: number, fieldId: number) {
    if (fieldId < 2 && segmentIndex === 0) {
      return false;
    } else if (fieldId >= 2 && segmentIndex > 0) {
      return true;
    } else {
      return true;
    }
  }

}
