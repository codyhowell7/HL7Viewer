import { Component, OnInit, Input } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { IAppState, IMessage } from '../../../../../states/states';
import { IMessageDiscrepancies } from '../../../../../../messageReader/compareMessages/IMessageDiscrepancies';

@Component({
  selector: 'hls-comparespace-field-highlighting',
  templateUrl: './comparespace-field-highlighting.component.html',
  styleUrls: ['./comparespace-field-highlighting.component.scss']
})
export class ComparespaceFieldHighlightingComponent implements OnInit {

  @Input() leftSide: boolean;
  @Input() segmentIndex: number;

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

  getSegmentHeader(segmentIndex: number) {
    if (this.messages.get(this.leftSideID).message.hl7Segments[segmentIndex] != null && this.leftSide === true) {
      return this.messages.get(this.leftSideID).message.hl7Segments[segmentIndex].segmentName;
    } else if (this.messages.get(this.rightSideID).message.hl7Segments[segmentIndex] != null) {
      return this.messages.get(this.rightSideID).message.hl7Segments[segmentIndex].segmentName;
    }
  }

  getLeftCorrectedIndex(segmentIndex) {
    let currentSlice = this.discrepancies.message1.slice(0, segmentIndex);
    let missingLines = currentSlice.filter(current => current.missing === true).size;
    return segmentIndex - missingLines;
  }

  getRightCorrectedIndex(segmentIndex) {
    let currentSlice = this.discrepancies.message2.slice(0, segmentIndex);
    let missingLines = currentSlice.filter(current => current.missing === true).size;
    return segmentIndex - missingLines;
  }

  getFields(segmentIndex: number) {
    if (this.messages.get(this.leftSideID).message.hl7Segments[segmentIndex] != null && this.leftSide === true) {
      return this.messages.get(this.leftSideID).message.hl7Segments[segmentIndex].hl7Fields;
    } else if (this.messages.get(this.rightSideID).message.hl7Segments[segmentIndex] != null) {
      return this.messages.get(this.rightSideID).message.hl7Segments[segmentIndex].hl7Fields;
    }
  }

  fieldNoMatchMissing(segmentIndex: number, fieldIndex: number) {
    if (this.discrepancies.message1.get(segmentIndex).fields.get(fieldIndex) != null) {
      return (this.discrepancies.message1.get(segmentIndex).fields.get(fieldIndex).match);
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
