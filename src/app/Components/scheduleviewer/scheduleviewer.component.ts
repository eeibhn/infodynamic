
import { DatabaseService } from './../../Services/database.service';
import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Infodata, FileType, NEMType, SearchType, ScheduleType, ReportType,bsRange } from 'src/app/model/infodata';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import {cloneDeep} from 'lodash';



@Component({
  selector: 'app-scheduleviewer',
  templateUrl: './scheduleviewer.component.html',
  styleUrls: ['./scheduleviewer.component.scss']
})
export class ScheduleviewerComponent implements OnInit {


  @Input('ELEMENT_DATA') ELEMENT_DATA!: ScheduleType[];
  @Input('ELEMENT_DATA') ELEMENTFILE_DATA!: FileType[];

 // @Output() sendScheduleValues = new EventEmitter();

  displayedColumns: String []= [  'name','devicetype', 'startdevice',
                                  'enddevice','startdate','frequency','delete','update'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource = new MatTableDataSource<ScheduleType>(this.ELEMENT_DATA);
  dataSource1 = new MatTableDataSource<ScheduleType>(this.ELEMENT_DATA);
  dataSource2 = new MatTableDataSource<FileType>(this.ELEMENTFILE_DATA);

  searchKey: string;
  testmessage:ReportType[];
  startdate;
  enddate;
  newDateRange=[];

  name:string;
  frequency:number;
  bsRanges:bsRange[];
  bsRangeValue: Date[]=[];
  bsValue = new Date();
  maxDate = new Date();
  minDate = new Date();
data;
rowCount:number=0;
  infodata$: Observable<Infodata[]>;
  scheduledata$: Observable<ScheduleType[]>;
  returnedSchedule: Observable<ScheduleType[]>;
  schedules$: Observable<ScheduleType[]>;
  reportCriteria$: Observable<ReportType[]>;
  reportCriteria;
  selectedRows = [-1,-1,-1,-1,-1];
  selectedRow:string;

  updatedSchedule:string;
  scheduleUpdate:boolean = false;

  highlightedScheduleRows = [-1,-1,-1,-1,-1];
  selectedScheduleRows = [-1,-1,-1,-1,-1];

  storedSearchValues:SearchType;

  frequencyChanged:boolean;
nameChanged:boolean;
dateRangeChanged:boolean;

  subscription: Subscription;
  i=2;
  mydate:Date;
  mtdate:string;
  rowChangedViewer= [];

  @Input() database;


  constructor(private databaservice: DatabaseService) { }

  ngOnInit(): void {
    this.rowChangedViewer.push(false);

    //Datasource 1 is the preformatted (date) of DataSource
    this.getScheduleDetails().subscribe(report => {this.dataSource1.data = report as ScheduleType[];
      this.formatDate();
    })
    this.scheduledata$ = this.getScheduleDetails();
    this.dataSource.sort = this.sort;

    //Subscribe if n newsomehting has changed in the database from another component
    this.subscription = this.databaservice.currentReportMessage.subscribe(message => {
      this.testmessage = message;
      console.log('something changed',this.testmessage);
      console.log('schedule viewer database this message', this.scheduledata$);
      console.log('datasource', this.dataSource.data);
    })

  }

  //highlightedScheduleRows should be grey, not equal to-1 if selected
  //selectedScheduleRows Current list of selected row names
  getSchedules(rowSchedule){

    this.rowChangedViewer.push(false);
    this.selectedRow=rowSchedule.name;

    console.log('row changed',this.selectedRow);

console.log('hightlighted rows',this.highlightedScheduleRows );
    if(this.highlightedScheduleRows.indexOf(rowSchedule) === -1){

      var firstFreeIndex = this.selectedScheduleRows.indexOf(-1);
      if (firstFreeIndex !== -1){
            console.log('inserting selected new  row',this.selectedRows,firstFreeIndex);

            this.selectedScheduleRows[firstFreeIndex]=rowSchedule.name;
            this.selectedRows=this.selectedScheduleRows;
            this.selectedRow=rowSchedule.name;

            console.log('selected Rows now',this.selectedRows);

            this.highlightedScheduleRows.splice(this.dataSource1.data.indexOf(rowSchedule), 0,rowSchedule); //Row has been highlighted
            this.highlightedScheduleRows.splice(this.dataSource1.data.indexOf(rowSchedule)+1, 1);
            this.rowChangedViewer.push(true);
            console.log('row changed',this.rowChangedViewer);
            this.rowCount=this.rowCount+1;

          }}
    else{ //Row is selected, remove it
        console.log('already selected 1',this.highlightedScheduleRows.indexOf(rowSchedule) );
        this.selectedScheduleRows[this.selectedScheduleRows.indexOf(rowSchedule.name)]=-1;
        this.highlightedScheduleRows[this.highlightedScheduleRows.indexOf(rowSchedule)] = -1;
        console.log('this selected row name before', this.selectedRow, rowSchedule.name);

        //this.selectedRow=cloneDeep(rowSchedule.name);
        console.log('this selected row name before clone', this.selectedRow, rowSchedule.name);

        this.rowCount=this.rowCount-1;

        console.log('this selected row name after', this.selectedRow, rowSchedule.name);


        this.selectedRows[this.highlightedScheduleRows.indexOf(rowSchedule)] = -1;
        console.log('about to be removed selectedRows',this.selectedRows, 'about to be removed selectedRow',this.selectedRow );
        //this.selectedRows=this.highlightedScheduleRows;

        //Hightlighting has been removed
      }
      console.log('rows going in selected rows', this.selectedScheduleRows);
      console.log('highlighted rows going in selected rows', this.highlightedScheduleRows);


    const thisresp = this.fetchSelectedSchedules(this.selectedScheduleRows);
    thisresp.subscribe(report => {
      console.log('report',report);
      this.dataSource2.data = report as ReportType[]});

  }

  formatDate(){
    console.log('schedule now',this.dataSource1.data);
    for (var j=0;j<this.dataSource1.data.length;j++){

    this.startdate = moment(this.dataSource1.data[j].startscheduledate).format('l');
    this.enddate = moment(this.dataSource1.data[j].endscheduledate).format('l');

    this.bsValue = new Date(this.startdate);
    console.log('bs value',this.bsValue);

    this.bsRangeValue = [this.bsValue, this.maxDate];
    this.dataSource1.data[j].rangedate=[this.startdate,this.enddate];

    }
    this.dataSource.data=this.dataSource1.data;

  }


  getScheduleDetails():Observable<ScheduleType[]>{
    this.scheduledata$ = this.databaservice.getScheduleItems();
    console.log('getting schedule Items from database',this.scheduledata$);
    return this.databaservice.getScheduleItems();

  };


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  receiveNewSchedule(event$){
    //this.scheduledata$= this.databaservice.getScheduleItems();
    this.scheduledata$.subscribe(report => {
      this.dataSource.data = report as ScheduleType[];});
    //this.scheduledata$ = this.databaservice.getScheduleItems();
  };

  selectDateHandler(element,i){
    console.log('handler',element,i);
  }

  fetchSelectedSchedules(selectedScheduleRows): Observable<FileType[]> {
    return this.databaservice.fetchSelectedSchedules(selectedScheduleRows);
  }

  fetchAllSchedule(): Observable<ScheduleType[]> {

    return this.databaservice.getScheduleItems();
  }

  post(propertyItem: Partial<ScheduleType>): void {
    const item = (propertyItem as string).trim();
    console.log('now here');
    if (!item) { return; }
    this.scheduledata$ = this.databaservice
      .post({ item })
      .pipe(tap(() => (this.scheduledata$ = this.fetchAllSchedule())));
    this.scheduledata$.subscribe(report => this.dataSource.data = report as ScheduleType[]);
  }

  getName(val: any){
    this.name = val.target.value;
    this.nameChanged=true;

    console.log('name changing', this.name);
  }

  getFrequency(val: any){
    this.frequency = val.target.value;
    this.frequencyChanged=true;
    console.log('frequency', this.frequency);
  }

  getDates(val: any){
    //this.frequency = val.target.value;
    console.log('dates',val);
    this.newDateRange = val;
    this.dateRangeChanged=true;


  }

  updateSchedule(newItem: Partial<SearchType>): void {
    console.log('new update',newItem);
    if (this.dateRangeChanged){
        newItem.startscheduledate = moment(this.newDateRange[0].toLocaleString()).format('DD/MM/YYYY');
        newItem.endscheduledate = moment(this.newDateRange[1].toLocaleString()).format('DD/MM/YYYY');
        this.dateRangeChanged=false
      }
    if (this.frequencyChanged) {newItem.frequency= this.frequency;this.frequencyChanged=false;    this.scheduleUpdate=true;this.scheduleUpdate=true;
      console.log('this.scheduleUpdate',this.scheduleUpdate);
    }
    if (this.nameChanged) {newItem.name= this.name;this.nameChanged=false;}
      let noMoreSubs = false;
   // while (noMoreSubs === false){
        const reportCriteria$ = this.databaservice.updateSchedule(newItem);
        reportCriteria$.subscribe(report => {this.reportCriteria = report as ScheduleType[];

        let ts = Date.now();
        console.log('got new message back dates', ts, newItem.endscheduledate);
        //if (ts >newItem.endscheduledate){noMoreSubs = true;}
        //this.sendScheduleValues.emit(newItem);
      });
  //  }
  this.updatedSchedule=this.selectedRow;
  }


  deleteSchedule(name: string): void {
    console.log('deleting');
    this.scheduledata$ = this.databaservice
    .deleteSchedule(name)
    .pipe(tap(() => (this.scheduledata$ = this.fetchAllSchedule())));

  this.scheduledata$.subscribe(report => {report as ScheduleType[];  })

  this.getScheduleDetails().subscribe(report => {
    this.dataSource1.data = report as ScheduleType[];
    console.log('new values', this.dataSource1.data  );
    this.formatDate();
  });
  this.scheduledata$ = this.getScheduleDetails();
  this.dataSource.sort = this.sort;
}

  applyFilter(){
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }
}

