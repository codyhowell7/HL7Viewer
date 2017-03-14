import { Component, OnInit, Input } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { IAppState, IMessage } from '../../../../../states/states';
import { IMessageDiscrepancies, ISegmentDiscrepancies } from '../../../../../../messageReader/compareMessages/IMessageDiscrepancies';

@Component({
  selector: 'hls-comparespace-segment-highlighting',
  templateUrl: './comparespace-segment-highlighting.component.html',
  styleUrls: ['./comparespace-segment-highlighting.component.scss']
})
export class ComparespaceSegmentHighlightingComponent implements OnInit {
  @Input() leftSide: boolean;
  @Input() segmentIndex: number;
  @Input() segmentDiscrep: ISegmentDiscrepancies;

  @select(['discrepancies']) discrepancies$: Observable<IMessageDiscrepancies>;
  @select(['messages']) messages$: Observable<Map<number, IMessage>>;
  @select(['messagesToCompare']) messagesToCompare$: Observable<Map<number, number>>;

  discrepancies: IMessageDiscrepancies;
  leftSideID: number;
  rightSideID: number;
  messages: Map<number, IMessage>;

  constructor() { }

  ngOnInit() {
    this.messages$.subscribe(messages => this.messages = messages);
    this.discrepancies$.subscribe(discrep => this.discrepancies = discrep);
    this.messagesToCompare$.subscribe(messagesToCompare => {
      this.leftSideID = messagesToCompare.get(0) - 1;
      this.rightSideID = messagesToCompare.get(1) - 1;
    });
  }

  missingSegment(segDiscrep: ISegmentDiscrepancies) {
    return segDiscrep.missing;
  }

  leftSideMissing(rightIndex: number) {
    return this.discrepancies.message1.get(rightIndex).missing;
  }

  rightSideMissing(leftIndex: number) {
    return this.discrepancies.message2.get(leftIndex).missing;
  }

  getLeftCorrectedIndex(index: number) {
    let currentSlice = this.discrepancies.message1.slice(0, index);
    let missingLines = currentSlice.filter(current => current.missing === true).size;
    return index - missingLines;
  }

  getRightCorrectedIndex(index: number) {
    let currentSlice = this.discrepancies.message2.slice(0, index);
    let missingLines = currentSlice.filter(current => current.missing === true).size;
    return index - missingLines;
  }

  getSegment(index: number) {
    if (this.messages.get(this.leftSideID).message.hl7Segments[index] != null && this.leftSide === true) {
      return this.messages.get(this.leftSideID).message.hl7Segments[index].value;
    } else if (this.messages.get(this.rightSideID).message.hl7Segments[index] != null) {
      return this.messages.get(this.rightSideID).message.hl7Segments[index].value;
    }
  }
}
