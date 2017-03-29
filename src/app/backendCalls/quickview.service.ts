import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { List } from 'immutable';
import 'rxjs/add/operator/map';


@Injectable()
export class QuickViewService {

    private createQV = `http://localhost:5001/command/quickview/`;
    private removeSelectorQV = 'http://localhost:5001/command/quickview/';
    private addSelectedQV = 'http://localhost:5001/command/quickview/';
    private changeNameQV = 'http://localhost:5001/command/quickview/';
    private deleteQV = 'http://localhost:5001/command/quickview/';
    private replaceSelectorsQV = 'http://localhost:5001/command/quickview/';

    private queryAllQV = 'http://localhost:5001/query/quickview/all';
    private queryUserQV = 'http://localhost:5001/query/quickview/byuser/';
    private queryById = 'http://localhost:5001/query/quickview/byid/';

    constructor(private http: Http) { }

    // COMMANDS //
    public createQuickView(name: string, sel: List<string>, jwt: string, guid: string) {
        let body = { 'Name': name, 'Selectors': sel };
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${jwt}`);
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.createQV + guid + '/create', body, options)
            .map(this.extractQVs)
            .catch(this.handleError)
            .subscribe();
    }

    public removeSelector(selToRemove: string, jwt: string, qvID: string) {
        let body = { 'Selector': selToRemove };
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${jwt}`);
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.removeSelectorQV + qvID + '/removeselector', body, options)
            .map(this.extractQVs)
            .catch(this.handleError)
            .subscribe();

    }

    public addSelector(selToAdd: string, jwt: string, qvId: string) {
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${jwt}`);
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let body = { 'Selector': selToAdd };
        return this.http.post(this.addSelectedQV + qvId + '/addselector', body, options)
            .map(this.extractQVs)
            .catch(this.handleError)
            .subscribe();
    }

    public changeName(name: string, jwt: string, qvId: string) {
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${jwt}`);
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let body = { 'name': name };
        return this.http.post(this.changeNameQV + qvId + '/rename', body, options)
            .map(this.extractQVs)
            .catch(this.handleError)
            .subscribe();
    }

    public deleteView(jwt: string, qvId: string) {
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${jwt}`);
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let body = {};
        return this.http.post(this.deleteQV + qvId + '/delete', body, options)
            .map(this.extractQVs)
            .catch(this.handleError)
            .subscribe();
    }

    public replaceSelectors(newSelectors: List<string>, jwt: string, qvId: string) {
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${jwt}`);
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let body = { 'Selectors': newSelectors};
        return this.http.post(this.replaceSelectorsQV + qvId + '/replaceselectors', body, options)
            .map(this.extractQVs)
            .catch(this.handleError)
            .subscribe();
    }




    // QUERIES //
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

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}
