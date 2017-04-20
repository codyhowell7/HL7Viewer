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
export class ComparespaceWorkspaceComponent implements OnInit, OnDestroy {

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
    this.messageSub = combineLatest(this.messagesToCompare$, this.messages$)
      .subscribe(([messagesToCompare, messages]) => {
        if (messagesToCompare.get(0) != null && messagesToCompare.get(1) != null) {
          let compare = new MessageCompare(this.ngRedux);
          compare.gatherMessages();
        }
        this.messagesToCompare = messagesToCompare;
        this.messages = messages;
      });
    this.discrepSub1 = this.discrepancies$.subscribe(discrepancies => { console.log(discrepancies); this.discrep1 = discrepancies.message1;});
    this.discrepSub2 = this.discrepancies$.subscribe(discrepancies => this.discrep2 = discrepancies.message2);
  }

  ngOnDestroy() {
    this.discrepSub1.unsubscribe();
    this.discrepSub2.unsubscribe();
    this.messageSub.unsubscribe();
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

  getLeftCorrectedIndex(index: number) {
    let currentSlice = this.discrep1.slice(0, index);
    let missingLines = currentSlice.filter(current => current.missing === true).size;
    return index - missingLines;
  }

  getRightCorrectedIndex(index: number) {
    let currentSlice = this.discrep2.slice(0, index);
    let missingLines = currentSlice.filter(current => current.missing === true).size;
    return index - missingLines;
  }


  sendLeftLineToBottom(index: number) {
    if (this.discrep1.get(index).missing !== true) {
      this.upperBottom = this.messages.get(this.getLeftID() - 1).message.hl7Segments[this.getLeftCorrectedIndex(index)].value;
    } else {
      this.upperBottom = '';
    }
    if (this.discrep2.get(index).missing !== true) {
      this.lowerBottom = this.messages.get(this.getRightID() - 1).message.hl7Segments[this.getRightCorrectedIndex(index)].value;
    } else {
      this.lowerBottom = '';
    }
  }

  sendRightLineToBottom(index: number) {
    if (this.discrep2.get(index).missing !== true) {
      this.upperBottom = this.messages.get(this.getRightID() - 1).message.hl7Segments[this.getRightCorrectedIndex(index)].value;
    } else {
      this.upperBottom = '';
    }
    if (this.discrep1.get(index).missing !== true) {
      this.lowerBottom = this.messages.get(this.getLeftID() - 1).message.hl7Segments[this.getLeftCorrectedIndex(index)].value;
    } else {
      this.lowerBottom = '';
    }
  }

  displayBottom() {
    if (this.upperBottom || this.lowerBottom) {
      return true;
    } else {
      return false;
    }
  }


}

