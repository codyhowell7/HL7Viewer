import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';
import { IMessage, IAppState } from '../../../../states/states';
import { QuickViewService } from '../../../../backendCalls/quickview.service';
import { SerializeHelper } from '../../../../backendCalls/serializationHelper';
import { SAVE_JWT } from '../../../../constants/constants';
import { JwtHelper } from 'angular2-jwt';




@Component({
  selector: 'hls-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.scss'],
  providers: [QuickViewService]
})
export class QuickViewComponent implements OnInit {

  @select(['messages']) messages$: Observable<Map<number, IMessage>>;
  @select(['currentMessage']) currentMessage$: Observable<number>;
  @select(['jwt']) jwt$: Observable<string>;

  jwtHelper: JwtHelper = new JwtHelper();
  message: IMessage;
  createView = false;
  searchAllViews = false;
  useView = false;
  mainPage = true;
  jwt: string;
  currentMessageId: number;


  ngOnInit() {

    combineLatest(this.messages$, this.currentMessage$)
      .map(([messages, currentMessage]) => {
        this.currentMessageId = currentMessage;
        return messages.get(currentMessage);
      })
      .subscribe(message => { this.message = message; });

    this.aRoute.queryParams.subscribe((jwtoken: Params) => {
      if (jwtoken['query']) {
        this.ngRedux.dispatch({
          type: SAVE_JWT,
          payload: { JWT: jwtoken['query'].substr(1, jwtoken['query'].length - 2) }
        });
      }
    });
    this.jwt$.subscribe(jwt => this.jwt = jwt);
    this.router.navigate([], { queryParams: {} });
    if (this.message == null) {
      this.router.navigate([`/workspace/0/quick`], { queryParams: {} });
    }

  }

  constructor(private router: Router, private aRoute: ActivatedRoute, private ngRedux: NgRedux<IAppState>,
    private quickViewService: QuickViewService) { }

  createNewView() {
    this.createView = true;
    this.mainPage = false;
  }

  updateCreateView(viewStatus: boolean) {
    this.createView = viewStatus;
    this.searchAllViews = viewStatus;
    this.useView = viewStatus;
    this.mainPage = true;
  }

  searchViews() {
    this.searchAllViews = true;
    this.mainPage = false;
  }

  useQuickView() {
    this.useView = true;
    this.mainPage = false;
  }

  azureLogin() {
    this.saveState();
    window.location.href = 'http://uts-hl7-viewer:5000/auth/login';
  }

  saveState() {
    let sHelper = new SerializeHelper(this.ngRedux);
    sHelper.write();
  }

  azureLogout() {
    window.location.href = 'http://uts-hl7-viewer:5000/auth/logout';
  }

  isTokenExpired() {
    if (this.jwt) {
      return this.jwtHelper.isTokenExpired(this.jwt);
    }
  }

}
