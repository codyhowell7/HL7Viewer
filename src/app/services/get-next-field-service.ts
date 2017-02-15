import { Injectable } from '@angular/core';
import { Map } from 'immutable';
import { IMessage, IAppState } from '../states/states';
import { select, NgRedux } from 'ng2-redux';
import { FIELD_OFFSET } from '../constants/constants';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GetNextField {

    @select(['fieldOffset']) fieldOffset$: Observable<Map<number, number>>;

    constructor(private ngRedux: NgRedux<IAppState>) { }
    
    public findFieldOffset(segmentID: number) {
        let fieldOffset: Map<number, number>;
        this.fieldOffset$.subscribe(segmentId => fieldOffset = segmentId);
        return fieldOffset.get(segmentID);
    }

}
