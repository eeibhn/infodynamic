import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../Services/database.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-iControl',
  templateUrl: './iControl.component.html',
  styleUrls: ['./iControl.component.scss'],
  providers: []
})
export class iControlComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  onPrint(): void {
    console.log('Printing');
  }

}
