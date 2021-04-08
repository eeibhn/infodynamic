import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {FileType} from '../model/infodata';
import { ErrorHandlerService } from './errorhandler.service';
import { catchError, tap } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class FileoperationsService {

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  constructor(private http: HttpClient,
              private errorHandlerService: ErrorHandlerService) { }

  // tslint:disable-next-line: typedef
  download(file: File){
    const param = new HttpParams().set('filename', file.name);
    return this.http.get('http://localhost:3000/infoDataItems/api/download',
    {responseType: 'blob', reportProgress: true, observe: 'events'});
  }

  viewFile(name: string){
    console.log('files before',name);
    const searchValues = JSON.stringify(name);
    const params1 = new HttpParams().set('selectedFiles', name);
    console.log('filename', params1);
    const Fileurl = 'http://localhost:3000/infoDataItems/viewFile';
    return this.http.get(Fileurl,
    {params: params1,responseType: 'blob', reportProgress: true, observe: 'events'});
  }

  // tslint:disable-next-line: typedef
  upload(file: File){
    console.log('file message to store (clienta)', file);
    const multipartFormData = new FormData();
    multipartFormData.append('file', file)
    return this.http.post('http://localhost:3000/infoDataItems/upload',
    multipartFormData, {reportProgress: true, observe: 'events'});
  }

  uploadBlob(blob1: Blob, filename: string){
    console.log('file message to store (client)', blob1);
    const multipartFormData = new FormData();
    multipartFormData.append('file', blob1, filename)
    return this.http.post('http://localhost:3000/infoDataItems/uploadb',
    multipartFormData, {reportProgress: false, observe: 'events'});
  }

  deleteReport(id: string): Observable<any> {
    console.log('deleting this report',id);
    const url = `http://localhost:3000/infoDataItems/deleteReport/${id}`;
    return this.http
      .delete<FileType>(url, this.httpOptions)
      .pipe(catchError(this.errorHandlerService.handleError<any>('delete')));
  }

}
