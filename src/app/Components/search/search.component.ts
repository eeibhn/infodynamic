import { DatabaseService } from './../../Services/database.service';
import { Component, OnInit } from '@angular/core';
import { SearchDevices, SearchType, ScheduleType } from 'src/app/model/infodata';
import { DeviceType } from 'src/app/model/infodata';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { EventEmitter, NgModule, Output } from '@angular/core';
import { FileoperationsService } from 'src/app/Services/fileoperations.service';

import * as html2pdf from 'html2pdf.js';
import { jsPDF } from "jspdf";
import  html2canvas  from 'html2canvas';
import { Subscription } from 'rxjs';
import { getMatScrollStrategyAlreadyAttachedError } from '@angular/cdk/overlay/scroll/scroll-strategy';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {



  dropDownList = [];
  selectedItems = [];

  selectedDevices = [];

  selectedFile:File = null;
  message = null;

  selectedDeviceTypes = ['Electricity'];
  startdevice: any = 0;
  endDeviceValue: any = 19990;
  stime: any;
  etime: any;
  name:string = '';
  startrangedate = [new Date(2012, 0, 1),new Date(2012, 0, 1)];

  subscription: Subscription;
  startDate = new Date();
  endDate = new Date();

  dummy = this.endDate.setDate(this.startDate.getDate()+1);

startscheduledate =moment();
today =moment();
endscheduledate =this.today.add(1,'days');

currentscheduledate: string;
testmessage:ScheduleType[];


  storedSearchValues:SearchType = {

      selectedDeviceType:['Water'],
      startdevice:2345,
      endDeviceValue:10000,
      startTime:this.startDate,
      endTime:this.endDate,
      startscheduledate:this.startDate,
      endscheduledate:this.endDate,
      rangedate:[new Date(2012, 0, 1),new Date(2012, 0, 1)],
      name:this.name,
      frequency:0
    };

  private enableCall = false;
  private _uploadvalue  = 0;


  searchValues = [];

  deviceType$: Observable<DeviceType[]>;
  searchDevices$: Observable<SearchDevices[]>;
  returnedSearchDevices$: Observable<SearchDevices[]>;
  @Output() messageSearchEvent = new EventEmitter<Observable<SearchDevices[]>>();
  @Output() sendSearchCriteria = new EventEmitter<SearchType>();

  constructor(private databaservice: DatabaseService,
              private fileoperations: FileoperationsService) { }


  ngOnInit(): void {


    this.deviceType$ = this.fetchAllDeviceTypes();
    //this.searchDevices$ = this.fetchSearchResults(this.searchValues);

    //this.fetchAllDeviceTypes().
    //  subscribe(data => { this.dropDownList = data;
    //});

    this.subscription = this.databaservice.currentScheduleMessage.subscribe(message => {
      this.testmessage = message;
      console.log('something changed',this.testmessage);
    //  this.genPDF();
    })

  }


  print(){      window.print();}

  getName(val: any){

    this.name = val.target.value;
    console.log('name', this.name);
  }
  // Start value
  // tslint:disable-next-line: typedef
  getStartVal(val: any){

    this.startdevice = val.target.value;
    console.log('start value', this.startdevice);
  }



  // End Value
  // tslint:disable-next-line: typedef
  getEndVal(val: any){

    this.endDeviceValue = val.target.value;
    console.log('end value', this.endDeviceValue);
  }


// Drop Down Menu

   // tslint:disable-next-line: typedef
   selectChangeHandler(val: any){
    //this.selectedDeviceTypes.push(val);
    console.log('Search Component TS', this.selectedDeviceTypes);
  }


  // tslint:disable-next-line: typedef
  selectStartDateHandler(val: any){
    this.startDate = val;
    console.log('Search Component TS', val);

  }

         // tslint:disable-next-line: typedef
  selectEndDateHandler(val: any){
      this.endDate = val;
      console.log('Search Component TS', val);
  }

  // tslint:disable-next-line: typedef
  clickEvent(){
    this.searchValues = [];

    this.stime = moment(this.startDate.toLocaleString()).format('DD/MM/YYYY, HH:mm:ss');
    this.etime = moment(this.endDate.toLocaleString()).format('DD/MM/YYYY, HH:mm:ss');

    this.searchValues.push(this.selectedDeviceTypes);
    this.searchValues.push(this.startdevice);
    this.searchValues.push(this.endDeviceValue);
    this.searchValues.push(this.stime);
    this.searchValues.push(this.etime);

    this.searchDevices$ = this.fetchSearchResults(this.searchValues);
    console.log('Search Data 1', this.searchDevices$);

    this.messageSearchEvent.emit(this.searchDevices$);
    return this.searchDevices$;
  }

  get uploadvalue(): number {
    return this._uploadvalue;
  }

  set uploadvalue(value: number){
    if (!isNaN(value) && value <= 100){
      if (!this.enableCall && value !== 100) { return; }
      this.enableCall = false;
      this._uploadvalue = value;
      setTimeout(() => this.enableCall = true, 250);
    }
  }


  uploadFile(pdfFile: Blob, filename) {
    this.fileoperations.uploadBlob(pdfFile, filename)
      .subscribe(
       (data: any) => {
        if (data.responseCode === 200 ) {
          //succesfully uploaded to back end server
        }},
       (error) => {
         //error occured
       }
     )
  }

  genPDF(){

    var myelement1 = document.getElementById("element-to-export");
    var myelement2 = document.querySelector("#capture");
    const myheight = myelement1.clientHeight;
    const mywidth = myelement1.clientWidth;
    console.log('my width',mywidth);
    this.currentscheduledate = moment(this.endDate.toLocaleString()).format('YYYYMMDDHHMMSS').toString();
    const filename = this.name+'-'+this.currentscheduledate+'.pdf';
    console.log('mydate', filename);

    const thisData = this;
    var doc= new jsPDF();
     html2canvas(myelement1).then(canvas => {
      doc = new jsPDF ('p', 'mm', 'a4');
      var imageHeight = canvas.height * 208 / canvas.width;
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 208, imageHeight);
      doc.save(filename);
      doc.setProperties({ title: 'test' });
      this.uploadFile(doc.output('blob'),filename);
    });
  }




  storeSearchCriteria(){
    this.genPDF();

    this.storedSearchValues.selectedDeviceType=this.selectedDeviceTypes;
    this.storedSearchValues.startdevice=this.startdevice;
    this.storedSearchValues.endDeviceValue=this.endDeviceValue;
    this.storedSearchValues.name=this.name;

    this.storedSearchValues.startTime = moment(this.startDate.toLocaleString()).format('DD/MM/YYYY');
    this.storedSearchValues.endTime = moment(this.endDate.toLocaleString()).format('DD/MM/YYYY');
    this.storedSearchValues.startscheduledate = moment(this.startDate.toLocaleString()).format('DD/MM/YYYY');
    this.storedSearchValues.endscheduledate = moment(this.endDate.toLocaleString()).format('DD/MM/YYYY');
    this.storedSearchValues.rangedate[0]=this.storedSearchValues.startscheduledate;
    this.storedSearchValues.rangedate[1]=this.storedSearchValues.endscheduledate;


    console.log('Search Data to Store', this.storedSearchValues, this.startscheduledate);

    this.sendSearchCriteria.emit(this.storedSearchValues);



  }

  fetchSearchResults(searchParameters): Observable<SearchDevices[]> {
    console.log('Search Data 2', searchParameters);
    return this.databaservice.getSearchResult(searchParameters);
  }

  fetchAllDeviceTypes(): Observable<DeviceType[]> {
    console.log("here",this.databaservice.getDeviceTypeDropDownValues());
    return this.databaservice.getDeviceTypeDropDownValues();
  }
}
