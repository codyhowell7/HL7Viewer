import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ContentChildren, QueryList } from '@angular/core';
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
  @Input() fieldDiscrepancies: Map<number, ISegmentDiscrepancies>;


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

  sendLineToBottom(index: number) {
    this.sendToBottom.emit(index);
  }
}

