import { Component, OnInit, ViewChild, Pipe } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SoilService } from './soil.service';
import { SelectItemGroup } from 'primeng/api';
import { CreditCardValidator } from 'ngx-credit-cards';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
declare var require: any;
const data: any = require('./crops.json');
import * as jspdf from 'jspdf';
import * as html2canvas from 'html2canvas';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-wizard-forms',
    templateUrl: './wizard-forms.component.html',
    styleUrls: ['./wizard-forms.component.css'],
    providers: [SoilService, MessageService]
})

export class WizardFormsComponent implements OnInit {
   // Language

   // Alltherest
    msgs: Message[] = [];
    value = 0;
    unitesData: any[] = [];
    extractionData: any[] = [];
    nutrientsData: any[] = [];
    cropNE: {
        type: string,
        nutrients: any[],
        extMethod: any[]
    }
    alldata: any[] = [];
    cropsData: any[] = [];
    // type: any[] = ['N', 'P', 'K', 'Ca', 'Mg', 'S', 'B', 'Fe', 'Mn', 'Zn', 'Cu', 'Mo', 'Na', 'Al', 'Cl', 'HCO3'];
    type: any[] = ['N', 'P', 'K', 'Ca', 'Mg', 'S', 'B', 'Fe', 'Mn', 'Zn', 'Cu', 'Mo', 'Na'];
    alpha: any[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    crops: any[] = [];
    cropId: any;
    crop: {
        alpha: string,
        records: any[]
    }
    varietyName: any;
    selectedCrop: any;
    varietyData: any[] = [];
    soilType: any[] = [];
    step1Form: FormGroup;
    step2Form: FormGroup;
    step3Form: FormGroup;
    step5Form: FormGroup;
    form1: any;
    form2: any;
    form3: any;
    paymentModel: any = {};
    form: FormGroup;
    convertData: any[] = [];
    reportData: any;
    allcrops: any[] = [];
    payUrl: any;
    isPay = false;
    stepIndex = 0;
    sf: any[] = [];
    isText = true;
    isStep5 = false;
    actual_N = 0;
    actual_P = 0;
    actual_K = 0;
    current_N = 0;
    current_P = 0;
    current_K = 0;
    fullfilled_N = 0;
    fullfilled_P = 0;
    fullfilled_K = 0;
    fdate: Date = new Date();
    DropdownVar = 2;
    isConvert = false;
    convertFinal: any[] = [];
    finalYield: any;
    isNutrient = true;
    isDisableWizard = true;
  isReportPage = false;
  firstPage = true;
  reportTitle = false;
  language = 'es';
    private _emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // reportData: any = JSON.parse('{"ScheduleResponse":{"AcidAlert":{"Alert":[]},"stages":[{"AcidAlert":{"Alert":[]},"N_FormsAlert":{"Alert":[]},"Cost":"0","Duration":"10","Recommendation":"Per 10","Id":1,"Name":"s1","FromDate":"2018-07-18T19:41:27","ToDate":"2018-07-27T19:41:27","Ratios":null,"IrrWaterEc":null,"EstimatedIrrWaterEc":null,"TargetValuesEC":null,"TargetValuesEc":null,"SourceWaterEc":null,"IsFeasible":"0","PhIsDisabled":null,"PhIsLow":null,"PhIsUnavailable":null,"PhGoesForTargetPh":null,"IrrWaterPh":null,"IrrWaterHCO3":null,"SelectedFertilizers":{"Fertilizer":[{"Id":8173,"FertilizerId":8173,"Name":"Consultant Fertilizer","Concentration":"0","AcidConcentration":"","ConcentrationUnit":"6","IsLiquid":false,"Order":"1","IsLocked":false,"NotUsed":false,"IsSystemFert":false,"Cost":0,"ElementsConcentrations":null}]},"NeededAddition":{"Id":null,"Name":null,"N_Val":"129.8343","NO3_Val":null,"NH4_Val":null,"NH2_Val":null,"P_Val":"0","K_Val":"394.2857","Ca_Val":"999.2727","Mg_Val":"569.0909","S_Val":null,"B_Val":"0","Fe_Val":"0","Mn_Val":"0","Zn_Val":"0","Cu_Val":"0","Mo_Val":"0","Na_Val":null,"HCO3_Val":null,"CO3_Val":null,"CL_Val":null,"F_Val":null},"FertAddition":null,"Accuracy":{"Name":null,"N_Val":"0%","NO3_Val":null,"NH4_Val":null,"NH2_Val":null,"P_Val":"0%","K_Val":"0%","Ca_Val":"0%","Mg_Val":"0%","S_Val":"0%","B_Val":"0%","Fe_Val":"0%","Mn_Val":"0%","Zn_Val":"0%","Cu_Val":"0%","Mo_Val":"0%","Na_Val":"0%","HCO3_Val":"0%","CO3_Val":"0%","CL_Val":"0%","F_Val":null,"Ca_Color":null,"Mg_Color":null,"S_Color":null,"Na_Color":null,"HCO3_Color":null},"FriendlyAlerts":{"Alert":[{"Id":92,"AlertId":92,"Message":"Current application of nutrients N, K, Ca, Mg is less than 80% of actual requirement.","Severity":15,"MessageSource":"N, K, Ca, Mg"}]},"IsActive":false,"AlternativeCompoundFertilizers":{"Fertilizer":[]}},{"AcidAlert":{"Alert":[]},"N_FormsAlert":{"Alert":[{"Id":312,"AlertId":312,"Message":"There might be volatilization of nitrogen.","Severity":0,"MessageSource":null}]},"Cost":"0.00","Duration":"30","Recommendation":"Per 30","Id":2,"Name":"s2","FromDate":"2018-07-28T19:41:27","ToDate":"2018-08-26T19:41:27","Ratios":" N-NO3 % =40      NO3:NH4 =1:1.50      N:P =1:2.00      N:K =1:3.00     ","IrrWaterEc":"0","EstimatedIrrWaterEc":"0","TargetValuesEC":"0","TargetValuesEc":"0","SourceWaterEc":"0","IsFeasible":"1","PhIsDisabled":"0","PhIsLow":"0","PhIsUnavailable":"0","PhGoesForTargetPh":"0","IrrWaterPh":"0","IrrWaterHCO3":"0","SelectedFertilizers":{"Fertilizer":[{"Id":8173,"FertilizerId":8173,"Name":"Consultant Fertilizer","Concentration":"729.35","AcidConcentration":"","ConcentrationUnit":"6","IsLiquid":false,"Order":"1","IsLocked":false,"NotUsed":false,"IsSystemFert":false,"Cost":0,"ElementsConcentrations":null}]},"NeededAddition":{"Id":null,"Name":null,"N_Val":"389.5028","NO3_Val":null,"NH4_Val":null,"NH2_Val":null,"P_Val":"72.93508","K_Val":"857.1429","Ca_Val":"1498.909","Mg_Val":"796.7272","S_Val":"0","B_Val":null,"Fe_Val":null,"Mn_Val":"0","Zn_Val":"0","Cu_Val":"0","Mo_Val":"0","Na_Val":null,"HCO3_Val":null,"CO3_Val":null,"CL_Val":null,"F_Val":null},"FertAddition":{"Id":"FertAddition","Name":"FertAddition","N_Val":"36.4675","NO3_Val":"14.587","NH4_Val":"21.8805","NH2_Val":"0","P_Val":"72.935","K_Val":"109.4025","Ca_Val":"0","Mg_Val":"0","S_Val":"0","B_Val":"0","Fe_Val":"0","Mn_Val":"0","Zn_Val":"0","Cu_Val":"0","Mo_Val":"0","Na_Val":"0","HCO3_Val":"0","CO3_Val":"0","CL_Val":"0","F_Val":"0"},"Accuracy":{"Name":null,"N_Val":"9%","NO3_Val":null,"NH4_Val":null,"NH2_Val":null,"P_Val":"100%","K_Val":"13%","Ca_Val":"0%","Mg_Val":"0%","S_Val":"0%","B_Val":null,"Fe_Val":null,"Mn_Val":"0%","Zn_Val":"0%","Cu_Val":"0%","Mo_Val":"0%","Na_Val":null,"HCO3_Val":null,"CO3_Val":null,"CL_Val":null,"F_Val":null,"Ca_Color":null,"Mg_Color":null,"S_Color":null,"Na_Color":null,"HCO3_Color":null},"FriendlyAlerts":{"Alert":[{"Id":92,"AlertId":92,"Message":"Current application of nutrients N, K, Ca, Mg is less than 80% of actual requirement.","Severity":15,"MessageSource":"N, K, Ca, Mg"}]},"IsActive":true,"AlternativeCompoundFertilizers":{"Fertilizer":[]}},{"AcidAlert":{"Alert":[]},"N_FormsAlert":{"Alert":[{"Id":312,"AlertId":312,"Message":"There might be volatilization of nitrogen.","Severity":0,"MessageSource":null}]},"Cost":"0.00","Duration":"40","Recommendation":"Per 40","Id":3,"Name":"s3","FromDate":"2018-08-27T19:41:27","ToDate":"2018-10-05T19:41:27","Ratios":" N-NO3 % =40      NO3:NH4 =1:1.50      N:P =1:2.00      N:K =1:3.00     ","IrrWaterEc":"0","EstimatedIrrWaterEc":"0","TargetValuesEC":"0","TargetValuesEc":"0","SourceWaterEc":"0","IsFeasible":"1","PhIsDisabled":"0","PhIsLow":"0","PhIsUnavailable":"0","PhGoesForTargetPh":"0","IrrWaterPh":"0","IrrWaterHCO3":"0","SelectedFertilizers":{"Fertilizer":[{"Id":8173,"FertilizerId":8173,"Name":"Consultant Fertilizer","Concentration":"1411.36","AcidConcentration":"","ConcentrationUnit":"6","IsLiquid":false,"Order":"1","IsLocked":false,"NotUsed":false,"IsSystemFert":false,"Cost":0,"ElementsConcentrations":null}]},"NeededAddition":{"Id":null,"Name":null,"N_Val":"519.337","NO3_Val":null,"NH4_Val":null,"NH2_Val":null,"P_Val":"141.1364","K_Val":"1028.571","Ca_Val":"1748.727","Mg_Val":"910.5455","S_Val":"0","B_Val":null,"Fe_Val":null,"Mn_Val":"0","Zn_Val":"0","Cu_Val":"0","Mo_Val":"0","Na_Val":null,"HCO3_Val":null,"CO3_Val":null,"CL_Val":null,"F_Val":null},"FertAddition":{"Id":"FertAddition","Name":"FertAddition","N_Val":"70.568","NO3_Val":"28.2272","NH4_Val":"42.3408","NH2_Val":"0","P_Val":"141.136","K_Val":"211.704","Ca_Val":"0","Mg_Val":"0","S_Val":"0","B_Val":"0","Fe_Val":"0","Mn_Val":"0","Zn_Val":"0","Cu_Val":"0","Mo_Val":"0","Na_Val":"0","HCO3_Val":"0","CO3_Val":"0","CL_Val":"0","F_Val":"0"},"Accuracy":{"Name":null,"N_Val":"14%","NO3_Val":null,"NH4_Val":null,"NH2_Val":null,"P_Val":"100%","K_Val":"21%","Ca_Val":"0%","Mg_Val":"0%","S_Val":"0%","B_Val":null,"Fe_Val":null,"Mn_Val":"0%","Zn_Val":"0%","Cu_Val":"0%","Mo_Val":"0%","Na_Val":null,"HCO3_Val":null,"CO3_Val":null,"CL_Val":null,"F_Val":null,"Ca_Color":null,"Mg_Color":null,"S_Color":null,"Na_Color":null,"HCO3_Color":null},"FriendlyAlerts":{"Alert":[{"Id":92,"AlertId":92,"Message":"Current application of nutrients N, K, Ca, Mg is less than 80% of actual requirement.","Severity":15,"MessageSource":"N, K, Ca, Mg"}]},"IsActive":true,"AlternativeCompoundFertilizers":{"Fertilizer":[]}}],"Success":true,"Message":null,"FertilizerScheduleId":0,"Status":1,"Result":true,"Errors":null,"ErrorNumber":null},"BaseDressingResponse":{"BaseDressingResult":{"N_Val":null,"NO3_Val":null,"NH2_Val":null,"NH4_Val":null,"P_Val":null,"K_Val":null,"Ca_Val":null,"Mg_Val":null,"S_Val":null,"B_Val":null,"Fe_Val":null,"Mn_Val":null,"Zn_Val":null,"Cu_Val":null,"Mo_Val":null,"Na_Val":null,"HCO3_Val":null,"CO3_Val":null,"CL_Val":null,"F_Val":null},"SelectedFertilizers":{"Fertilizer":[{"Id":11,"FertilizerId":11,"Name":"Potassium Nitrate","Concentration":"0","AcidConcentration":"","ConcentrationUnit":"2","IsLiquid":false,"Order":"1","IsLocked":false,"NotUsed":false,"IsSystemFert":true,"Cost":0,"ElementsConcentrations":{"N_Val":13,"NO3_Val":13,"NH2_Val":0,"NH4_Val":0,"P_Val":0,"K_Val":38,"Ca_Val":0,"Mg_Val":0,"S_Val":0,"B_Val":0,"Fe_Val":0,"Mn_Val":0,"Zn_Val":0,"Cu_Val":0,"Mo_Val":0,"Na_Val":0,"HCO3_Val":0,"CO3_Val":0,"CL_Val":0,"F_Val":0,"MicroElementsChelated":0}},{"Id":13,"FertilizerId":13,"Name":"Mono Potassium Phosphate (M.K.P)","Concentration":"428.5714","AcidConcentration":"","ConcentrationUnit":"2","IsLiquid":false,"Order":"2","IsLocked":false,"NotUsed":false,"IsSystemFert":true,"Cost":0,"ElementsConcentrations":{"N_Val":0,"NO3_Val":0,"NH2_Val":0,"NH4_Val":0,"P_Val":22.5,"K_Val":28,"Ca_Val":0,"Mg_Val":0,"S_Val":0,"B_Val":0,"Fe_Val":0,"Mn_Val":0,"Zn_Val":0,"Cu_Val":0,"Mo_Val":0,"Na_Val":0,"HCO3_Val":0,"CO3_Val":0,"CL_Val":0,"F_Val":0,"MicroElementsChelated":0}}]},"NeededAddition":{"Id":null,"Name":null,"N_Val":"577.0795","NO3_Val":null,"NH4_Val":null,"NH2_Val":null,"P_Val":"124.2","K_Val":"120","Ca_Val":null,"Mg_Val":null,"S_Val":"0","B_Val":null,"Fe_Val":null,"Mn_Val":"0","Zn_Val":"0","Cu_Val":"0","Mo_Val":"0","Na_Val":null,"HCO3_Val":null,"CO3_Val":null,"CL_Val":null,"F_Val":null},"FertAddition":{"Id":"FertAddition","Name":"FertAddition","N_Val":"0","NO3_Val":"0","NH4_Val":"0","NH2_Val":"0","P_Val":"96.42857","K_Val":"120","Ca_Val":"0","Mg_Val":"0","S_Val":"0","B_Val":"0","Fe_Val":"0","Mn_Val":"0","Zn_Val":"0","Cu_Val":"0","Mo_Val":"0","Na_Val":"0","HCO3_Val":"0","CO3_Val":"0","CL_Val":"0","F_Val":"0"},"ManureAddition":{"Id":null,"Name":null,"N_Val":"0","NO3_Val":"0","NH4_Val":"0","NH2_Val":"0","P_Val":"0","K_Val":"0","Ca_Val":"0","Mg_Val":"0","S_Val":"0","B_Val":"0","Fe_Val":"0","Mn_Val":"0","Zn_Val":"0","Cu_Val":"0","Mo_Val":"0","Na_Val":"0","HCO3_Val":"0","CO3_Val":"0","CL_Val":"0","F_Val":null},"Accuracy":{"Name":null,"N_Val":"0%","NO3_Val":null,"NH4_Val":null,"NH2_Val":null,"P_Val":"78%","K_Val":"100%","Ca_Val":"0%","Mg_Val":"0%","S_Val":"0%","B_Val":"0%","Fe_Val":"0%","Mn_Val":"0%","Zn_Val":"0%","Cu_Val":"0%","Mo_Val":"0%","Na_Val":"0%","HCO3_Val":"0%","CO3_Val":"0%","CL_Val":"0%","F_Val":null,"Ca_Color":null,"Mg_Color":null,"S_Color":null,"Na_Color":null,"HCO3_Color":null},"Percentage":{"Id":null,"Name":null,"N_Val":"50","NO3_Val":null,"NH4_Val":null,"NH2_Val":null,"P_Val":"40","K_Val":"5","Ca_Val":null,"Mg_Val":null,"S_Val":null,"B_Val":null,"Fe_Val":null,"Mn_Val":null,"Zn_Val":null,"Cu_Val":null,"Mo_Val":null,"Na_Val":null,"HCO3_Val":null,"CO3_Val":null,"CL_Val":null,"F_Val":null},"Success":true,"CEC":"15","SoilTypeId":"4","plotArea":"12","blockBS":true,"SoilDataExists":true,"Cost":0,"FriendlyAlerts":null},"Status":1,"Result":true,"Errors":null,"ErrorNumber":null}');
    constructor(private service: SoilService, private fb: FormBuilder, private route: ActivatedRoute,
        private router: Router, private messageService: MessageService, private translateService: TranslateService) {
        translateService.setDefaultLang('en')

      this.stepIndex = 0;
        const url_string = window.location.href;
        const url = new URL(url_string);
        this.payUrl = url.searchParams.get('credit_card_processed');
        if (this.payUrl == null) {
            this.router.navigate['/'];
        } else {
            if (this.payUrl == 'Y') {
                const urlS = url_string.split('?');
                history.pushState(url_string, null, urlS[0]);
                this.isPay = true;
                this.stepIndex = 4;
                this.form1 = JSON.parse(localStorage.getItem('form1'));
                this.form2 = JSON.parse(localStorage.getItem('form2'));
                this.form3 = JSON.parse(localStorage.getItem('form3'));
                this.cropId = JSON.parse(localStorage.getItem('cropid'));
                this.convertData = JSON.parse(localStorage.getItem('convert'));
                this.convertFinal = JSON.parse(localStorage.getItem('convertFinal'));
                this.sf = JSON.parse(localStorage.getItem('salesforce'));
                if (this.form1) {
                    this.service.updateSF(this.sf, this.form2.cropName)
                        .subscribe(data => {
                        });
                    this.getReport();
                } else {
                    window.location.href = '';
                }
            } else {
                this.router.navigate['/'];
            }
        }
    }

    getSum(index: string): number {
        let sum = 0;

        for (let i = 0; i < this.reportData.ScheduleResponse.stages.length; i++) {
            if (index == 'N') {
                sum += Number(this.reportData.ScheduleResponse.stages[i].FertAddition != null ? this.reportData.ScheduleResponse.stages[i].FertAddition.N_Val : 0);
            } else if (index == 'n') {
                sum += Number(this.reportData.ScheduleResponse.stages[i].FertAddition != null ? this.reportData.ScheduleResponse.stages[i].FertAddition.N_Val : 0) / this.reportData.ScheduleResponse.stages[i].Duration;
            } else if (index == 'P') {
                sum += Number(this.reportData.ScheduleResponse.stages[i].FertAddition != null ? this.reportData.ScheduleResponse.stages[i].FertAddition.P_Val : 0);
            } else if (index == 'p') {
                sum += Number(this.reportData.ScheduleResponse.stages[i].FertAddition != null ? this.reportData.ScheduleResponse.stages[i].FertAddition.P_Val : 0) / this.reportData.ScheduleResponse.stages[i].Duration;
            } else if (index == 'K') {
                sum += Number(this.reportData.ScheduleResponse.stages[i].FertAddition != null ? this.reportData.ScheduleResponse.stages[i].FertAddition.K_Val : 0);
            } else if (index == 'k') {
                sum += Number(this.reportData.ScheduleResponse.stages[i].FertAddition != null ? this.reportData.ScheduleResponse.stages[i].FertAddition.K_Val : 0) / this.reportData.ScheduleResponse.stages[i].Duration;
            }
        }
        return sum;
    }
  switchLanguage(language: string) {
    this.translateService.use(language);
    console.log(language)
  }
    ngOnInit() {
        this.service.getNutrients()
            .subscribe(data => {
                this.nutrientsData = data;
                this.service.getExtraction()
                    .subscribe(data => {
                        this.extractionData = data;

                        for (let i = 0; i < this.type.length; i++) {
                            this.cropNE = {
                                type: '',
                                nutrients: [],
                                extMethod: []
                            }
                            this.cropNE = {
                                type: this.type[i],
                                nutrients: this.nutrientsData.filter(a => a.type == this.type[i]),
                                extMethod: this.extractionData.filter(a => a.type == this.type[i])
                            }
                            this.alldata.push(this.cropNE);
                        }
                        // this.alldata = this.alldata.sort();
                    })
            })

        this.cropsData = data.CropList.filter(a => a.FertAppMethodId == 1);
        for (let i = 0; i < this.alpha.length; i++) {
            this.crop = {
                alpha: 'string',
                records: []
            }
            this.crop = {
                alpha: this.alpha[i],
                records: this.cropsData.filter(a => a.Name.toString().charAt(0) == this.alpha[i])
            }

            this.crops.push(this.crop);
        }

        this.form = this.fb.group({
            cardNumber: ['', CreditCardValidator.validateCardNumber],
            cardExpDate: ['', CreditCardValidator.validateCardExpiry],
            cardCvv: ['', CreditCardValidator.validateCardCvc],
            cardName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        });
        this.allcrops = this.crops;
        const s = document.createElement('script');
        s.src = 'https://www.2checkout.com/static/checkout/javascript/direct.min.js';
        document.querySelector('body').appendChild(s);
        this.step1Form = new FormGroup({
            firstName: new FormControl('', [
                Validators.required
            ]),
            lastName: new FormControl('', [
                Validators.required
            ]),
            email: new FormControl('', [
                Validators.required, Validators.pattern(this._emailRegEx)
            ]),
            country: new FormControl('', [
                Validators.required
            ]),
        });
        // this.step1Form.controls['country'].setValue('Afghanistan', { onlySelf: true });

        this.step2Form = new FormGroup({
            cropName: new FormControl('', [
                Validators.required
            ]),
            variety: new FormControl({ value: '', disabled: true }, [
                Validators.required
            ]),
            specifics: new FormControl({ value: '', disabled: true }, [
                Validators.required
            ]),
            plotSize: new FormControl('', [
                Validators.required
            ]),
            plotSizeUnit: new FormControl('', [
                Validators.required
            ]),
            averageYield: new FormControl('', [
                Validators.required
            ]),
            averageYieldUnit: new FormControl('', [
                Validators.required
            ]),
        });
        this.step2Form.controls['plotSizeUnit'].setValue('ppm', { onlySelf: true });
        this.step2Form.controls['averageYieldUnit'].setValue('ppm', { onlySelf: true });

        this.step3Form = new FormGroup({
            texture: new FormControl('', [
                Validators.required
            ]),
            organicMatter: new FormControl('', [
                Validators.required, Validators.min(0), Validators.max(99)
            ]),
            ph: new FormControl('', [
                Validators.required, Validators.min(1), Validators.max(13)
            ]),
            nutrientData: new FormArray([]),
        });
        this.step3Form.controls['texture'].setValue('1', { onlySelf: true });

        for (let i = 0; i < this.type.length; i++) {
            const control = <FormArray>this.step3Form.controls['nutrientData'];
            control.push(this.nutrientModel());
        }

        this.service.getUnites()
            .subscribe(data => {
                this.unitesData = data;
            })

        this.step5Form = new FormGroup({
            cardNo: new FormControl('', [
                Validators.required
            ]),
            expMonth: new FormControl('', [
                Validators.required
            ]),
            expYear: new FormControl('', [
                Validators.required
            ]),
            cvc: new FormControl('', [
                Validators.required
            ]),
        });
        if (this.payUrl == 'Y') {
            this.isPay = true;
            this.stepIndex = 4;
        } else {
            this.router.navigate['/'];
        }
    }

    nutrientModel() {
        return this.fb.group({
            Id: [''],
            nutrient: ['1', Validators.required],
            nutrientUnit: ['ppm', Validators.required],
            extMethod: ['1', Validators.required],
            value: ['', ],
        });
    }

    changeText1(name, id) {
        this.DropdownVar = 0;
        this.step2Form.controls['cropName'].setValue(name);
        this.selectedCrop = name;
        this.varietyData = [];
        this.soilType = [];
        this.step2Form.controls['variety'].disable();
        this.step2Form.controls['specifics'].disable();
        this.cropId = id;
        this.service.postLogin()
            .subscribe(data => {
                this.service.getVarieties(data.UserId, data.Token, id)
                    .subscribe(data1 => {
                        if (data1) {
                            this.varietyData = data1.Varieties.Variety;
                            this.step2Form.controls['variety'].enable();
                            this.step2Form.controls['specifics'].enable();
                            this.soilType = data1.Varieties.Variety[0].SoilTypes.SoilType;
                        }
                    });
            });
        localStorage.setItem('cropid', JSON.stringify(this.cropId));
    }

    changeText2(event) {
        this.soilType = [];
        this.step2Form.controls['specifics'].disable();
        for (let i = 0; i < this.varietyData.length; i++) {
            if (this.varietyData[i].Id == event) {
                this.soilType = this.varietyData[i].SoilTypes.SoilType;
                this.varietyName = this.varietyData[i].Name;
            }

        }
        this.step2Form.controls['specifics'].enable();
    }

    step1() {
        this.form1 = this.step1Form.value;
        localStorage.setItem('form1', JSON.stringify(this.form1));
        this.service.signupSF(this.form1)
            .subscribe(data => {
                localStorage.setItem('salesforce', JSON.stringify(data));
            });
    }
    step2() {
        this.form2 = this.step2Form.value;
        localStorage.setItem('form2', JSON.stringify(this.form2));
    }
    step3() {
        this.form3 = this.step3Form.value;
        this.convertData = [];
        this.isConvert = true;
        for (let i = 0; i < this.form3.nutrientData.length; i++) {
            const fill = this.alldata[i];
            // localStorage.removeItem("covert");

            for (let j = 0; j < fill.nutrients.length; j++) {
                if (fill.nutrients[j].value.id == this.form3.nutrientData[i].nutrient) {
                    this.form3.nutrientData[i].nutrient = fill.nutrients[j].value.name;
                }
            }
            for (let j = 0; j < fill.extMethod.length; j++) {
                if (fill.extMethod[j].value.id == this.form3.nutrientData[i].extMethod) {
                    this.form3.nutrientData[i].extMethod = fill.extMethod[j].value.name;
                }
            }
            let nur = {
                changeNutrientForm: 0,
                name: ''
            }
            this.service.postConvertionValue(this.form3.nutrientData[i], this.type[i])
                .subscribe(data => {
                    nur = {
                        changeNutrientForm: data.changeNutrientForm,
                        name: this.type[i]
                    }
                    this.convertData.push(data);
                    this.convertFinal.push(nur);
                    localStorage.setItem('convertFinal', JSON.stringify(this.convertFinal));
                    localStorage.setItem('convert', JSON.stringify(this.convertData));
                });
            if ((this.form3.nutrientData.length - 1) == i) {
                this.isConvert = false;
            }
        }
        localStorage.setItem('form3', JSON.stringify(this.form3));
    }

    getReport() {
        this.service.postLogin()
            .subscribe(data => {

                this.service.getYieldGoal(this.cropId, data.UserId, data.Token, this.form2, 1)
                    .subscribe(data2 => {
                        this.finalYield = data2.Id;
                        this.service.postReport(this.form1, this.form2, this.form3, this.convertFinal, this.cropId, data.UserId, data.Token, this.finalYield)
                            .subscribe(data1 => {
                                this.reportData = data1;
                                for (let i = 0; i < this.reportData.ScheduleResponse.stages.length; i++) {
                                    this.fullfilled_N = 0;
                                    this.fullfilled_P = 0;
                                    this.fullfilled_K = 0;

                                    this.actual_N = this.actual_N + Number(this.reportData.ScheduleResponse.stages[i].NeededAddition != null ? this.reportData.ScheduleResponse.stages[i].NeededAddition.N_Val : 0);
                                    this.actual_P = this.actual_P + Number(this.reportData.ScheduleResponse.stages[i].NeededAddition != null ? this.reportData.ScheduleResponse.stages[i].NeededAddition.P_Val : 0);
                                    this.actual_K = this.actual_K + Number(this.reportData.ScheduleResponse.stages[i].NeededAddition != null ? this.reportData.ScheduleResponse.stages[i].NeededAddition.K_Val : 0);

                                    this.current_N = this.current_N + Number(this.reportData.ScheduleResponse.stages[i].FertAddition != null ? this.reportData.ScheduleResponse.stages[i].FertAddition.N_Val : 0);
                                    this.current_P = this.current_P + Number(this.reportData.ScheduleResponse.stages[i].FertAddition != null ? this.reportData.ScheduleResponse.stages[i].FertAddition.P_Val : 0);
                                    this.current_K = this.current_K + Number(this.reportData.ScheduleResponse.stages[i].FertAddition != null ? this.reportData.ScheduleResponse.stages[i].FertAddition.K_Val : 0);

                                    this.fullfilled_N = 100 * (this.actual_N / (this.current_N == 0 ? 1 : this.current_N));
                                    this.fullfilled_P = 100 * (this.actual_P / (this.current_P == 0 ? 1 : this.current_P));
                                    this.fullfilled_K = 100 * (this.actual_K / (this.current_P == 0 ? 1 : this.current_P));

                                    this.value = 100;

                                }
                                this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Report Generated Successfully' });
                                this.isReportPage = false;
                            });
                    }, error => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
                    });

            });
    }

    changed() {
        this.DropdownVar = 2;
        (this.step2Form.controls['cropName'] as FormControl).valueChanges.subscribe(value => {
            if (value) {
                this.crops = [];
                for (let i = 0; i < this.alpha.length; i++) {
                    if (this.alpha[i] == value.toString().toUpperCase().charAt(0)) {
                        this.crop = {
                            alpha: 'string',
                            records: []
                        }
                        if (value.toString().length == 1) {
                            this.crop = {
                                alpha: this.alpha[i],
                                records: this.cropsData.filter(a => {
                                    return a.Name.toString().toLowerCase().includes(value.toString().toLowerCase().charAt(0))
                                })
                            }
                        } else {
                            this.crop = {
                                alpha: '',
                                records: this.cropsData.filter(a => {
                                    return a.Name.toString().toLowerCase().includes(value.toString().toLowerCase())
                                })
                            }
                        }

                        this.crops.push(this.crop);
                    }
                }
                // this.crops = this.crops.filter(a => a.alpha == value.toString().toUpperCase().charAt(0));
            } else {
                this.crops = this.allcrops;
            }
        });

    }

    nutrientChange() {
        this.form3 = this.step3Form.value;
        this.isNutrient = true;
        for (let i = 0; i < this.form3.nutrientData.length; i++) {
            if (this.form3.nutrientData[i].value > 0 && this.form3.nutrientData[i].value != null) {
                this.isNutrient = false;
                break;
            } else {
                this.isNutrient = true;
            }
        }
    }

    captureScreen() {
        // return xepOnline.Formatter.Format(document.getElementById('contentToConvert'), { render: 'download' })
        // var pdf = new jspdf('p', 'mm', 'a4');
        const data = document.getElementById('contentToConvert');
        // let margins = { top: 10, bottom: 10, left: 10, right: 10 };
        // let d = new Date();
        // pdf.addHTML(data, function () {
        //     pdf.save('FertilizerSchedule_' + d + '.pdf'); // Generated PDF
        // });

        // let doc = new jspdf('p', 'mm', 'a4');
        // doc.autoTable({
        //     head: [['Log', '', 'Amount']],
        //     body: [["log1", "$100"], ["log2", "$200"]]
        // });
        // doc.save('table.pdf')
        // let imageData = this.getBase64Image(document.getElementById('contentToConvert'));
        // console.log(imageData);
        // doc.addImage(imageData, "JPG", 10, 10, 180, 150);
        // doc.addPage();
        // doc.save('Test.pdf');
        html2canvas(data).then(canvas => {
            // Few necessary setting options
            const imgWidth = 190;
            const pageHeight = 250;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;

            const contentDataURL = canvas.toDataURL('image/jpeg')
            const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
            const d = new Date();
            let position = 10;
            pdf.addImage(contentDataURL, 'JPEG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(contentDataURL, 'JPEG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save('FertilizerSchedule_' + d + '.pdf'); // Generated PDF
        });

    }

    getBase64Image(img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        return dataURL;
    }

    scrolltoTop(id) {
        this.stepIndex = id;
        if (this.stepIndex !== 0) {
            this.isText = false;
            this.isStep5 = false;
          this.isReportPage = false;
          this.firstPage = true;

        } else {
            this.isText = true;
          this.isStep5 = false;

        }
        if (this.stepIndex === 4) {
          this.isReportPage = true;
          this.firstPage = false;
        }
        window.scrollTo(0, 0);
    }


}
