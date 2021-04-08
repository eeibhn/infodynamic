import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { of } from 'rxjs';


import { ErrorHandlerService } from './errorhandler.service';

import {Infodata, DeviceType, SearchDevices, NEMType, ScheduleType, FileType,MeterData, AreaType, MeterType, ReportType, ReportDataType } from '../model/infodata';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  meterdata$: MeterData[]=[];
  reportdata$: ReportType[]=[];
  scheduledata$: ScheduleType[]=[];



  private url = 'http://localhost:3000/infoDataItems';

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService) { }

    private messageSource = new BehaviorSubject(this.meterdata$);
    currentMessage = this.messageSource.asObservable();

    private reportMessageSource = new BehaviorSubject(this.reportdata$);
    currentReportMessage = this.reportMessageSource.asObservable();

    private scheduleMessageSource = new BehaviorSubject(this.scheduledata$);
    currentScheduleMessage = this.scheduleMessageSource.asObservable();


  getAllInfoDataItems(): Observable<Infodata[]>{
    return this.http
    .get<Infodata[]>(this.url)
    .pipe(
      tap((_) => console.log('got them')),
    catchError(
      this.errorHandlerService.handleError<Infodata[]>('getAllInfoDataItems', [])
    )
  );
  }

  getNEMItems(): Observable<NEMType[]>{
    const NEMurl = 'http://localhost:3000/infoDataItems/nem';
    return this.http
    .get<NEMType[]>(NEMurl)
    .pipe(
      tap((_) => console.log('got them')),
    catchError(
      this.errorHandlerService.handleError<NEMType[]>('getAllInfoDataItems', [])
    )
  );
  }



  getAllAreaItems(): Observable<AreaType[]>{
    const Areaurl = 'http://localhost:3000/infoDataItems/area';
    return this.http
    .get<AreaType[]>(Areaurl)
    .pipe(
      tap((_) => console.log('got them area')),
    catchError(
      this.errorHandlerService.handleError<AreaType[]>('getAllInfoDataItems', [])
    )
  );
  }


  getMeterData(): Observable<MeterData[]>{
    const Meterurl = 'http://localhost:3000/infoDataItems/getMeterData';
    return this.http
    .get<MeterData[]>(Meterurl)
    .pipe(
      tap((_) => console.log('got them')),
    catchError(
      this.errorHandlerService.handleError<MeterData[]>('getAllInfoDataItems', [])
    )
  );
  }

  getAllFiles(filenames): Observable<FileType[]>{
    console.log('files before',filenames);
    const searchValues = JSON.stringify(filenames);
    const params1 = new HttpParams().set('selectedFiles', searchValues);
    console.log('search file values', params1);
    const Fileurl = 'http://localhost:3000/infoDataItems/files';
    return this.http
    .get<FileType[]>(Fileurl, {params: params1})
    .pipe(
      tap((_) => console.log('got my files')),
      catchError(
      this.errorHandlerService.handleError<FileType[]>('getAllFiles', [])
      )
    );
  }

  getScheduleItems(): Observable<ScheduleType[]>{
    console.log('got schedules a')
    const Scheduleurl = 'http://localhost:3000/infoDataItems/schedule';
    return this.http
    .get<ScheduleType[]>(Scheduleurl)
    .pipe(
      tap((_) => console.log('got schedules')),
    catchError(
      this.errorHandlerService.handleError<ScheduleType[]>('getScheduleItems', [])
    )
  );
  }


  getNextSchedule(): Observable<ScheduleType[]>{
    console.log('got schedules a')
    const Scheduleurl = 'http://localhost:3000/infoDataItems/schedule';
    return this.http
    .get<ScheduleType[]>(Scheduleurl)
    .pipe(
      tap((_) => console.log('got schedules')),
    catchError(
      this.errorHandlerService.handleError<ScheduleType[]>('getScheduleItems', [])
    )
  );
  }


  post(item: Partial<Infodata>): Observable<any> {
    console.log('post parameters',item);

    return this.http
      .post<Partial<Infodata>>(this.url, {item}, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>('post')));
  }

  getSchedulePostResult(item: Partial<ScheduleType>): Observable<any> {
    const myurl ='http://localhost:3000/infoDataItems/postSchedule';
    var message=[];

      console.log('itemgoing out', item);
      return this.http
        .post<Partial<ScheduleType>>(myurl, item, this.httpOptions)
        .pipe(
          tap((schedule) => {schedule => console.log('report',schedule);
          message = schedule as ScheduleType[];
          this.scheduleMessageSource.next(message);}),
          catchError(this.errorHandlerService.handleError<ScheduleType>('post')));
    }

  update(item: Infodata): Observable<any> {
    return this.http
      .put<Infodata>(this.url, item, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>('update')));
  }

  deleteSchedule(id:string): Observable<ScheduleType[]> {
    console.log('deleting in database',id)
    const url = `http://localhost:3000/infoDataItems/${id}`;
    return this.http
      .delete<ScheduleType[]>(url, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<ScheduleType[]>('deleteSchedule')));
  }

  delete(id: number): Observable<any> {
    const url = `http://localhost:3000/infoDataItems/${id}`;
    return this.http
      .delete<Infodata>(url, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>('delete')));
  }

  getDeviceTypeDropDownValues(): Observable<DeviceType[]>{
    const url = `http://localhost:3000/infoDataItems/deviceTypes`;
    return this.http
    .get<DeviceType[]>(url)
    .pipe(
      tap((_) => console.log('got his type')),
      catchError(
      this.errorHandlerService.handleError<DeviceType[]>('getDeviceTypeDropDownValues', [])
      )
    );
  }

  getAllMeters(selectMeters: []): Observable<MeterType[]>{
    const searchValues = JSON.stringify(selectMeters);
    const params1 = new HttpParams().set('selectedMeters', searchValues);
    console.log('search values', params1);
    const url = `http://localhost:3000/infoDataItems/meter`;
    return this.http
    .get<MeterType[]>(url, {params: params1})
    .pipe(
      tap((_) => console.log('got his type')),
      catchError(
      this.errorHandlerService.handleError<MeterType[]>('getAllMeters', [])
      )
    );
  }

  getAllMeterData(selectMeter: []): Observable<MeterData[]>{
    console.log('fetch meter data in database',selectMeter);

    const searchValues = JSON.stringify(selectMeter);
    const params1 = new HttpParams().set('selectedMeter', searchValues);
    console.log('search values', params1);
    const url = `http://localhost:3000/infoDataItems/meterdata`;
    var metervalues: Observable<MeterData[]>;

    metervalues = this.http
    .get<MeterData[]>(url, {params: params1})
    .pipe(
      tap((report) => {report => console.log('report',report);report as MeterData[];this.messageSource.next(report);}),
      catchError(
      this.errorHandlerService.handleError<MeterData[]>('getAllMeterData', [])
      )
    );
    return metervalues;
  }


  getReportValues(dSource1): Observable<ReportDataType[]>{
    console.log('got report values');
    let dSource = this.getReportValues1(dSource1);
    return of(dSource);
  }

  getReportValues1(TempSource): ReportDataType[]{
    return TempSource;
  }


  storeReport(item): Observable<ReportType[]>{
    var message=[];
    const myurl ='http://localhost:3000/infoDataItems/postReport';

    var reportValues: Observable<ReportType[]>;
      console.log('report itemgoing out', item);
      reportValues = this.http
        .post<Partial<ReportType>>(myurl, item, this.httpOptions)
        .pipe(tap((report) => {
            report => console.log('report',report);
            message = report as ReportType[];
            this.reportMessageSource.next(message);}),
        catchError(this.errorHandlerService.handleError<any>('postReport'))
        );
        return reportValues
    }


  storeSchedule(item): Observable<ScheduleType[]>{
    var message=[];
    const myurl ='http://localhost:3000/infoDataItems/postSchedule';

    var reportValues: Observable<ScheduleType[]>;
      console.log('itemgoing out update', item);
      reportValues = this.http
        .post<Partial<ScheduleType>>(myurl, item, this.httpOptions)
        .pipe(tap((report) => {
            report => console.log('report',report);
            message = report as ScheduleType[];
            this.reportMessageSource.next(message);}),
        catchError(this.errorHandlerService.handleError<any>('postReport'))
        );
        return reportValues
    }


    fetchSelectedSchedules(selectedSchedules: []): Observable<FileType[]>{
      const searchValues = JSON.stringify(selectedSchedules);
      const params1 = new HttpParams().set('selected schedule', searchValues);
      console.log('get selected schedule', params1);

      const scheduleUrl = 'http://localhost:3000/infoDataItems/getScheduleFiles';
      return this.http
      .get<FileType[]>(scheduleUrl, {params: params1})
      .pipe(
        tap((_) => console.log('got them')),
      catchError(
        this.errorHandlerService.handleError<FileType[]>('fetchSelectedSchedules', [])
      )
    );
    }


      updateSchedule(item): Observable<ScheduleType[]>{
        var message=[];
        const myurl ='http://localhost:3000/infoDataItems/updateSchedule';

        var reportValues: Observable<ScheduleType[]>;
          console.log('itemgoing out update', item);
          reportValues = this.http
            .post<Partial<ScheduleType>>(myurl, item, this.httpOptions)
            .pipe(tap((report) => {
                report => console.log('report',report);
                message = report as ScheduleType[];
                this.reportMessageSource.next(message);}),
            catchError(this.errorHandlerService.handleError<any>('postReport'))
            );
            return reportValues
        }

  getSearchResult(mySearchValues: []): Observable<SearchDevices[]>{
    const searchValues = JSON.stringify(mySearchValues);
    const params1 = new HttpParams().set('selectedDevices', searchValues);
    console.log('search values', params1);
    const url = `http://localhost:3000/infoDataItems/getSearchResult`;
    return this.http
    .get<SearchDevices[]>(url, {params: params1})
    .pipe(
      tap((_) => console.log('got his type')),
      catchError(
      this.errorHandlerService.handleError<SearchDevices[]>('getSearchResult', [])
      )
    );
  }
}
