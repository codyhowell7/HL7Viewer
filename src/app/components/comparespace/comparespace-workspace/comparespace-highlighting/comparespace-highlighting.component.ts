import { Component, OnInit, Input } from '@angular/core';
import { HL7Message } from '../../../../../parser/hl7Message';
import { HL7Segment } from '../../../../../parser/hl7Segment';
import { IMessageDiscrepancies, ISegmentDiscrepancies } from '../../../../../messageReader/compareMessages/IMessageDiscrepancies';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { IAppState, IMessage } from '../../../../states/states';
import { Map } from 'immutable';
import { SAVE_LEFT, SAVE_RIGHT } from '../../../../constants/constants';

@Component({
  selector: 'hls-comparespace-highlighting',
  templateUrl: './comparespace-highlighting.component.html',
  styleUrls: ['./comparespace-highlighting.component.scss']
})
export class ComparespaceHighlightingComponent implements OnInit {

  @select(['discrepancies']) discrepancies$: Observable<IMessageDiscrepancies>;
  @select(['messages']) messages$: Observable<Map<number, IMessage>>;
  @select(['messagesToCompare']) messagesToCompare$: Observable<Map<number, number>>;

  @Input() leftSide: boolean;

  discrepancies: IMessageDiscrepancies;
  messages: Map<number, IMessage>;
  messagesToCompare: Map<number, number>;
  checked = Map<ISegmentDiscrepancies, boolean>();

  constructor(private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
    this.discrepancies$.subscribe(discrep => this.discrepancies = discrep);
    this.messages$.subscribe(messages => this.messages = messages);
    this.messagesToCompare$.subscribe(messagesToCompare => this.messagesToCompare = messagesToCompare);
  }

  getM1DiscrepSize() {
    return this.discrepancies.message1.valueSeq().size;
  }

  getM2DiscrepSize() {
    return this.discrepancies.message2.valueSeq().size;
  }

  getM1Discrep() {
    return this.discrepancies.message1.valueSeq();
  }

  getM2Discrep() {
    return this.discrepancies.message2.valueSeq();
  }

  missingSegment(segDiscrep: ISegmentDiscrepancies) {
    return segDiscrep.missing;
  }

  leftSideMissing(rightIndex: number) {
    return this.getM1Discrep().get(rightIndex).missing;
  }

  rightSideMissing(leftIndex: number) {
    return this.getM2Discrep().get(leftIndex).missing;
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

  getFullLeftMessage() {
    let lineBreak: string[] = [];
    lineBreak = this.messages.get(this.messagesToCompare.get(0) - 1).message.hl7CorrectedMessage.split(/(?:\r\n|\r|\n)/g);
    return lineBreak;
  }

  getFullRightMessage() {
    let lineBreak: string[] = [];
    lineBreak = this.messages.get(this.messagesToCompare.get(1) - 1).message.hl7CorrectedMessage.split(/(?:\r\n|\r|\n)/g);
    return lineBreak;
  }


  getSegment(index: number, sideIndex: 0 | 1) {
    if (this.messages.get(this.messagesToCompare.get(sideIndex) - 1).message.hl7Segments[index] != null) {
      return this.messages.get(this.messagesToCompare.get(sideIndex) - 1).message.hl7Segments[index].value;
    } else {
      return;
    }
  }

  getSegmentHeader(index: number, sideIndex: 0 | 1) {
    if (this.messages.get(this.messagesToCompare.get(sideIndex) - 1).message.hl7Segments[index] != null) {
      return this.messages.get(this.messagesToCompare.get(sideIndex) - 1).message.hl7Segments[index].segmentName;
    } else {
      return;
    }
  }

  getFields(segmentIndex: number, sideIndex: 0 | 1) {
    if (this.messages.get(this.messagesToCompare.get(sideIndex) - 1).message.hl7Segments[segmentIndex] != null) {
      return this.messages.get(this.messagesToCompare.get(sideIndex) - 1).message.hl7Segments[segmentIndex].hl7Fields;
    } else {
      return;
    }
  }

  fieldNoMatchMissing(segIndex: number, fieldIndex: number) {
    if (this.getM1Discrep().get(segIndex).fields.get(fieldIndex) != null) {
      return (this.getM1Discrep().get(segIndex).fields.get(fieldIndex).match);
    } else {
      return false;
    }
  }

  addPipeBeforeCheck(fieldId: number, segId: number) {
    if (fieldId < 2 && segId === 0  ) {
      return false;
    } else if (fieldId >= 2 && segId > 0) {
      return true;
    } else {
      return true;
    }
  }



}
