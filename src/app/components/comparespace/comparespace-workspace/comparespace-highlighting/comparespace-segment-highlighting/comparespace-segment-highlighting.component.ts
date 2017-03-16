import { Component, OnInit, Input } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { IAppState, IMessage } from '../../../../../states/states';
import { IMessageDiscrepancies, ISegmentDiscrepancies } from '../../../../../../messageReader/compareMessages/IMessageDiscrepancies';
import { Map } from 'immutable';

@Component({
  selector: 'hls-comparespace-segment-highlighting',
  templateUrl: './comparespace-segment-highlighting.component.html',
  styleUrls: ['./comparespace-segment-highlighting.component.scss']
})
export class ComparespaceSegmentHighlightingComponent implements OnInit {

  @Input() segmentIndex: number;
  @Input() discrepancies: Map<number, ISegmentDiscrepancies>;
  @Input() oppositeDiscrepancies: Map<number, ISegmentDiscrepancies>;
  @Input() messages: Map<number, IMessage>;
  @Input() messageID: number;

  constructor() { }

  ngOnInit() { }

  getSegmentDiscrep() {
    return this.discrepancies.get(this.segmentIndex);
  }

  missingSegment(segDiscrep: ISegmentDiscrepancies) {
    return segDiscrep.missing;
  }

  oppositeSideMissing(index: number) {
    return this.oppositeDiscrepancies.get(index).missing;
  }

  getCorrectedIndex(index: number) {
    let currentSlice = this.discrepancies.slice(0, index);
    let missingLines = currentSlice.filter(current => current.missing === true).size;
    return index - missingLines;
  }

  getSegment(index: number) {
    if (this.messages.get(this.messageID - 1).message.hl7Segments[index] != null) {
      return this.messages.get(this.messageID - 1).message.hl7Segments[index].value;
    } else {
      return;
    }
  }
}
