import { Component, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    //Set toastr container ref configuration for toastr positioning on screen
    constructor(public toastr: ToastsManager, vRef: ViewContainerRef, private translate: TranslateService) {
      translate.setDefaultLang('en');

      this.toastr.setRootViewContainerRef(vRef);

    }


}
