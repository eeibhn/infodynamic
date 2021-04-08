import { Component, OnInit } from '@angular/core';
import { FileoperationsService } from 'src/app/Services/fileoperations.service';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  constructor(private fileoperations: FileoperationsService) { }

  // tslint:disable-next-line: variable-name
  private _uploadvalue  = 0;
  private enableCall = false;
  selectedFile = null;
  message = null;

  ngOnInit(): void {
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


  upload(file: File): void {
    console.log('file name', file);
    this.selectedFile = file;
  }

  onUpload(): void{
    this.fileoperations.upload(this.selectedFile).pipe().subscribe(event => {
      this.message = null;
      if (event['loaded'] && event['total']){
        this.uploadvalue = Math.round(100 * event['loaded'] / event['total']);
      }
      if (event['body']){
        this.message = event['body'].message;
      }
    });
  }
}
