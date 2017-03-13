import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
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

  @select(['messagesToCompare']) messagesToCompare$: Observable<Map<number, number>>;

  messagesToCompare = Map<number, number>();
  messages: Map<number, IMessage>;
  divScrollLeft: any;
  discrep: IMessageDiscrepancies = { message1: Map<number, ISegmentDiscrepancies>(), message2: Map<number, ISegmentDiscrepancies>() }

  constructor(private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
    this.messagesToCompare$.subscribe(compare => this.messagesToCompare = compare);
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
    this.checkToSave();
  }

  saveRightCompare(messageId: number) {
    this.ngRedux.dispatch({
      type: SAVE_RIGHT,
      payload: {
        rightArea: messageId,
      }
    });
    this.checkToSave();
  }

  getLeftID() {
    return this.messagesToCompare.get(0);
  }

  getRightID() {
    return this.messagesToCompare.get(1);
  }

  checkToSave() {
    if (this.messagesToCompare.get(0) != null && this.messagesToCompare.get(1) != null) {
      let compare = new MessageCompare(this.ngRedux);
      compare.gatherMessages(); // Save discrepancies to redux store.
    }
  }
  
  // showLeftSegments(message: string) {
  //   let newSplit;
  //   let extraSplitCount = 0;
  //   if (this.discrep.message1.size === 0) {
  //     let lineBreak: string[] = [];
  //     lineBreak = message.split(/(?:\r\n|\r|\n)/g);
  //     return lineBreak;
  //   }
  //   newSplit = message.split(/(?:\r\n|\r|\n)/g);
  //   this.discrep.message1.forEach((segment, segmentIndex) => {
  //     if (segment.missing) {
  //       newSplit.splice(segmentIndex, 0, '');
  //       extraSplitCount++;
  //     }
  //   });
  //   return newSplit;
  // }

  // showRightSegments(message: string) {
  //   let extraSplitCount = 0;
  //   if (this.discrep.message2.size === 0) {
  //     let lineBreak: string[] = [];
  //     lineBreak = message.split(/(?:\r\n|\r|\n)/g);
  //     return lineBreak;
  //   }
  //   let newSplit = message.split(/(?:\r\n|\r|\n)/g);
  //   this.discrep.message2.forEach((segment, segmentIndex) => {
  //     if (segment.missing) {
  //       newSplit.splice((segmentIndex), 0, '');
  //       extraSplitCount++;
  //     }
  //   });
  //   return newSplit;
  // }
}
