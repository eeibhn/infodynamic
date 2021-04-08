import { DatabaseService } from './../../Services/database.service';
import { Component, OnInit } from '@angular/core';
import { ScheduleType } from 'src/app/model/infodata';
import { DeviceType } from 'src/app/model/infodata';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { EventEmitter, NgModule, Output } from '@angular/core';
import { frequency } from './../../model/frequency.model';


@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {


  frequencyValues : frequency[] = [
    {id: 1, value:'Hourly'},
    {id: 2, value:'Daily'},
    {id: 3, value:'Weekly'},
    {id: 4, value:'Monthly'}
  ];


  deviceTypes : DeviceType[] = [
    {id: 1,item:'Water'},
    {id: 2,item:'Electricity'},
    {id: 3,item:'Gas'},
    {id: 4, item:'Solar'}
  ];

  selectedFrequency = [];

  scheduleName: string;

  dropDownList = [];
  selectedItems = [];
  selectedDeviceType :{id: 1,item:'Water'};
  scheduleValues:ScheduleType;

  schedule: ScheduleType = {
    id:0,
    name:'dummyName',
    selectedDeviceType:{id: 1,item:'Water'},
    startdevice:2345,
    endDeviceValue:10000,
    frequency:60,
    startdate:new Date(2012, 10, 1),
    enddate:new Date(2020, 10, 12),
    startscheduledate:new Date(2012, 0, 1),
    endscheduledate:new Date(2012, 0, 1),
    rangedate:[new Date(2012, 0, 1),new Date(2012, 0, 1)]
  };

  stime: any;
  etime: any;
  startDate = new Date(2012, 0, 1);
  enddate = new Date(2020, 12, 12);




  deviceType$: Observable<DeviceType[]>;
  scheduleReport$: Observable<ScheduleType>;
  @Output() messageNewScheduleEvent = new EventEmitter<ScheduleType>();

  constructor(private databaseservice: DatabaseService) { }


  ngOnInit(): void {

   // this.deviceType$ = this.fetchAllDeviceTypes();
    //this.scheduleDevices$ = this.fetchscheduleResults(this.scheduleValues);

    //this.fetchAllDeviceTypes().
    //  subscribe(data => { this.dropDownList = data;
    //});
  }

  // Start value
  // tslint:disable-next-line: typedef
  getStartVal(val: any){

    this.schedule.startdevice = val.target.value;
    console.log('start value', this.schedule.startdevice);
  }

  // End Value
  // tslint:disable-next-line: typedef
  getEndVal(val: any){

    this.schedule.endDeviceValue = val.target.value;
    console.log('end value', this.schedule.endDeviceValue);
  }

  selectFreqChangeHandler(val: any){
    this.schedule.frequency = val;
    console.log('Frequency', this.schedule.frequency);
  }


  getScheduleName(val: any){
    this.schedule.name = val.target.value;
    console.log('Schedule Name', this.schedule.name);
  }



// Drop Down Menu

   // tslint:disable-next-line: typedef
   selectChangeHandler(val: any){
    //this.selectedDeviceTypes.push(val);
    console.log('schedule Component TS', this.selectedDeviceType);
  }


  // tslint:disable-next-line: typedef
  selectStartDateHandler(val: any){
    this.schedule.startdate = moment(val.toLocaleString()).format('DD/MM/YYYY, HH:mm:ss');
    console.log('schedule Component TS', this.schedule.startdate);

  }

         // tslint:disable-next-line: typedef
  selectEndDateHandler(val: any){
    this.schedule.enddate = moment(val.toLocaleString()).format('DD/MM/YYYY, HH:mm:ss');
    console.log('schedule Component TS', this.schedule.enddate);
  }

  print(){      window.print();}
  // tslint:disable-next-line: typedef
  clickEvent(){

    console.log(this.schedule);
   this.databaseservice.getSchedulePostResult(this.schedule).subscribe(
    (data:ScheduleType) => {console.log('Success',data);

    this.messageNewScheduleEvent.emit(this.schedule);},
    (error:any)           => console.log('Error',error));

  }

  //fetchScheduleResult(searchParameters): Observable<ScheduleReport> {
  //  console.log('Search Data 2', searchParameters);
  //  return this.databaseservice.getSchedulePostResult(searchParameters).//subscribe();
  //}

  selectDeviceTypeChangeHandler(val: any){
    this.schedule.selectedDeviceType = val;
    console.log("device type",this.schedule.selectedDeviceType);

  }
}
