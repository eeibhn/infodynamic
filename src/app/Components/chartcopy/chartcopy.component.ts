
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';
import { SocketService } from '../../Services/socket.service';
import { Options } from '@m0t0r/ngx-slider';
// import { DisplayComponent } from '../display/display.component';
import { DatabaseService } from '../../Services/database.service';
import { MeterData } from 'src/app/model/infodata';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { ReportType, ReportDataType } from 'src/app/model/infodata';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FileType } from 'src/app/model/infodata';
import { jsPDF } from "jspdf";
import  html2canvas  from 'html2canvas';
import * as moment from 'moment';
import { FileoperationsService } from 'src/app/Services/fileoperations.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import {MatPaginator} from '@angular/material/paginator';

import { ViewChild, ElementRef  } from '@angular/core';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import domtoimage from 'dom-to-image';
import { BehaviorSubject } from 'rxjs'




@Component({
  selector: 'app-chartcopy',
  templateUrl: './chartcopy.component.html',
  styleUrls: ['./chartcopy.component.scss']
})
export class ChartcopyComponent implements OnInit {

  constructor(  private databaservice: DatabaseService,
                private srv1: SocketService,
                private data2: DatabaseService,
                private fileoperations: FileoperationsService
                ) { };



  meterdata$: MeterData[];
  reportCriteria$: Observable<ReportType[]>;
  reportCriteria;

  @ViewChild('reportContent') reportContent: ElementRef;

  message:string;
  subscription: Subscription;

  selections: any = [ 'Batch', 'NRT'];
  chartTypes: any = [ 'Bar', 'Line'];
  chartType;

  chartValues1 = [];
  chartValues2 = [];

  initialLoading : boolean;

  linechart1c;
  linechart2c;
  pie1c;

  chart3;
  barChart;
  barchart1c;
  barchart2c;
  canvas1 = 'mycanvas';
  canvas2 = 'mycanvas2';
length;

  title = 'dashboard';
  @Input() chart;
  @Input() reportDataChart;
  @Input() selectedRowName:string;
  @Input() freqchanged:boolean;
  @Input() frequencyChartcopy:number;


  receivedValues=[];

  currentchart1c;
  currentchart2c;
  currentPie1c;
  pie1c;

  currentDoughnut1c: any;
  doughnut1c: any;

  currentRadar1c:any;

  radar1c:any;
  selectedMeters = [];
  selectedAreas = [];


  currentNMI:number;
  data = [];
  data1 = [];
  newData = [];
  currentData =[];
  reportValues =[];
  report;
  reportname: string;

  testmessage=[];
  realTime=false;
  index:number;

  minValue: number = 0;
  maxValue: number = 100;

  minIndex: number = 0;
  maxIndex: number = 0;

  addChartIndex: number = 0;
  chartIndex: number = 0;
  chartIndexes = [0,0,0,0,0];
  firstFreeIndex = 0;

  fullSetLabels = [];
  currentSetLabels = [];
  currentscheduledate: string;
  footer:boolean;



  options: Options = {
    floor: 0,
    ceil: 100,
    showOuterSelectionBars: true,

  };
  metervalue:MeterData[];
  removeChartIndex: number;

  //displayedColumns: String []= [  'schedulename', 'filename','datecreated', 'nmiconfiguration','nmisuffix','delete','update'];
  displayedTreeColumns: String []= [ 'areaid','areas'];

  displayedColumns: string[] = ['areaid', 'areaname', 'meterserialno', 'nmi','schedulename','delete','print'];


 ELEMENT_DATA: ReportDataType[]=[
   {areaid:0, areaname:'', meterserialno:0, nmi:0,schedulename:''},
   {areaid:0, areaname:'', meterserialno:0, nmi:0,schedulename:''},   {areaid:0, areaname:'', meterserialno:0, nmi:0,schedulename:''},
   {areaid:0, areaname:'', meterserialno:0, nmi:0,schedulename:''}];

   dataSource1 = new MatTableDataSource<ReportDataType>();

   dataSource = new MatTableDataSource<ReportDataType>([]);

 @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


 dsourceEmpty :ReportDataType[]=[
  {areaid:0, areaname:'', meterserialno:0, nmi:0,schedulename:''},
  {areaid:0, areaname:'', meterserialno:0, nmi:0,schedulename:''},
  {areaid:0, areaname:'', meterserialno:0, nmi:0,schedulename:''},
  {areaid:0, areaname:'', meterserialno:0, nmi:0,schedulename:''}];

  searchKey: string;
  barOptions:{
          maintainAspectRatio: false,
          responsive: true,

        }

  lineOptions:{
    responsive: true,
    maintainAspectRatio: false,
    legend: {display: false },
    scales: {
      yAxes: [{
        ticks: {suggestedMin: 0,suggestedMax: 1,display:false},
        stacked: false
      }],
      xAxes: [{
        ticks: {suggestedMin: 0,suggestedMax: 100,display:false},
        stacked: false
      }]
    }
  }

  // tslint:disable-next-line: typedef
  ngOnInit() {


    let reportValues$ = this.databaservice.getReportValues(this.dataSource1).subscribe((data:ReportDataType[])=>
    {this.dataSource.data=[...data];
    console.log('data dsource from db', this.dataSource.data)});

    this.dataSource.paginator = this.paginator;

    this.linechart1c = this.initialiseChart('mycanvas');
    this.linechart2c = this.initialiseChart('mycanvas2');
    this.pie1c = this.startPie();
    this.doughnut1c = this.startDoughnut();
    this.radar1c = this.startRadar();

    this.initialLoading=true;
    this.currentchart1c = this.linechart1c;
    this.currentchart2c = this.linechart2c;
    this.currentPie1c = this.pie1c;
    this.currentDoughnut1c = this.startDoughnut();
    this.currentRadar1c = this.startRadar();


    this.subscription = this.databaservice.currentMessage.subscribe((metervalue:[]) => {this.testmessage=metervalue;

      this.data=[];
      this.data1=[];
      this.firstFreeIndex=this.chartIndexes.indexOf(0);
      console.log('test message received  chartcopy',this.testmessage);
   //  for (var i=0;i<this.testmessage.length;i++){
    //    this.data.push(this.testmessage[i].intervaldatavalue);
      //  this.data1.push(this.testmessage[i].intervaldatavalue);
        //this.chartIndexes.splice(this.addChartIndex, 1,this.testmessage[0]);
      //};
      console.log('chartIndexes',this.chartIndexes);

     // this.chartValues1.push(this.data);
     // this.chartValues2.push(this.data);


      this.currentchart1c = this.updateChartData(this.currentchart1c, this.data, this.addChartIndex);
      this.currentchart2c = this.updateChartData(this.currentchart2c, this.data,this.addChartIndex);

      this.currentPie1c=  this.updatePie(this.currentPie1c,this.data,this.addChartIndex);

      this.currentDoughnut1c=  this.updateDoughnut(this.currentDoughnut1c,this.data,this.addChartIndex);

      this.currentRadar1c=  this.updateRadar(this.currentRadar1c,this.data,this.addChartIndex);

    })

    console.log('opening socket srv1');

    this.srv1.listen1('data2').subscribe(async (res: []) => {
      console.log('received data from socket data2',res);

      this.currentchart1c.data.datasets.forEach((element,index) => {
        this.currentchart1c.data.datasets[index].data=[];
        this.currentchart2c.data.datasets[index].data=[];
        console.log('current chart1c data',element.data);
      });


      if (res.toString() !=='11111111'){
    //    console.log(' chart2c data full set', this.currentchart2c.data.datasets);

            this.updateComponents(res);
      }
     if (this.realTime){
        console.log('received data NRT 1',res);
        switch(this.message){
          case 'Bar':{
            this.updateChartData(this.chart, res, 0);break;
            }
          case 'Pie':{
            this.updateChartData(this.pie1c, res, 0);break;
            }
          case'Doughnut':{
          //  this.updateChartData(this.doughnut1c, res, 0);break;
            }
          case 'Line':{
            this.updateChartData(this.chart, res, 0);break;
            }
          }
  };


    let options = {
      // aspectRatio: 1,
      // legend: false,
      tooltips: false,

      elements: {
        point: {
          borderWidth: function (context) {
            return Math.min(Math.max(1, context.datasetIndex + 1), 8);
          },
          hoverBackgroundColor: 'transparent',
          hoverBorderColor: function (context) {
            return "red";
          },
          hoverBorderWidth: function (context) {
            var value = context.dataset.data[context.dataIndex];
            return Math.round(8 * value.v / 1000);
          },
          radius: function (context) {
            var value = context.dataset.data[context.dataIndex];
            var size = context.chart.width;
            var base = Math.abs(value.v) / 1000;
            return (size / 24) * base;
          }
        }
      }
    };
  })


}

listenOnSocket(){
}

ngOnChanges(changes: SimpleChanges): void {
  console.log('changes in chartcopy',this.selectedRowName, this.freqchanged, this. frequencyChartcopy);

  if (this.freqchanged){
  this.srv1.emit1('newschedule',this.selectedRowName, this.frequencyChartcopy);
  this.srv1.listen1(this.selectedRowName).subscribe(async (res: []) => {
    console.log('received data from socket',this.selectedRowName);

    if (this.linechart1c){this.linechart1c.destroy();this.currentchart1c = this.initialiseChart('mycanvas');}
    if (this.linechart2c){this.linechart2c.destroy();this.currentchart2c = this.initialiseChart('mycanvas2');}


    if (this.pie1c) {this.pie1c.destroy(); this.pie1c=this.startPie();
    this.currentPie1c=  this.updatePie(this.pie1c,this.data,this.addChartIndex);}

    if (this.doughnut1c){this.doughnut1c.destroy(); this.doughnut1c=this.startDoughnut();this.currentDoughnut1c=this.updateDoughnut(this.doughnut1c,this.data,this.addChartIndex);}

    if (this.radar1c) {this.radar1c.destroy(); this.radar1c=this.startRadar();
      this.currentRadar1c=  this.updateRadar(this.radar1c,this.data,this.addChartIndex);}

    this.updateComponents(res);

  })
  }
}

updateComponents(reportValues){
  console.log('report Values',reportValues );

  let data:ReportDataType[]=[];
  var dSource1:ReportDataType[]=this.ELEMENT_DATA;

    let schedulenames=[];
    for (var i=0;i<reportValues.length;i++){
      console.log('received from socket',i, reportValues[i]);

      if (reportValues[i].chart1data!==null){
        console.log('received from socket inside',i, reportValues[i].chart1data);

      this.currentchart1c=this.updateChartData(this.currentchart1c,
      reportValues[i].chart1data,i);
      console.log('current chart1c data',this.currentchart1c);

      this.currentchart2c=this.updateChartData(this.currentchart2c,reportValues[i].chart2data,i);
      console.log('current chart2c data',this.currentchart2c);

      this.currentPie1c=this.updatePie(this.pie1c,reportValues[i].chart1data,i);
      this.currentDoughnut1c= this.updateDoughnut(this.doughnut1c,reportValues[i].chart1data,i);
      this.currentRadar1c=  this.updateRadar(this.radar1c,reportValues[i].chart1data,i);

      dSource1[i].areaid=reportValues[i].areaid;
      dSource1[i].areaname= reportValues[i].areaname;
      dSource1[i].meterserialno= reportValues[i].meterserialno;
      dSource1[i].nmi= reportValues[i].nmi;
      dSource1[i].schedulename= reportValues[i].schedulename;
      }

    }
    let reportValues$ = this.databaservice.getReportValues(dSource1).subscribe((data:ReportDataType[])=>
      {this.dataSource.data=[...data];
        this.dataSource.data = this.dataSource.data;

        this.paginator._changePageSize(this.paginator.pageSize);
      console.log('data dsource from db', this.dataSource.data)});

      console.log('data dsource from db', reportValues$);

    /*
      console.log('the table data source', schedulenames);

      console.log('dSource1', dSource1[i]);
      data.push(dSource1[i]);
      console.log('data', data);



    }
    this.reportValues[0]=reportValues[0]

    this.dataSource = new MatTableDataSource<ReportDataType>();
    if(this.reportValues[0].schedulename) {this.applyFilter();}

    this.dataSource = new MatTableDataSource<ReportDataType>(this.ELEMENT_DATA);

    console.log('schedule name',this.reportValues[0]);
    //this.dataSource.renderRows();
    this.dataSource1.data=[];
    if(this.reportValues[0].schedulename) {this.applyFilter();}
      this.dataSource1.data=data;
      console.log('datasource', this.dataSource1.data);
         if(this.reportValues[0].schedulename) {this.applyFilter();}

    this.dataSource = new MatTableDataSource<ReportDataType>(this.dataSource1.data);
*/

    this.genPDF(reportValues[0].schedulename);

  }



genPDF(name){
  console.log('generating pdf');
  setTimeout(() => {
  var myelement1 = document.getElementById("elementtoexport");
  const options = { background: 'white', height: 2000, width: 1500 };
  domtoimage.toPng(myelement1, options).then((dataUrl) => {
      //Initialize JSPDF
      const doc = new jsPDF('p', 'mm', 'a4');
      //Add image Url to PDF
      doc.addImage(dataUrl, 'PNG', 0, 0, 210, 340);
      //let currentDate = new Date();
      let newName = name + '.pdf';
      console.log('saving in chart copy');
      doc.save(name);
      this.uploadFile(doc.output('blob'),newName);
      console.log('doc',doc );
  })
},5000);
}



  uploadFile(pdfFile: Blob, filename) {
    console.log('uploading file ', filename);
    this.fileoperations.uploadBlob(pdfFile, filename)
      .subscribe(
       (data: any) => {
        if (data.responseCode === 200 ) {
          //succesfully uploaded to back end server
        }},
       (error) => {
         //error occured
       }
     )
  }


  onSelect($event){
    console.log('chartIndexes',this.chartIndexes);
    this.currentData=[];
    this.currentSetLabels=[];
    this.minIndex = Math.round(this.data.length*this.minValue/100);
    this.maxIndex = Math.round(this.data.length*this.maxValue/100);
    this.newData = this.data1.slice(this.minIndex,this.maxIndex);
    this.currentSetLabels = this.fullSetLabels.slice(this.minIndex,this.maxIndex);
    console.log('just got here', this.chartIndexes);
    this.chartIndexes.forEach((chart,index) => {
      if (chart !== 0){
      console.log('just got here inside char!=0', chart);

      this.currentchart1c=this.updateChartData(this.currentchart1c,this.newData, index);

      this.currentPie1c=  this.updatePie(this.pie1c,this.newData,this.addChartIndex);

      this.currentDoughnut1c=  this.updateDoughnut(this.currentDoughnut1c,this.newData,this.addChartIndex);

      this.currentRadar1c=  this.updateRadar(this.currentRadar1c,this.newData,this.addChartIndex);
      }
    });
   //this.currentchart1c.data.datasets.push(this.newData);
    //this.currentchart2c.data.datasets.push(this.newData);
    //console.log('selected meters data after',this.currentchart1c.data.datasets);

  }

  onAreaAdd(selectedArea){
    this.selectedAreas= this.selectedAreas.concat(selectedArea);
    console.log('area adding',this.selectedAreas);
  }

  onAreaRemove(selectedArea){
    this.selectedAreas.splice(this.selectedAreas.indexOf(selectedArea),1);
    console.log('area removing',this.selectedAreas);
  }

  onMeterAdd(selectedMeter){
    console.log('current selected meters',selectedMeter);
    this.addChartIndex= selectedMeter[0];
    this.selectedMeters=this.selectedMeters.concat(selectedMeter);
    console.log('selected meters after add',this.selectedMeters);
    console.log('selected meters data after',this.currentchart1c);


  }


  onMeterRemove(removeMeter){

    console.log('before remove',this.selectedMeters.indexOf(removeMeter[0]));
    console.log('current selected beofre meters',this.selectedMeters);
    this.selectedMeters.splice(this.selectedMeters.indexOf(removeMeter[0]),2);
    console.log('current selected after meters',this.selectedMeters);
    console.log('chart indexes before',this.chartIndexes );
    this.chartIndexes[removeMeter[0]]=0;
    console.log('chart indexes after',this.chartIndexes );

    this.currentchart1c.data.datasets[removeMeter[0]].data=[];
    console.log('before after chart1c',this.currentchart1c.data.datasets);
    this.currentchart1c.update();

    this.currentchart2c.data.datasets[removeMeter[0]].data=[];
    console.log('before after chart2c',this.currentchart2c.data.datasets);
    this.currentchart2c.update();

  }

  receiveMessageBatch($event){
        console.log('batch', $event);
        if ($event==='Batch'){this.realTime=false;
          console.log('Batch 1',this.realTime);}
      else {
        this.realTime=true;
        console.log('Realtime',this.realTime);}
      }

  receiveReportData($event){

    console.log('received criteria in chart got datatatatatta', $event);
    console.log('received criteria in chart indexes', this.chartIndexes);

    console.log('values in chart 1', this.currentchart1c.data.datasets);
    this.data=[];
    this.newData=[];

    //console.log('values in chart 1 - pos 1', this.currentchart1c.data.datasets[0].data.length);
    //console.log('values in chart 2 - pos 2', this.currentchart1c.data.datasets);
    //this.data = this.currentchart1c.data.datasets;
    //this.newData = this.currentchart2c.data.datasets;
    this.chartIndexes.forEach((element,index) => {

      if (element !== 0){
        console.log('element',element);
        this.data.push(this.currentchart1c.data.datasets[index].data);
        this.newData.push(this.currentchart2c.data.datasets[index].data);
      }
    });
    this.reportValues = [$event,this.data,this.newData];
    console.log('outgoing values',this.reportValues);
    const reportCriteria$ = this.databaservice.storeReport(this.reportValues);
    reportCriteria$.subscribe(report => this.reportCriteria = report as ReportType[]);
  }

  receiveMessageDisplayChart($event){
    this.message = $event;

    console.log('receiveMessageDisplayChart', this.message);
   // if (this.chart) {this.chart.destroy();}
    //if (this.doughnut) {this.doughnut.destroy();}
   // if (this.pie) {this.pie.destroy();}
   // this.currentchart1c = this.message;

    if (this.message === 'Bar'){

      this.linechart1c.destroy();

      this.barchart1c = this.startBarChart('mycanvas');
      this.barchart2c = this.startBarChart('mycanvas2');

      this.currentchart1c = this.barchart1c;
      this.currentchart2c = this.barchart2c;

      this.currentchart1c=this.updateChartData(this.currentchart1c, this.currentchart1c.data.datasets[this.addChartIndex].data,this.addChartIndex);
      this.currentchart2c=this.updateChartData(this.currentchart2c, this.currentchart2c.data.datasets[this.addChartIndex].data,this.addChartIndex);

    }

    if (this.message === 'Line'){
      //this.currentSetLabels = Array(this.data.length).fill("");
      this.linechart1c = this.startChart('mycanvas');
      this.linechart2c = this.startChart('mycanvas2');

      this.currentchart1c = this.linechart1c;
      this.currentchart2c = this.linechart2c;

     this.currentchart1c=this.updateChartData(this.currentchart1c, this.currentchart1c.data.datasets[this.addChartIndex].data,this.addChartIndex);
     this.currentchart2c=this.updateChartData(this.currentchart2c, this.currentchart2c.data.datasets[this.addChartIndex].data,this.addChartIndex);
    }
    this.onSelect(this.message);
  }

  updatePie(pie, newData,dataSetIndex){
    var total=0;
    for(var i =0; i < newData.length; i++){total += newData[i]};
    pie.data.datasets[0].data[dataSetIndex]=total;
    pie.update();
    return pie;
    }

  updateDoughnut(doughnut, newData,dataSetIndex){
    var total=0;
    for(var i =0; i < newData.length; i++){total += newData[i]};
    doughnut.data.datasets[0].data[dataSetIndex]=total;
    doughnut.update();
    return doughnut;
    }

  updateRadar(radar, newData,dataSetIndex){
    var total=0;
    for(var i =0; i < newData.length; i++){total += newData[i]};
    radar.data.datasets[0].data[dataSetIndex]=total;
    radar.update();
    return radar;
    }

  startPie(){
    this.pie1c = new Chart('mycanvas4',{
      type: 'pie',
      options: {
        maintainAspectRatio: false,responsive: true,
        title: {display: true, text: 'Highest Kwh Per Meter',
        padding:5,fontSize:30},
        legend: {position: 'right'},
        animation: {animateScale: true,animateRotate: true}
      },
      data: {
        datasets: [{
          backgroundColor: ["black","orange","blue","red","green"],
          label: 'Dataset 5',
          data: [0,0,0,0,0],
        }],
        labels: ['Reading 1','Reading 2','Reading 3','Reading 4','Reading 5'],
      }
    })
    return this.pie1c;
  }

  startDoughnut(){
      this.doughnut1c =  new Chart('mycanvas5',{
        type: 'doughnut',
        options: {
          maintainAspectRatio: false,
          responsive: true,
          title: {
            display: true,
            text: 'KwH Comparison',
            padding:5,
            fontSize:30
          },legend: {
            position: 'right',
          },animation: {
            animateScale: true,
            animateRotate: true
          }
        },
        data: {
          datasets: [{
            data: [0,0,0,0,0],
            backgroundColor: ["red","orange","yellow","green","blue"],
            label: 'Consumer Comsumption'
          }],
          labels: ['Reading 1','Reading 2','Reading 3','Reading 4','Reading 5']
        }
      })
      return this.doughnut1c;
  }



  startRadar(){

    var marksData = {
      datasets: [{
        data: [0,0,0,0,0],
        backgroundColor: ["red","orange","yellow","green","blue"],
        label: 'Consumer Comsumption'
      }],
      labels: ['Reading 1','Reading 2','Reading 3','Reading 4','Reading 5']
    };

    var radarchart1c = new Chart('mycanvas6', {
      type: 'radar',
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: true, text: 'Lowest Kwh Per Meter', padding:5,fontSize:30},
          legend: {position: 'bottom'},
          animation: {animateScale: true,animateRotate: true
        }
      },
      data: marksData
    });
return radarchart1c;

  }


  startBarChart(currentCanvas){
    this.barChart = new Chart(currentCanvas, {
      type: 'bar',
      options: this.barOptions,
      data: {
        labels: this.currentSetLabels,
        datasets: [
          {
            type: 'bar',label: 'Consumer Comsumption',
            data: this.currentchart2c.data.datasets[0].data,
            backgroundColor: '#ffd859',
            borderColor: '#ffd859',fill: false,
          },          {
            type: 'bar',label: 'Consumer Comsumption',
            data: this.currentchart2c.data.datasets[1].data,
            backgroundColor: '#098765',
            borderColor: '#098765',fill: true,
          },          {
            type: 'bar',label: 'Consumer Comsumption',
            data: this.currentchart2c.data.datasets[2].data,
            backgroundColor: '#2b2b87',
            borderColor: '#2b2b87',fill: true,
          },          {
            type: 'bar',label: 'Consumer Comsumption',
            data: this.currentchart2c.data.datasets[3].data,
            backgroundColor: '#ff3d40',
            borderColor: '#ff3d40',fill: true,
          },          {
            type: 'bar',label: 'Consumer Comsumption',
            data: this.currentchart2c.data.datasets[4].data,
            backgroundColor: '#0ffff0',
            borderColor: '#0ffff0',fill: true,
          }
        ]
      }
    });
    return this.barChart;
  }

  updateSlider(value){
    console.log('thisvalue',value);
  }

  initialiseChart(currentCanvas){
    this.chart = new Chart(currentCanvas, {
      type: 'line',
      options: this.lineOptions,
      data: {
        labels: this.fullSetLabels,
        datasets: [{
          lineTension: 0.1,type: 'line', fill:false, borderColor:'#ffd859',
          data: [],
        },{
          lineTension: 0.1,type: 'line',fill: false, borderColor:'#098765',
          data: [],
        },{
          lineTension: 0.1,type: 'line',fill: false, borderColor:'#2b2b87',
          data: [],
        },{
          lineTension: 0.1,type: 'line',fill: false, borderColor:'#ff3d40',
          data: [],
        },{
          lineTension: 0.1,type: 'line',fill: false, borderColor:'#0ffff0',
          data: [],
        }]
      }
    });

    return this.chart;

  }

  startChart(currentCanvas){
    this.chart = new Chart(currentCanvas, {
      type: 'line',
      options: this.lineOptions,
      data: {
        labels: this.fullSetLabels,
        datasets: [{
          lineTension: 0.1,type: 'line', fill:false, borderColor:'#ffd859',
          data: this.currentchart2c.data.datasets[0].data,
        },{
          lineTension: 0.1,type: 'line',fill: false, borderColor:'#098765',
          data: this.currentchart2c.data.datasets[1].data,
        },{
          lineTension: 0.1,type: 'line',fill: false, borderColor:'#2b2b87',
          data: this.currentchart2c.data.datasets[2].data,
        },{
          lineTension: 0.1,type: 'line',fill: false, borderColor:'#ff3d40',
          data: this.currentchart2c.data.datasets[3].data,
        },{
          lineTension: 0.1,type: 'line',fill: false, borderColor:'#0ffff0',
          data: this.currentchart2c.data.datasets[4].data,
        }]
      }
    });

    return this.chart;

  }


  addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
  }

  removeData(chart) {
      chart.data.labels.pop();
      chart.data.datasets.forEach((dataset) => {
          dataset.data.pop();
      });
      chart.update();
  }

  updateChartData(chart, data1, dataSetIndex){
  console.log('input data chart dataset',chart.data.datasets[dataSetIndex].data);
    console.log('input data1',data1);
    console.log('input data datasetindex',dataSetIndex);
    this.currentSetLabels = Array(data1.length).fill("");
    chart.data.datasets[dataSetIndex].data=data1;
   // console.log('input data chart dataset after',chart.data.datasets[dataSetIndex].data);
    chart.data.labels = this.currentSetLabels;

    chart.options = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {display: false },
      scales: {
        yAxes: [{
          ticks: {suggestedMin: 0,suggestedMax: 1,display:false},
          gridLines: {display: false}, stacked: true
        }],
        xAxes: [{
          ticks: {suggestedMin: 0,suggestedMax: 500,display:false},
          gridLines: {display: false}, stacked: true
        }]
      },
      data: {
      //  labels: this.fullSetLabels
      }
    };

    chart.update();
    return chart;

  }


  start2ndChart(){
    this.chart = new Chart('mycanvas2', {
      type: 'line',
     options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {display: false,},
      scales: {
        yAxes: [{
        ticks: {suggestedMin: 0,suggestedMax: 1,display:false},
        gridLines: {display: false},
        stacked: false
      }],
      xAxes: [{
       // ticks: {min: 0,max: 100,display:true},
        gridLines: {display: false},
        stacked: false
      }]
    }
      },
      data: {
        labels: this.fullSetLabels,
        datasets: [{
          lineTension: 0.9,type: 'line', fill:false, borderColor:'#ffd859',
          data: [],
        },{
          lineTension: 0.9,type: 'line',fill: false, borderColor:'#098765',
          data: [],
        },{
          lineTension: 0.9,type: 'line',fill: false, borderColor:'#2b2b87',
          data: [],
        },{
          lineTension: 0.9,type: 'line',fill: false, borderColor:'#ff3d40',
          data: [],
        },{
          lineTension: 0.9,type: 'line',fill: false, borderColor:'#000000',
          data: [],
        }]
      }
    });
    return this.chart;
  }

  applyFilter(){
    if(this.reportValues[0].schedulename){
 //     this.dataSource.filter = this.reportValues[0].schedulename;
   //   this.dataSource.filter = this.dataSource.filter;
   // console.log('applying filter', this.dataSource.filter);
    }else{
    //  this.dataSource.filter = ' ';

    }
  }

}

