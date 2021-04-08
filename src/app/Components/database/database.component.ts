import { DatabaseService } from './../../Services/database.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Infodata, NEMType } from 'src/app/model/infodata';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({

  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {



  @Input('ELEMENT_DATA') ELEMENT_DATA!: Infodata[];
  displayedColumns: String []= [  'recordIndicator', 'nmi', 'nmiconfiguration',
                                  'registerid','nmisuffix','nmistreamidentifier', 'meterserialnumber','uom','intervallength', 'nextscheduledread', 'fromparticipant',
                                  'toparticipant','delete','update'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource = new MatTableDataSource<Infodata>(this.ELEMENT_DATA);

  searchKey: string;

  infodata$: Observable<Infodata[]>;
  nemdata$: Observable<NEMType[]>;

  @Input() database;

  constructor(private databaservice: DatabaseService) { }

  ngOnInit(): void {
   // this.infodata$ = this.databaservice.getAllInfoDataItems();

    this.nemdata$ = this.databaservice.getNEMItems();
    //const resp = this.databaservice.getAllInfoDataItems();
    const resp = this.databaservice.getNEMItems();

    resp.subscribe(report => this.dataSource.data = report as Infodata[]);
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



  fetchAllNEM(): Observable<NEMType[]> {
    return this.databaservice.getNEMItems();
  }
  fetchAll(): Observable<Infodata[]> {
    return this.databaservice.getAllInfoDataItems();
  }

  post(propertyItem: Partial<Infodata>): void {
    const item = (propertyItem as string).trim();
    if (!item) { return; }
    this.infodata$ = this.databaservice
      .post({ item })
      .pipe(tap(() => (this.infodata$ = this.fetchAll())));
  }

  update(id: number, newItem: Partial<Infodata>): void {
    const item = (newItem as string).trim();
    if (!item) { return; }

    const newData: Infodata = {
      id,
      item,
    };

    this.infodata$ = this.databaservice
      .update(newData)
      .pipe(tap(() => (this.infodata$ = this.fetchAll())));
  }

  delete(id: number): void {
    this.infodata$ = this.databaservice
      .delete(id)
      .pipe(tap(() => (this.infodata$ = this.fetchAll())));
  }

  applyFilter(){
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }
}

