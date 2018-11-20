import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import { WizardFormsComponent } from './wizard-forms.component';


// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [
    WizardFormsComponent
  ],
  imports: [
    BrowserModule,
    // configure the imports
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateHttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [WizardFormsComponent]
})





export class WizardFormsModule {
}
