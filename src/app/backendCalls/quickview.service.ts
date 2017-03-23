import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { UUID } from 'angular2-uuid';
import { List } from 'immutable';
import 'rxjs/add/operator/map';

@Injectable()
export class QuickViewService {

    private createQV = `http://localhost:5001/command/quickview/${UUID.UUID().toString()}/create`;
    private queryAllQV = 'http://localhost:5001/query/quickview/all';
    private queryUserQV = 'http://localhost:5001/query/quickview/byuser/';
    private queryById = 'http://localhost:5001/query/quickview/byid/';

    constructor(private http: Http) { }

    public createQuickView(name: string, sel: List<string>, jwt: string) {
        let body = { 'Name': name, 'Selectors': sel };
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${jwt}`);
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.createQV, body, options).map((res: Response) => res.json()).subscribe();
    }

    public searchQuickViews(jwt: string) {
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${jwt}`);
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.queryAllQV, options)
                        .map(this.extractQVs);
    }

    public getQuickViewsForUser(jwt: string, userId: string) {
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${jwt}`);
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.queryUserQV + userId, options)
                        .map(this.extractQVs);
    }

    public getQuickViewById(jwt: string, Id: string) {
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${jwt}`);
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.queryById + Id, options)
                        .map(this.extractQVs);
    }

    private extractQVs(res: Response) {
        return res.json();
    }
}
