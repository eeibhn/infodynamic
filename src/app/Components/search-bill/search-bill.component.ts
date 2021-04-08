import { DatabaseService } from './../../Services/database.service';
import { Component, OnInit } from '@angular/core';
import { SearchDevices } from 'src/app/model/infodata';
import { DeviceType } from 'src/app/model/infodata';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { EventEmitter, NgModule, Output } from '@angular/core';

@Component({
  selector: 'app-search-bill',
  templateUrl: './search-bill.component.html',
  styleUrls: ['./search-bill.component.scss']
})
export class SearchBillComponent implements OnInit {



  dropDownList = [];
  selectedItems = [];

  selectedDevices = [];

  selectedDeviceTypes = []
  startDeviceValue: any = 0;
  endDeviceValue: any = 1000000000;
  stime: any;
  etime: any;

  startDate = new Date(2012, 0, 1);
  endDate = new Date(2020, 12, 12);


  searchValues = [];

  deviceType$: Observable<DeviceType[]>;
  searchDevices$: Observable<SearchDevices[]>;
  returnedSearchDevices$: Observable<SearchDevices[]>;
  @Output() messageEvent = new EventEmitter<Observable<SearchDevices[]>>();

  constructor(private databaservice: DatabaseService) { }


  ngOnInit(): void {

    this.deviceType$ = this.fetchAllDeviceTypes();
    //this.searchDevices$ = this.fetchSearchResults(this.searchValues);

    //this.fetchAllDeviceTypes().
    //  subscribe(data => { this.dropDownList = data;
    //});

  }

  // Start value
  // tslint:disable-next-line: typedef
  getStartVal(val: any){

    this.startDeviceValue = val.target.value;
    console.log('start value', this.startDeviceValue);
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
    this.searchValues.push(this.startDeviceValue);
    this.searchValues.push(this.endDeviceValue);
    this.searchValues.push(this.stime);
    this.searchValues.push(this.etime);

    this.searchDevices$ = this.fetchSearchResults(this.searchValues);
    console.log('Search Data 1', this.searchDevices$);

    this.messageEvent.emit(this.searchDevices$);
    return this.searchDevices$;
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
