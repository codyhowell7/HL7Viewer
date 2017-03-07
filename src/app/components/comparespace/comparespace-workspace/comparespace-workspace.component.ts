import { Component, Input, OnInit } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { Map } from 'immutable';
import { SAVE_COMPARE } from '../../../constants/constants';
import { IAppState, IMessage } from '../../../states/states';
import { MessageCompare } from '../../../../messageReader/messageCompare';
import { IMessageDiscrepancies, ISegmentDiscrepancies } from '../../../../messageReader/IMessageDiscrepancies';

@Component({
  selector: 'hls-comparespace-workspace',
  templateUrl: './comparespace-workspace.component.html',
  styleUrls: ['./comparespace-workspace.component.scss']
})
export class ComparespaceWorkspaceComponent implements OnInit {

  @select(['messagesToCompare']) messagesToCompare$: Observable<Map<number, number>>;
  @select(['messages']) messages$: Observable<Map<number, IMessage>>;

  messagesToCompare = Map<number, number>();
  messages: Map<number, IMessage>;
  dropArea1: number = 0;
  dropArea2: number = 0;
  divScrollLeft: any;
  discrep: IMessageDiscrepancies = { message1: Map<number, ISegmentDiscrepancies>(), message2: Map<number, ISegmentDiscrepancies>() }

  constructor(private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
    this.messagesToCompare$.subscribe(compare => this.messagesToCompare = compare);
    this.messages$.subscribe(messages => this.messages = messages);

    this.dropArea1 = this.messagesToCompare.get(1);
    this.dropArea2 = this.messagesToCompare.get(2);
  }

  getLeftCompare(messageId: number) {
    return this.messagesToCompare.get(1);
  }

  getRightCompare(messageId: number) {
    return this.messagesToCompare.get(2);
  }

  getMessage(messageId: number) {
    messageId = messageId - 1;
    return this.messages.get(messageId).message.hl7CorrectedMessage;
  }

  onScroll(eventScrollLeft) {
    this.divScrollLeft = eventScrollLeft;
  }

  saveLeftCompare(messageId: number) {
    this.messagesToCompare = this.messagesToCompare.set(1, messageId);
  }

  saveRightCompare(messageId: number) {
    this.messagesToCompare = this.messagesToCompare.set(2, messageId);
  }

  checkToSave() {
    if (this.messagesToCompare.get(1) != null && this.messagesToCompare.get(2) != null) {
      this.ngRedux.dispatch({
        type: SAVE_COMPARE,
        payload: {
          localCompare: this.messagesToCompare
        }
      });
      let compare = new MessageCompare();
      this.discrep = compare.gatherMessages(this.messagesToCompare.get(1) - 1, this.messagesToCompare.get(2) - 1);
      console.log(this.discrep);
    }
  }

  showLeftSegments(message: string) {
    let newSplit;
    let extraSplitCount = 0;
    if (this.discrep.message1.size === 0) {
      let lineBreak: string[] = [];
      lineBreak = message.split(/(?:\r\n|\r|\n)/g);
      return lineBreak;
    }
    newSplit = message.split(/(?:\r\n|\r|\n)/g);
    this.discrep.message1.forEach((segment, segmentIndex) => {
      if (segment.missing) {
        newSplit.splice(segmentIndex, 0, '');
        extraSplitCount++;
      }
    });
    return newSplit;
  }

  showRightSegments(message: string) {
    let extraSplitCount = 0;
    if (this.discrep.message2.size === 0) {
      let lineBreak: string[] = [];
      lineBreak = message.split(/(?:\r\n|\r|\n)/g);
      return lineBreak;
    }
    let newSplit = message.split(/(?:\r\n|\r|\n)/g);
    this.discrep.message2.forEach((segment, segmentIndex) => {
      if (segment.missing) {
        newSplit.splice((segmentIndex), 0, '');
        extraSplitCount++;
      }
    });
    return newSplit;
  }
}
