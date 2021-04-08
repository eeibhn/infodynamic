
import { DatabaseService } from './../../Services/database.service';
import { Component, OnInit, Input, ViewChild, SimpleChange, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Infodata } from 'src/app/model/infodata';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SearchDevices } from 'src/app/model/infodata';
import { FileType } from 'src/app/model/infodata';
import * as moment from 'moment';
import { EventEmitter, NgModule, Output } from '@angular/core';
import { frequency } from './../../model/frequency.model';
import {cloneDeep} from 'lodash';
import { SocketService } from '../../Services/socket.service';
import { FileoperationsService } from 'src/app/Services/fileoperations.service';
import { saveAs } from 'file-saver';








@Component({
  selector: 'app-reportselector',
  templateUrl: './reportselector.component.html',
  styleUrls: ['./reportselector.component.scss']
})
export class ReportselectorComponent implements OnInit, OnChanges {

  changeDetection: ChangeDetectionStrategy.OnPush


  dropDownList = [];
  selectedItems = [];

  selectedDevices = [];
  selectedDeviceTypes = [];

  startDeviceValue: any = 0;
  endDeviceValue: any = 1000000000;

  startDate = new Date(2012, 0, 1);
  endDate = new Date(2020, 12, 12);
  stime: any;
  etime: any;

  searchValues = [];
  searchKey: string;

  @Input('ELEMENT_DATA') ELEMENT_DATA!: FileType[];
  displayedColumns: String []= [  'schedulename', 'filename','datecreated', 'nmiconfiguration','nmisuffix','delete','view'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @Input() selectedRowNames:[];
  @Input() selectedRowName:[];

  @Output() sendReportValues = new EventEmitter();



  selectedFileTypes = [];
  fileName$: Observable<FileType[]>;
  fileDelete$: Observable<FileType>;

  searchDevices$: Observable<SearchDevices[]>;
  returnedSearchDevices$: Observable<SearchDevices[]>;
  @Output() messageEvent = new EventEmitter<Observable<SearchDevices[]>>();

  dataSource = new MatTableDataSource<FileType>(this.ELEMENT_DATA);

  constructor(private databaservice: DatabaseService,
              private fileoperations: FileoperationsService ) { }


  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes in report selector',changes, this.selectedRowNames);
    this.fileName$ = this.fetchAllFiles(this.selectedRowNames);

    this.fileName$.subscribe(report => {
      this.dataSource.data = report as FileType[];
    //  console.log('report ',report)
  });
    this.dataSource.sort = this.sort;
 //   console.log('Selected Row Name',this.selectedRowName);

  }


  ngOnInit(): void {


    this.fileName$.subscribe(report => this.dataSource.data = report as FileType[]);
    console.log('nnn',this.dataSource );

    console.log('selected name',this.selectedRowNames);
    this.fileName$ = this.fetchAllFiles('dummy');

    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

    // Start value
  // tslint:disable-next-line: typedef


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

  fetchAllFiles(filename): Observable<FileType[]> {
    console.log('get all files', filename);
    return this.databaservice.getAllFiles(filename);
  }
  applyFilter(){
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  deleteReport(name: string){
    console.log('name',name);
    this.fileDelete$ = this.fileoperations.deleteReport(name)
    .pipe(tap(() => (this.fileName$ = this.fetchAllFiles(name))));

  this.fileDelete$.subscribe(report => {report as FileType;  })
 // this.fileName$ = this.fetchAllFiles(name);
 this.fileName$ = this.fetchAllFiles(this.selectedRowNames);

 this.fileName$.subscribe(report => {
   this.dataSource.data = report as FileType[];
});

  }

  viewReport(name:string){
    let filename = name;
    console.log('filename from view', name);
    this.fileoperations.viewFile(name).subscribe(
      (event) => {
        console.log ( 'res:', event);
      if (event['headers']){
        const [ _, contentDisposition] = event['headers'].get('Content-Disposition').split('filename=');
        filename = contentDisposition.replace(/"/g, "");
      }

      if (event['body']){
        saveAs (event ['body'], filename);

      }
// tslint:disable-next-line: typedef
    });
  }
}

