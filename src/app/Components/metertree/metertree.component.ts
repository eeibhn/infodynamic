import { DatabaseService } from './../../Services/database.service';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Infodata, NEMType, SearchType,AreaType, DeviceType, MeterType, MeterData } from 'src/app/model/infodata';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { DatabaseComponent } from '../database/database.component';


@Component({
  selector: 'app-metertree',
  templateUrl: './metertree.component.html',
  styleUrls: ['./metertree.component.scss']
})
export class MetertreeComponent implements OnInit {

  @Input('ELEMENT_DATA') ELEMENT_DATA!: AreaType[];
  @Input('ELEMENT_DATA') ELEMENT_DATA1!: MeterType[];
  @Input('ELEMENT_DATA') ELEMENT_DATA2!: MeterData[];




  displayedColumns: String []= [  'nmi', 'meterserialnumber','intervallength'];

  displayedTreeColumns: String []= [ 'areaid','areas'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  dataSource = new MatTableDataSource<AreaType>(this.ELEMENT_DATA);
  dataSource1 = new MatTableDataSource<MeterType>(this.ELEMENT_DATA1);
  dataSource2 = new MatTableDataSource<MeterData>(this.ELEMENT_DATA2);
  meterIndex:number;

  selectedMeter = [];
  selectedArea = [];

@Output() removeArea = new EventEmitter();
@Output() addArea = new EventEmitter();
@Output() removeMeter = new EventEmitter();
@Output() addMeter = new EventEmitter();
@Output() addReportCriteria = new EventEmitter();




  searchKey: string;

  infodata$: Observable<Infodata[]>;
  nemdata$: Observable<NEMType[]>;
  areadata$: Observable<AreaType[]>;
  meters$:MeterType[];
  address: string;
  selectedRows = [-1,-1,-1,-1,-1];
  highlightedRows = [-1,-1,-1,-1,-1];
  selectedMeterRows = [-1,-1,-1,-1,-1];
  highlightedMeterRows = [-1,-1,-1,-1,-1];

  @Input() database;
  testmessage=[];

  message:string;
  subscription: Subscription;

  constructor(private databaservice: DatabaseService,private data: DatabaseService) { }

  ngOnInit(): void {
    this.selectedMeter = [];
    this.selectedArea = [];
    this.highlightedMeterRows = [-1,-1,-1,-1,-1];
    this.selectedMeterRows = [-1,-1,-1,-1,-1];

   // this.infodata$ = this.databaservice.getAllInfoDataItems();
    this.areadata$ = this.databaservice.getAllAreaItems();
    console.log('area',this.areadata$);
    const resp = this.databaservice.getAllAreaItems();

    resp.subscribe(report => this.dataSource.data = report as AreaType[]);
    this.dataSource.sort = this.sort;

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  receiveSearchMessage(event$){
    this.nemdata$ = event$;
    this.dataSource = event$;

    console.log('received message');
    console.log('database this message', this.nemdata$);
  };

  receiveSearchCriteria(event$){

    console.log('received search criteria');
    console.log('database this message', event$);
    console.log('Areas ', this.highlightedRows);
    console.log('Meters', this.highlightedMeterRows);
    var searchValues = [event$,this.highlightedRows,this.highlightedMeterRows];
    console.log('received search criteria', searchValues);

    this.addReportCriteria.emit(searchValues);


  };


  getArea(row){
    if(this.highlightedRows.indexOf(row) === -1){
      let added: boolean =false;
      this.selectedRows.forEach((element,index) => {
        if(element===-1) {
          if (!added){this.selectedRows[index]=row.areaid;added=true;}}}
      );
      this.highlightedRows.splice(this.dataSource1.data.indexOf(row), 0,row); //Row has been highlighted
      this.highlightedRows.splice(this.dataSource1.data.indexOf(row)+1, 1);

      this.selectedArea=[];
      this.selectedArea.splice(0,0,row.areaid);

      this.addArea.emit(this.selectedArea);}
      else{
        this.selectedRows[this.selectedRows.indexOf(row.areaid)]=-1;
        this.highlightedRows[this.highlightedRows.indexOf(row)] = -1;
        this.removeArea.emit(this.selectedArea);
        console.log('highlighted meter rows',this.highlightedMeterRows);
      }
        //Hightlighting has been removed

      //console.log('this selected rows', this.selectedRows);
    const thisresp = this.fetchMeters(this.selectedRows);
    thisresp.subscribe(report => {
      //console.log('report',report);
      this.dataSource1.data = report as MeterType[]});
  }

  getMeter(rowMeter){
console.log('getmeter',rowMeter);
    if(this.highlightedMeterRows.indexOf(rowMeter) === -1){

      var firstfree = this.highlightedMeterRows.indexOf(-1);

      this.highlightedMeterRows.splice(this.dataSource1.data.indexOf(rowMeter), 0,rowMeter); //Row has been highlighted
      this.highlightedMeterRows.splice(this.dataSource1.data.indexOf(rowMeter)+1, 1); //Row has been highlighted

      this.selectedMeter=[];
      this.selectedMeter.splice(0,0,rowMeter.nmi);
      this.selectedMeter.splice(0,0,this.dataSource1.data.indexOf(rowMeter));

      this.addMeter.emit(this.selectedMeter);
      console.log('fetch meter data in metertree');
      const thisresp = this.fetchMeterData(rowMeter.nmi);
      thisresp.subscribe(report => {
        this.dataSource2.data = report as MeterData[]});

      this.subscription = this.databaservice.currentMessage.subscribe(message => {console.log('sending test message 1',this.highlightedMeterRows);this.testmessage = message})
      }
      else{
        //The meter will be removed
        this.meterIndex= this.dataSource1.data.indexOf(rowMeter);
        this.selectedMeter =[];
        this.selectedMeter.splice(0,0,rowMeter.nmi);
        this.selectedMeter.splice(0,0,this.dataSource1.data.indexOf(rowMeter));

        console.log('meter remove index', this.selectedMeter);
       this.removeMeter.emit(this.selectedMeter);
        this.selectedMeterRows[this.selectedMeterRows.indexOf(rowMeter.areaid)]=-1;
        this.highlightedMeterRows[this.highlightedMeterRows.indexOf(rowMeter)] = -1;

      }

  };

  getAreaItems(): Observable<AreaType[]> {
    return this.databaservice.getAllAreaItems();
  }
  fetchMeters(selectedRows): Observable<MeterType[]> {
    return this.databaservice.getAllMeters(selectedRows);
  }

  fetchMeterData(selectedMeterRow): Observable<MeterData[]> {
    console.log('fetch meter data in metertree');
      return this.databaservice.getAllMeterData(selectedMeterRow);
  }

  applyFilter(){
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }
}

