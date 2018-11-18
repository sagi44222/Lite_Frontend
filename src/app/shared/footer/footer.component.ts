import { Component, HostBinding } from '@angular/core';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})

export class FooterComponent {
    //Variables
    currentDate: Date = new Date();
    acc: any;
    // Prevent panel toggle code
    public beforeChange($event: NgbPanelChangeEvent) {
        if ($event.panelId === '2') {
            $event.preventDefault();
        }
        if ($event.panelId === '3' && $event.nextState === false) {
            $event.preventDefault();
        }
    };
}
