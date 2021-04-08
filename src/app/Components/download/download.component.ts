import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './../../Services/database.service';
import { saveAs } from 'file-saver';
import { FileoperationsService } from 'src/app/Services/fileoperations.service';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})

export class DownloadComponent implements OnInit {

  constructor(private fileoperations: FileoperationsService) { }
  // tslint:disable-next-line: variable-name
  private _value = 0;
  private enableCall = false;
  selectedFile = null;
  message = null;

  ngOnInit(): void {
  }

  get value(): number {
    return this._value;
  }

  set value(value: number){
    if (!isNaN(value) && value <= 100){
      if (!this.enableCall && value !== 100) { return; }
      this.enableCall = false;
      this._value = value;
      setTimeout(() => this.enableCall = true, 10);
    }
  }

  download(event): void {
    console.log(event);
    this.selectedFile = event;
  }

  // tslint:disable-next-line: typedef
  reset(){
    this._value = 0;
  }


  onDownload(): void{

    let filename = this.selectedFile;
    console.log('filename', filename.name);
    this.fileoperations.download(this.selectedFile.name).subscribe(
      (event) => {
        console.log ( 'res:', event);
      if (event['headers']){
        const [ _, contentDisposition] = event['headers'].get('Content-Disposition').split('filename=');
        filename = contentDisposition.replace(/"/g, "");
      }
      if (event['loaded'] && event['total']){
       this._value = Math.round(100 * event['loaded'] / event['total']);
      }
      if (event['body']){
        saveAs (event ['body'], filename);
      }
// tslint:disable-next-line: typedef
    });
  }
}
