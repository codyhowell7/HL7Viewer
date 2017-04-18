import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuickViewService } from '../../../../../backendCalls/quickview.service';
import { List, Map } from 'immutable';
import { JwtHelper } from 'angular2-jwt';
import { MessageReader } from '../../../../../../messageReader/messageReader';
import { select, NgRedux } from 'ng2-redux';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { IMessage, IAppState } from '../../../../../states/states';
import * as HL7Dict from 'hl7-dictionary';


@Component({
  selector: 'hls-quick-view-use',
  templateUrl: './quick-view-use.component.html',
  styleUrls: ['./quick-view-use.component.scss']
})
export class QuickViewUseComponent implements OnInit {

  @Input() messages$: Observable<Map<number, IMessage>>;
  @Input() currentMessage$: Observable<number>;

  @Input() quickViewId: string;
  @Input() jwt: string;
  @Output() switchBack = new EventEmitter;

  selectedQuickView;
  mSub;
  results: Map<string, string[]>;

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

  manySegCheck(field: string) {
    return this.results.get(field).length > 1;
  }

  existsCheck(field) {
    return this.results.get(field).length > 0;
  }

  formatValue(value: string) {
    if (value !== '' && value) {
      return value;
    } else {
      return `""`;
    }
  }

  getFieldDesc(selector: string) {
    if (HL7Dict.definitions['2.7.1'].segments[selector.substr(0, 3)]) {
      if (selector.includes('.')) {
        let reg = new RegExp('\\.', 'g');
        if (selector.match(reg).length > 1) {
          if (selector.includes('[')) {
            return HL7Dict.definitions['2.7.1'].segments
            [selector.substr(0, 3)].fields[+selector.substring(4, selector.indexOf('[', 5)) - 1].desc;
          } else {
            return HL7Dict.definitions['2.7.1'].segments
            [selector.substr(0, 3)].fields[+selector.substring(4, selector.indexOf('.', 5)) - 1].desc;
          }
        } else {
          return HL7Dict.definitions['2.7.1'].segments[selector.substr(0, 3)].fields[+selector.slice(4) - 1].desc;
        }
      } else {
        return HL7Dict.definitions['2.7.1'].segments[selector].desc;
      }
    }
  }

  back() {
    this.switchBack.emit(false);
  }
}
