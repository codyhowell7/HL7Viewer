import { Component } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']

})
export class AppComponent {

    public options = {
        timeOut: 5000,
        showProgressBar: false
    };

    constructor(private _service: NotificationsService) { }
}
