import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
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
  @Output() sendToBottom = new EventEmitter();

  @Input() discrepancies: Map<number, ISegmentDiscrepancies>;
  @Input() messageID: number;
  @Input() messages: Map<number, IMessage>;
  @Input() oppositeDiscrepancies: Map<number, ISegmentDiscrepancies>;

  constructor(private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() { }

  getDiscrepSize() {
    return this.discrepancies.valueSeq().size;
  }

  getDiscrep() {
    return this.discrepancies.valueSeq();
  }

  missingSegment(segDiscrep: ISegmentDiscrepancies) {
    return segDiscrep.missing;
  }

  getFullMessage() {
    let lineBreak: string[] = [];
    lineBreak = this.messages.get(this.messageID - 1).message.hl7CorrectedMessage.split(/(?:\r\n|\r|\n)/g);
    return lineBreak;
  }

  oppositeSideMissing(index: number) {
    return this.oppositeDiscrepancies.get(index).missing;
  }

  getCorrectedIndex(index: number) {
    let currentSlice = this.discrepancies.slice(0, index);
    let missingLines = currentSlice.filter(current => current.missing === true).size;
    let oppositeSlice = this.oppositeDiscrepancies.slice(0, index);
    let oppositeMissingLines = oppositeSlice.filter(opposite => opposite.missing === true).size;
    return [index - missingLines, index - oppositeMissingLines];
  }

  sendLineToBottom(index: number) {
    this.sendToBottom.emit(index);
  }
}

