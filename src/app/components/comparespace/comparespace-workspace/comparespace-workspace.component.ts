import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Map } from 'immutable';
import { SAVE_LEFT, SAVE_RIGHT } from '../../../constants/constants';
import { IAppState, IMessage } from '../../../states/states';
import { MessageCompare } from '../../../../messageReader/compareMessages/messageCompare';
import { IMessageDiscrepancies, ISegmentDiscrepancies } from '../../../../messageReader/compareMessages/IMessageDiscrepancies';

@Component({
  selector: 'hls-comparespace-workspace',
  templateUrl: './comparespace-workspace.component.html',
  styleUrls: ['./comparespace-workspace.component.scss']
})
export class ComparespaceWorkspaceComponent implements OnInit {

  @select(['discrepancies']) discrepancies$: Observable<IMessageDiscrepancies>;
  @select(['messages']) messages$: Observable<Map<number, IMessage>>;
  @select(['messagesToCompare']) messagesToCompare$: Observable<Map<number, number>>;


  messagesToCompare = Map<number, number>();
  messages: Map<number, IMessage>;
  divScrollLeft: any;
  discrep1: Map<number, ISegmentDiscrepancies>;
  discrep2: Map<number, ISegmentDiscrepancies>;
  upperBottom: string;
  lowerBottom: string;
  discrepSub1;
  discrepSub2;
  messageSub;

  constructor(private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
    combineLatest(this.messagesToCompare$, this.messages$)
      .subscribe(([messagesToCompare, messages]) => {
        if (messagesToCompare.get(0) != null && messagesToCompare.get(1) != null) {
          let compare = new MessageCompare(this.ngRedux);
          compare.gatherMessages();
        }
        this.messagesToCompare = messagesToCompare;
        this.messages = messages;
      });
    this.discrepSub1 = this.discrepancies$.subscribe(discrepancies => this.discrep1 = discrepancies.message1);
    this.discrepSub2 = this.discrepancies$.subscribe(discrepancies => this.discrep2 = discrepancies.message2);
  }

  ngOnDestroy() {
    this.discrepSub1.unsubscribe();
    this.discrepSub2.unsubscribe();
  }

  onScroll(eventScrollLeft) {
    this.divScrollLeft = eventScrollLeft;
  }

  saveLeftCompare(messageId: number) {
    this.ngRedux.dispatch({
      type: SAVE_LEFT,
      payload: {
        leftArea: messageId,
      }
    });
  }

  saveRightCompare(messageId: number) {
    this.ngRedux.dispatch({
      type: SAVE_RIGHT,
      payload: {
        rightArea: messageId,
      }
    });
  }

  getLeftID() {
    return this.messagesToCompare.get(0);
  }

  getRightID() {
    return this.messagesToCompare.get(1);
  }

  sendLeftLineToBottom(indices: [number, number]) {
    if (this.discrep1.get(indices[0]).missing !== true) {
      this.upperBottom = this.messages.get(this.getLeftID() - 1).message.hl7Segments[indices[0]].value;
    } else {
      this.upperBottom = '';
    }
    if (this.discrep2.get(indices[0]).missing !== true) {
      this.lowerBottom = this.messages.get(this.getRightID() - 1).message.hl7Segments[indices[1]].value;
    } else {
      this.upperBottom = '';
    }
  }

  sendRightLineToBottom(indices: [number, number]) {
    this.upperBottom = this.messages.get(this.getRightID() - 1).message.hl7Segments[indices[0]].value;
    this.lowerBottom = this.messages.get(this.getLeftID() - 1).message.hl7Segments[indices[1]].value;
  }


}
