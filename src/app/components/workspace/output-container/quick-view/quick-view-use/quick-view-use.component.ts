import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuickViewService } from '../../../../../backendCalls/quickview.service';
import { List, Map } from 'immutable';
import { JwtHelper } from 'angular2-jwt';
import { MessageReader } from '../../../../../../messageReader/messageReader';
import { select, NgRedux } from 'ng2-redux';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { IMessage, IAppState } from '../../../../../states/states';


@Component({
  selector: 'hls-quick-view-use',
  templateUrl: './quick-view-use.component.html',
  styleUrls: ['./quick-view-use.component.scss']
})
export class QuickViewUseComponent implements OnInit {

  @select(['messages']) messages$: Observable<Map<number, IMessage>>;
  @select(['currentMessage']) currentMessage$: Observable<number>;

  @Input() quickViewId: string;
  @Input() jwt: string;

  selectedQuickView;
  mSub;
  results: Map<string, string>;

  constructor(private quickViewService: QuickViewService, private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
    combineLatest(this.messages$, this.currentMessage$)
      .map(([messages, currentMessage]) => {
        return messages.get(currentMessage);
      })
      .subscribe(message => {
        this.quickViewService.getQuickViewById(this.jwt, this.quickViewId).subscribe(
          view => {
            this.selectedQuickView = view;
            let mReader = new MessageReader();
            this.results = mReader.setQuickView(message, view.selectors);
          }
        );
      });
  }

  getValueBySelector(selector: string) {
    return this.results.get(selector);
  }
}
