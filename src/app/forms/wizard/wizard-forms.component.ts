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
    pageCount = 1;
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
  defaultUnit = '';
  defaultAverageYieldUnit = '';
  defaultSoilTexture = '';
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

    SetLabel(x, y, text, doc, column = 0) {
        const columnCounter = 60;
        doc.setTextColor(0, 153, 51);
        doc.setFontSize(8);
        doc.text(x + column * columnCounter, y, text.toString() + ' :');
    }

    SetColon(x, y, doc, column = 0) {
        // const counter = x + 22;
        // const columnCounter = 60;
        // doc.setTextColor(0, 153, 51);
        // doc.setFontSize(8);
        // doc.text(counter + column * columnCounter, y, ':');
    }

    SetValue(x, y, text, doc, column = 0) {
        const counter = x + 28;
        const columnCounter = 60;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.text(counter + column * columnCounter, y, text.toString());
    }

    BuildHeaderBlock(doc) {
        const x = 20;
        let y = 55;

        this.SetLabel(x, y, 'Program', doc, 0);
        this.SetColon(x, y, doc, 0);
        this.SetValue(x, y, '', doc, 0);

        this.SetLabel(x, y, 'Crop', doc, 1);
        this.SetColon(x, y, doc, 1);
        if (this.form2 && this.form2.cropName)
            this.SetValue(x, y, this.form2.cropName, doc, 1);

        this.SetLabel(x, y, 'Planting Date', doc, 2);
        this.SetColon(x, y, doc, 2);
        this.SetValue(x, y, '', doc, 2);

        y += 11;

        this.SetLabel(x, y, 'Farm', doc, 0);
        this.SetColon(x, y, doc, 0);
        this.SetValue(x, y, '', doc, 0);

        this.SetLabel(x, y, 'Variety', doc, 1);
        this.SetColon(x, y, doc, 1);
        this.SetValue(x, y, '', doc, 1);

        this.SetLabel(x, y, 'Application Method', doc, 2);
        this.SetColon(x, y, doc, 2);
        this.SetValue(x, y, '', doc, 2);

        y += 11;

        this.SetLabel(x, y, 'Field', doc, 0);
        this.SetColon(x, y, doc, 0);
        this.SetValue(x, y, '', doc, 0);

        this.SetLabel(x, y, 'Growing Method', doc, 1);
        this.SetColon(x, y, doc, 1);
        this.SetValue(x, y, '', doc, 1);

        y += 11;


        this.SetLabel(x, y, 'Field Area', doc, 0);
        this.SetColon(x, y, doc, 0);
        this.SetValue(x, y, '', doc, 0);

        this.SetLabel(x, y, 'Yield Goal', doc, 1);
        this.SetColon(x, y, doc, 1);
        if (this.form2 && this.form2.averageYield)
            this.SetValue(x, y, this.form2.averageYield, doc, 1);

        return y;
    }

    BuildNutrientSummary(doc, y, stages) {
        y = this.AddNewPageRequired(doc, y, 25, false);
        y += 20;
        doc.setFontSize(15);
        doc.setTextColor(0, 153, 51);
        doc.text(20, y, '> ');

        doc.setTextColor(0, 153, 51);
        doc.text(20 + 4, y, 'Stages');

        for (let iCntr = 0; iCntr < stages.length; iCntr++) {
            const stage = stages[iCntr];

            y = this.AddNewPageRequired(doc, y, 25, false);
            y += 20;
            doc.setFontSize(15);
            doc.setTextColor(0, 153, 51);
            doc.text(20, y, '> ');

            doc.setTextColor(0, 0, 0);
            doc.text(20 + 4, y, stage.Name.toString());

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(11);
            doc.text(105, y, 'Duration ' + stage.Duration + ' days');
            y += 5;
            doc.line(25, y, 185, y);

            y += 5;
            doc.setFontSize(9);
            doc.setTextColor(0, 153, 51);

            doc.text(30, y, 'Fertilizer Name');
            doc.text(70, y, '');
            doc.text(110, y, 'Application Amount');
            doc.text(150, y, 'Unit');

            y += 3;
            doc.line(25, y, 185, y);

            for (let i = 0; i < stage.SelectedFertilizers.Fertilizer.length; i++) {
                if (stage.SelectedFertilizers.Fertilizer[i].Concentration !== '') {

                    y = this.AddNewPageRequired(doc, y, 8, true);
                    y += 5;
                    doc.setFontSize(8);
                    doc.setTextColor(0, 0, 0);

                    doc.text(30, y, stage.SelectedFertilizers.Fertilizer[i].Name);
                    doc.text(70, y, '');
                    doc.text(110, y, stage.SelectedFertilizers.Fertilizer[i].Concentration);
                    // tslint:disable-next-line:max-line-length
                    const unit = this.GetUnit(stage.SelectedFertilizers.Fertilizer[i].ConcentrationUnit, stage.SelectedFertilizers.Fertilizer[i].averageYieldUnit)
                    doc.text(150, y, unit);
                    y += 3;
                    doc.line(25, y, 185, y);
                }
            }
        }
        return y;

    }

    BuildEstablishment(doc, y, stages) {
        y = this.AddNewPageRequired(doc, y, 25, false);
        y += 20;
        doc.setFontSize(15);
        doc.setTextColor(0, 153, 51);
        doc.text(20, y, '> ');

        doc.setTextColor(0, 153, 51);
        doc.text(20 + 4, y, 'Season Summary - Fertilizers');

        y += 5;
        doc.line(25, y, 185, y);

        y += 5;
        doc.setFontSize(9);
        doc.setTextColor(0, 153, 51);

        doc.text(30, y, 'Fertilizer');
        doc.text(140, y, 'Quantity');
        // doc.text(150, y, '');

        y += 3;
        doc.line(25, y, 185, y);
        for (let iCntr = 0; iCntr < stages.length; iCntr++) {
            const stage = stages[iCntr];

            for (let i = 0; i < stage.SelectedFertilizers.Fertilizer.length; i++) {
                if (stage.SelectedFertilizers.Fertilizer[i].Concentration !== '') {
                    y = this.AddNewPageRequired(doc, y, 8, true);
                    y += 5;
                    doc.setFontSize(8);
                    doc.setTextColor(0, 0, 0);
                    doc.text(30, y, stage.SelectedFertilizers.Fertilizer[i].Name);
                    doc.text(125, y, stage.SelectedFertilizers.Fertilizer[i].Concentration);
                    // tslint:disable-next-line:max-line-length
                    const unit = this.GetUnit(stage.SelectedFertilizers.Fertilizer[i].ConcentrationUnit, stage.SelectedFertilizers.Fertilizer[i].averageYieldUnit)
                    doc.text(155, y, unit);

                    y += 3;
                    doc.line(25, y, 185, y);
                }
            }
        }
        return y;
    }

    BuildSeasonSummary(doc, y, stages) {
        y = this.AddNewPageRequired(doc, y, 25, false);
        y += 20;
        doc.setFontSize(15);
        doc.setTextColor(0, 153, 51);
        doc.text(20, y, '> ');

        doc.setTextColor(0, 153, 51);
        doc.text(20 + 4, y, 'Seaon Summary - ');
        doc.setTextColor(0, 0, 0);
        doc.setFontType('bold');
        doc.text(68, y, 'NPK Distribution');

        // doc.setFontType('normal');
        // y += 10;
        // doc.line(25, y, 185, y);

        y += 10;
        doc.setTextColor(0, 153, 51);
        doc.text(100, y, 'N');
        doc.text(135, y, 'P');
        doc.text(168, y, 'K');

        doc.setFontType('normal');
        y += 3;
        doc.line(25, y, 185, y);

        y += 5;
        doc.setFontSize(9);
        doc.setTextColor(0, 153, 51);

        doc.text(30, y, 'Stage Name');

        doc.setFontSize(7);
        doc.text(85, y, 'kg/ha/stage');
        doc.text(100, y, 'kg/ha/day');

        doc.text(121, y, 'kg/ha/stage');
        doc.text(136, y, 'kg/ha/day');

        doc.text(157, y, 'kg/ha/stage');
        doc.text(172, y, 'kg/ha/day');


        y += 3;
        doc.line(25, y, 185, y);

        for (let i = 0; i < stages.length; i++) {
            const stage = stages[i];
            y = this.AddNewPageRequired(doc, y, 8, true);
            y += 5;
            doc.setFontSize(8);
            doc.setTextColor(0, 0, 0);
            doc.text(30, y, stage.Name);
            doc.text(90, y, this.NumberToDecimalPlaces(stage.FertAddition.N_Val, 2).toString());
            doc.text(105, y, this.NumberToDecimalPlaces((+(stage.FertAddition.N_Val) / +(stage.Duration)), 2).toString());

            doc.text(126, y, this.NumberToDecimalPlaces(stage.FertAddition.P_Val, 2).toString());
            doc.text(141, y, this.NumberToDecimalPlaces((+(stage.FertAddition.P_Val) / +(stage.Duration)), 2).toString());

            doc.text(162, y, this.NumberToDecimalPlaces(stage.FertAddition.K_Val, 2).toString());
            doc.text(177, y, this.NumberToDecimalPlaces((+(stage.FertAddition.K_Val) / +(stage.Duration)), 2).toString());

            y += 3;
            doc.line(25, y, 185, y);
        }


        // Add Total
        y = this.AddNewPageRequired(doc, y, 8, true);

        doc.setFillColor(0, 153, 51);
        doc.rect(25, y, 160, 8, 'F');
        doc.line(25, y, 185, y);
        // doc.line(0, 95, 210, 95);

        y += 5;
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.text(30, y, 'Total');
        doc.text(90, y, this.NumberToDecimalPlaces(this.getSum('N'), 2).toString());
        doc.text(105, y, this.NumberToDecimalPlaces(this.getSum('n'), 2).toString());

        doc.text(126, y, this.NumberToDecimalPlaces(this.getSum('P'), 2).toString());
        doc.text(141, y, this.NumberToDecimalPlaces(this.getSum('p'), 2).toString());

        doc.text(162, y, this.NumberToDecimalPlaces(this.getSum('K'), 2).toString());
        doc.text(177, y, this.NumberToDecimalPlaces(this.getSum('k'), 2).toString());

        y += 3;
        doc.line(25, y, 185, y);

        return y;
    }

    NumberToDecimalPlaces(numbertoChange: number, dec) {
        return parseFloat(Math.round((numbertoChange * 100) / 100).toFixed(dec));
    }

    AddNewPageRequired(doc, y, rowRequiredHeight, flagforline = false) {
        const margin = 15;
        if (y + rowRequiredHeight + margin > 296) {
            this.AddFooter(doc);
            doc.addPage();
            this.AddHeader(doc);
            y = margin + 10;
            if (flagforline) {
                doc.line(25, y, 185, y);
            }
        }
        return y;
    }

    AddHeader(doc) {

        // Title / Logo Section

        // tslint:disable-next-line:max-line-length
        const img = 'data:image/jpeg;base64,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'
        doc.addImage(img, 'JPEG', 10, 2, 60, 18);
        // Title / Logo Section Ends
    }

    AddFooter(doc) {
        doc.line(0, 283, 210, 283);
        doc.setFontSize(10);
        doc.setTextColor(155, 155, 155);
        doc.text(50, 293, '<Link to Website>');
        doc.text(180, 293, 'Page - ' + this.pageCount++);

    }

    BuildPDFbySelf(stages) {


        // a4 210 * 297

        const doc = new jspdf('p', 'mm', 'a4');

        this.AddHeader(doc);

        // Header Section
        doc.setFontSize(20);
        doc.setTextColor(0, 153, 51);
        doc.text(20, 40, 'Fertilizer Schedule');

        doc.setFontSize(12);
        doc.setTextColor(0, 153, 51);
        doc.text(140, 40, new Date().toLocaleDateString());

        // Header Ends


        // Draw Rectangle

        doc.setFillColor(220, 220, 220);
        doc.rect(0, 45, 210, 50, 'F');
        doc.line(0, 45, 210, 45);
        doc.line(0, 95, 210, 95);


        // Fill Data
        let y = this.BuildHeaderBlock(doc);



        // Build Nutrient Summary
        if (stages != null) {
            y = this.BuildNutrientSummary(doc, y, stages);

            // Build Estalishment
            y = this.BuildEstablishment(doc, y, stages);

            // Build Season Summary
            y = this.BuildSeasonSummary(doc, y, stages);

        }
        this.AddFooter(doc);
        // doc.save('FertilizerSchedule_');
        const d = new Date();
        // console.log(doc.output('datauristring'));
        // Try to save PDF as a file (not works on ie before 10, and some mobile devices)
        // console.log(doc.output('save', 'filename.pdf'));
        // console.log(doc.output('datauristring'));        // returns the data uri string
        // console.log(doc.output('datauri'));              // opens the data uri in current window
        // console.log(doc.output('dataurlnewwindow'));
        doc.save('FertilizerSchedule_' + d + '.pdf'); // Generated PDF
    }

    captureScreen(reportData) {
        if (reportData != null) {
            this.BuildPDFbySelf(reportData.ScheduleResponse.stages);
        } else {
            this.BuildPDFbySelf(null);
        }
        // this.HitApiForData();
        return;
    }

    GetUnit(concUnit, averageYieldUnit) {
        if (+concUnit === 4 && averageYieldUnit !== 'ton/Acre') {
            return 'litre'
        }
        if (+concUnit === 6 && averageYieldUnit !== 'ton/Acre') {
            return 'Kg'
        }
        if (+concUnit === 9 && averageYieldUnit !== 'ton/Acre') {
            return 'lbs'
        }
        if (+concUnit === 6 && averageYieldUnit === 'ton/Acre') {
            return 'Lbs'
        }
        if (+concUnit === 4 && averageYieldUnit === 'ton/Acre') {
            return 'gal'
        }

        return '';

    }



    HitApiForData() {
        // tslint:disable-next-line:max-line-length
        const payload = `{"userId":39501,"token":"ca071c46-fe0f-43e9-acde-61f5ccb24f39","Crop":{"CropId":14,"VarietyId":2,"YieldGoalId":1,"plantingDate":""},"Farmer":{"Email":"powerbi@gerenteeletronico.com.br","FirstName":"Kumar Gaurav","LastName":"Jindal","Phone":"null","State":"null","Zip":"null","Country":"Benin"},"Plot":{"FarmName":"Kumar Gaurav_Jindal","LocationGEO":{"features":[{"geometry":{"coordinates":[-100.41402518749238,48.0781936333024],"type":"Point"},"properties":{},"type":"Feature"}],"type":"FeatureCollection"},"PlotArea":1,"PlotName":"plot1","PlotTypeId":1},"SoilTest":{"SoilLabId":1,"SoilLabName":"Default","SoilTestName":"farm1, test1","ST_Date":"01/07/18","ST_SoilType":1,"ST_LayerDepth":20,"R_LayerDepth":20,"ST_CEC":15,"ST_BulkDensity":1.2,"ST_OM":1,"ST_EC_Val":1,"ST_PH_Val":1,"ST_AverageTemp":20,"EM_N_Cbo":"1","EM_P_Cbo":"1","EM_K_Cbo":"1","EM_Ca_Cbo":"1","EM_Mg_Cbo":"1","EM_S_Cbo":"1","EM_B_Cbo":"1","EM_Fe_Cbo":"1","EM_Mn_Cbo":"1","EM_Zn_Cbo":"1","EM_Cu_Cbo":"1","EM_Mo_Cbo":"1","EM_Na_Cbo":"1","UnitId":1,"N_Val":1,"P_Val":null,"K_Val":null,"Ca_Val":null,"Mg_Val":null,"S_Val":null,"B_Val":null,"Fe_Val":null,"Mn_Val":null,"Zn_Val":null,"Cu_Val":null,"Mo_Val":null,"Na_Val":null},"Fertilizers":{"Fertilizer":[{"Id":9,"FertilizerId":9,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":15,"FertilizerId":15,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":163,"FertilizerId":163,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":23,"FertilizerId":23,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":17,"FertilizerId":17,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":164,"FertilizerId":164,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":838,"FertilizerId":838,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":4,"FertilizerId":4,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":2,"FertilizerId":2,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":3,"FertilizerId":3,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":24,"FertilizerId":24,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":14,"FertilizerId":14,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":4657,"FertilizerId":4657,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":4552,"FertilizerId":4552,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":4551,"FertilizerId":4551,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":12,"FertilizerId":12,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":13,"FertilizerId":13,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":159,"FertilizerId":159,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":11,"FertilizerId":11,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":10,"FertilizerId":10,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":6235,"FertilizerId":6235,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":165,"FertilizerId":165,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":6234,"FertilizerId":6234,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":25,"FertilizerId":25,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":4490,"FertilizerId":4490,"ConcentrationUnit":4,"AcidConcentration":"0"},{"Id":18,"FertilizerId":18,"ConcentrationUnit":1,"AcidConcentration":"0"},{"Id":1,"FertilizerId":1,"ConcentrationUnit":1,"AcidConcentration":"0"}]}}`;
        this.service.postTemp(payload).subscribe(
            (datas) => {
                console.log(datas);
                this.reportData = datas;
                for (let i = 0; i < this.reportData.ScheduleResponse.stages.length; i++) {
                    this.fullfilled_N = 0;
                    this.fullfilled_P = 0;
                    this.fullfilled_K = 0;

                    // tslint:disable-next-line:max-line-length
                    this.actual_N = this.actual_N + Number(this.reportData.ScheduleResponse.stages[i].NeededAddition != null ? this.reportData.ScheduleResponse.stages[i].NeededAddition.N_Val : 0);
                    // tslint:disable-next-line:max-line-length
                    this.actual_P = this.actual_P + Number(this.reportData.ScheduleResponse.stages[i].NeededAddition != null ? this.reportData.ScheduleResponse.stages[i].NeededAddition.P_Val : 0);
                    // tslint:disable-next-line:max-line-length
                    this.actual_K = this.actual_K + Number(this.reportData.ScheduleResponse.stages[i].NeededAddition != null ? this.reportData.ScheduleResponse.stages[i].NeededAddition.K_Val : 0);

                    // tslint:disable-next-line:max-line-length
                    this.current_N = this.current_N + Number(this.reportData.ScheduleResponse.stages[i].FertAddition != null ? this.reportData.ScheduleResponse.stages[i].FertAddition.N_Val : 0);
                    // tslint:disable-next-line:max-line-length
                    this.current_P = this.current_P + Number(this.reportData.ScheduleResponse.stages[i].FertAddition != null ? this.reportData.ScheduleResponse.stages[i].FertAddition.P_Val : 0);
                    // tslint:disable-next-line:max-line-length
                    this.current_K = this.current_K + Number(this.reportData.ScheduleResponse.stages[i].FertAddition != null ? this.reportData.ScheduleResponse.stages[i].FertAddition.K_Val : 0);

                    this.fullfilled_N = 100 * (this.actual_N / (this.current_N == 0 ? 1 : this.current_N));
                    this.fullfilled_P = 100 * (this.actual_P / (this.current_P == 0 ? 1 : this.current_P));
                    this.fullfilled_K = 100 * (this.actual_K / (this.current_P == 0 ? 1 : this.current_P));

                    this.value = 100;

                }
                this.BuildPDFbySelf(datas.ScheduleResponse.stages);
            })
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
