import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-iBill',
  templateUrl: './iBill.component.html',
  styleUrls: ['./iBill.component.scss']
})
export class iBillComponent implements OnInit {
  pdfSrc="Bill.pdf";
  page:number = 1;

  constructor() { }

  ngOnInit(): void {
    this.pdfSrc = '/assets/Bill.pdf';
  }

  onFileSelected() {
    let img: any = document.querySelector("#file");

    if(typeof (FileReader) !== 'undefined') {
      let reader = new FileReader();

      reader.onload = (e:any) => {
        this.pdfSrc = e.target.result;
      }

      reader.readAsArrayBuffer(img.files[0]);
    }
  }

}
