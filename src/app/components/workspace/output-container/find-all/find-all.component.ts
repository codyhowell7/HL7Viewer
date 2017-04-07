import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageReader } from '../../../../../messageReader/messageReader';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { IMessage, IAppState, IFindAll, IUniqueFindAll } from '../../../../states/states';
import { Map, List } from 'immutable';
import { SAVE_FIND_ALL, SAVE_FIND_ALL_UNIQUE } from '../../../../constants/constants';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'hls-find-all',
  templateUrl: './find-all.component.html',
  styleUrls: ['./find-all.component.scss']
})
export class FindAllComponent implements OnInit, OnDestroy {

  @select(['messages']) messages$: Observable<Map<number, IMessage>>;
  @select(['findAll']) findAll$: Observable<IFindAll>;
  @select(['findAllUnique']) findAllUnique$: Observable<IUniqueFindAll>;

  messages: Map<number, IMessage>;
  resultsArray: List<[number, string]>;
  resultMessageNum: number[] = [];
  unique = 'false';
  radioWhenClicked = 'false';
  identifier = '';
  counter: Map<string, number>;
  mSub;
  faSub;
  fauSub;

  constructor(private ngRedux: NgRedux<IAppState>, private router: Router) { }

  ngOnInit() {
    this.mSub = this.messages$.subscribe(messages => this.messages = messages);
    this.faSub = this.findAll$.subscribe(findAll => {
      this.resultsArray = findAll.findAllResults;
      this.radioWhenClicked = findAll.uniqueSearch;
      this.unique = findAll.uniqueSearch;
      this.identifier = findAll.searchValue;
    });
    this.fauSub = this.findAllUnique$.subscribe(findAllUnique => this.counter = findAllUnique.findAllResults);
    if (this.messages.filter(message => message.message.hl7CorrectedMessage !== '').size === 0) {
      this.router.navigate([`/workspace/0/find`], { queryParams: {} });
    }
  }

  ngOnDestroy() {
    this.mSub.unsubscribe();
    this.faSub.unsubscribe();
    this.fauSub.unsubscribe();
  }

  setInput(identifer: string) {
    this.identifier = identifer.toUpperCase();
  }

  isUnique() {
    return this.radioWhenClicked === 'true';
  }

  setUnique(value: boolean) {
    if (value === true) {
      this.unique = 'true';
    } else {
      this.unique = 'false';
    }
  }

  getCount(result: string) {
    return this.counter.get(result);
  }

  getAllCurrentElements() {
    let copiedText = '';
    this.resultsArray.forEach((result, index) => {
      if (result !== this.resultsArray.last()) {
        copiedText += result[1] + '\n';
      } else {
        copiedText += result[1];
      }
    });
    return copiedText;
  }

  getAllResults() {
    let results = List<[number, string]>();
    let counter = Map<string, number>();
    let mReader = new MessageReader();
    this.messages.forEach(message => {
      mReader.setQuickView(message, [this.identifier]).get(this.identifier).forEach(result => {
        if (this.unique === 'false') {
          results = results.push([message.id, result]);
          this.radioWhenClicked = 'false';
        } else {
          this.radioWhenClicked = 'true';
          if (results.every(value => value[1] !== result)) {
            results = results.push([message.id, result]);
            counter = counter.set(result, 1);
          } else {
            counter = counter.set(result, counter.get(result) + 1);
          }
        }
      });
    });
    if (this.radioWhenClicked === 'false') {
      this.ngRedux.dispatch({
        type: SAVE_FIND_ALL,
        payload: {
          FindAllSearch: results,
          uniqueSearch: 'false',
          searchValue: this.identifier
        }
      });
    } else {
      this.ngRedux.dispatch({
        type: SAVE_FIND_ALL,
        payload: {
          FindAllSearch: results,
          uniqueSearch: 'true',
          searchValue: this.identifier
        }
      });
      this.ngRedux.dispatch({
        type: SAVE_FIND_ALL_UNIQUE,
        payload: {
          FindAllSearchUnique: counter
        }
      });
    }
  }
}

