import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NouisliderModule } from 'ng2-nouislider';
import { JsonpModule } from '@angular/http';
import { QuillModule } from 'ngx-quill'
import { DragulaModule } from 'ng2-dragula';
import { ImageCropperModule } from 'ng2-img-cropper';
import { TagInputModule } from 'ngx-chips';
import { HttpModule } from '@angular/http';
import { UiSwitchModule } from 'ngx-ui-switch';

import { FormsRoutingModule } from "./forms-routing.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NGXFormWizardModule } from "./ngx-wizard/ngx-wizard.module";
import { CustomFormsModule } from 'ng2-validation';
import { MatchHeightModule } from "../shared/directives/match-height.directive";

import { ValidationFormsComponent } from "./validation/validation-forms.component";
import { WizardFormsComponent } from "./wizard/wizard-forms.component";
import { BasicComponent } from './layouts/basic/basic.component';
import { HorizontalComponent } from './layouts/horizontal/horizontal.component';
import { HiddenLabelsComponent } from './layouts/hidden-labels/hidden-labels.component';
import { FormActionsComponent } from './layouts/form-actions/form-actions.component';
import { BorderedComponent } from './layouts/bordered/bordered.component';
import { StripedRowsComponent } from './layouts/striped-rows/striped-rows.component';
import { InputsComponent } from './elements/inputs/inputs.component';
import { InputGroupsComponent } from './elements/input-groups/input-groups.component';
import { InputGridComponent } from './elements/input-grid/input-grid.component';
import { DropdownsComponent } from "../components/bootstrap/dropdowns/dropdowns.component";
import { AccordionModule } from 'primeng/accordion';
import { ArchwizardModule } from 'angular-archwizard';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { GrowlModule } from 'primeng/growl';

@NgModule({
    imports: [
        NgbModule,
        NouisliderModule,
        JsonpModule,
        QuillModule,
        DragulaModule,
        ImageCropperModule,
        TagInputModule,
        HttpModule,
        UiSwitchModule,

        ArchwizardModule,
        AccordionModule,
        DropdownModule,
        ProgressBarModule,
        GrowlModule,

        CommonModule,
        FormsRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        NGXFormWizardModule,
        CustomFormsModule,
        MatchHeightModule
        

    ],
    declarations: [
        ValidationFormsComponent,
        WizardFormsComponent,
        BasicComponent,
        DropdownsComponent,
        HorizontalComponent,
        HiddenLabelsComponent,
        FormActionsComponent,
        BorderedComponent,
        StripedRowsComponent,
        InputsComponent,
        InputGroupsComponent,
        InputGridComponent
    ]

})
export class FormModule { }
