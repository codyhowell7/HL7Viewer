import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { select } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';

import { IMessage } from '../../../../states/states';

@Component({
  selector: 'hls-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.scss']
})
export class QuickViewComponent implements OnInit {

  @select(['messages']) messages$: Observable<Map<number, IMessage>>;
  @select(['currentMessage']) currentMessage$: Observable<number>;

  message: IMessage;

  ngOnInit() {

    combineLatest(this.messages$, this.currentMessage$)
      .map(([messages, currentMessage]) => {

        return messages.get(currentMessage);
      })
      .subscribe(message => { this.message = message; });
  }

}
