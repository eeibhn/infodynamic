import { EventEmitter, NgModule, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {
  selected = '';
  selections: any = [ 'Batch', 'NRT'];

  chartType = '';
  chartTypes: any = [ 'Bar', 'Line'];
  isSelected: boolean;

  @Output() messageEventDisplayChart = new EventEmitter<string>();
  @Output() messageEventBatch = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }
  // tslint:disable-next-line: typedef
  radioChangeHandlerBatch(event: any){
    this.selected = event.target.value;
    this.messageEventBatch.emit(this.selected);

  }

  // tslint:disable-next-line: typedef
  radioChangeHandlerNRT(event: any){
    this.chartType = event.target.value;
    this.messageEventDisplayChart.emit(this.chartType);

    if (this.chartType === 'Pie'){this.isSelected = true; }
    console.log('chart', this.chartType, this.isSelected);
  }


}
