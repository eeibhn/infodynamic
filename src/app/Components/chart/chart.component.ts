
import { Component, OnInit, Input, destroyPlatform } from '@angular/core';
import { Chart } from 'chart.js';
import { SocketService } from '../../Services/socket.service';
import { Options } from '@m0t0r/ngx-slider';
// import { DisplayComponent } from '../display/display.component';
import { DatabaseService } from './../../Services/database.service';
import { MeterData } from 'src/app/model/infodata';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { ReportType } from 'src/app/model/infodata';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  constructor(  private databaservice: DatabaseService,
                private srv1: SocketService
                ) { };

  meterdata$: MeterData[]=[];
  reportCriteria$: Observable<ReportType[]>;
  reportCriteria;

  message:string;
  subscription: Subscription;

  selections: any = [ 'Batch', 'NRT'];
  chartTypes: any = [ 'Bar', 'Line'];
  chartType;

  chartValues1 = [];
  chartValues2 = [];


  lineChart1;
  lineChart2;
  pie1;

  chart3;
  barChart;
  barChart1;
  barChart2;
  //canvas1 = 'mycanvas';
  //canvas2 = 'mycanvas200';
length;

  title = 'dashboard';
  @Input() chart;



  currentChart1;
  currentChart2;
  currentPie;
  pie1;

  currentDoughnut: any;
  doughnut1: any;

  currentRadar:any;

  radar1:any;
  selectedMeters = [];
  selectedAreas = [];


  currentNMI:number;
  data = [];
  data1 = [];
  newData = [];
  currentData =[];
  reportValues =[];
  report;

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

  footer:boolean;

  options: Options = {
    floor: 0,
    ceil: 100,
    showOuterSelectionBars: true,

  };
  metervalue:MeterData[];
  removeChartIndex: number;

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

if (this.lineChart1){
  this.lineChart1.destroy();
  this.lineChart2.destroy();}
if (this.currentChart1){
  this.currentChart1.destroy();
  this.currentChart2.destroy();}

    this.lineChart1 = this.initialiseChart('mycanvas100');
    this.lineChart2 = this.initialiseChart('mycanvas200');
    this.pie1 = this.startPie();
    this.doughnut1 = this.startDoughnut();
    this.radar1 = this.startRadar();


    this.currentChart1 = this.lineChart1;
    this.currentChart2 = this.lineChart2;
    this.currentPie = this.pie1;
    this.currentDoughnut = this.startDoughnut();
    this.currentRadar = this.startRadar();
    this.chartIndexes = [0,0,0,0,0];
    this.selectedMeters = [];
    console.log('subscrbing again',this.selectedMeters);

    this.subscription = this.databaservice.currentMessage.subscribe((metervalue:[]) => {
if (this.selectedMeters.length > 0){
      this.testmessage=metervalue;}
      console.log('recevied from database service',metervalue);
      this.data=[];
      this.data1=[];
      this.firstFreeIndex=this.chartIndexes.indexOf(0);
      console.log('test message received in chart',this.testmessage);
      for (var i=0;i<this.testmessage.length;i++){
        this.data.push(this.testmessage[i].intervaldatavalue);
        this.data1.push(this.testmessage[i].intervaldatavalue);
        this.chartIndexes.splice(this.addChartIndex, 1,this.testmessage[0]);
      };
      console.log('chartIndexes',this.chartIndexes);

      //this.chartValues1.push(this.data);
      //this.chartValues2.push(this.data);


      this.currentChart1 = this.updateChartData(this.currentChart1, this.data, this.addChartIndex);
      this.currentChart2 = this.updateChartData(this.currentChart2, this.data,this.addChartIndex);

      this.currentPie=  this.updatePie(this.currentPie,this.data,this.addChartIndex);

      this.currentDoughnut=  this.updateDoughnut(this.currentDoughnut,this.data,this.addChartIndex);

      this.currentRadar=  this.updateRadar(this.currentRadar,this.data,this.addChartIndex);

    })

    this.srv1.listen('data3').subscribe((res: any) => {
      console.log('received data from socket');
      if (this.realTime){
        console.log('received data NRT');
        switch(this.message){
          case 'Bar':{
            this.updateChartData(this.chart, res, 0);break;
            }
          case 'Pie':{
            this.updateChartData(this.pie1, res, 0);break;
            }
          case'Doughnut':{
            this.updateChartData(this.doughnut1, res, 0);break;
            }
          case 'Line':{
            this.updateChartData(this.chart, res, 0);break;
            }
          }
        }
    });

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

      this.currentChart1=this.updateChartData(this.currentChart1,this.newData, index);

      this.currentPie=  this.updatePie(this.currentPie,this.newData,this.addChartIndex);

      this.currentDoughnut=  this.updateDoughnut(this.currentDoughnut,this.newData,this.addChartIndex);

      this.currentRadar=  this.updateRadar(this.currentRadar,this.newData,this.addChartIndex);
      }
    });
   //this.currentChart1.data.datasets.push(this.newData);
    //this.currentChart2.data.datasets.push(this.newData);
    //console.log('selected meters data after',this.currentChart1.data.datasets);

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
    console.log('selected meters data after',this.currentChart1);


  }


  onMeterRemove(removeMeter){

    console.log('before remove',this.selectedMeters.indexOf(removeMeter[0]));
    console.log('current selected beofre meters',this.selectedMeters);
    this.selectedMeters.splice(this.selectedMeters.indexOf(removeMeter[0]),2);
    console.log('current selected after meters',this.selectedMeters);
    console.log('chart indexes before',this.chartIndexes );
    this.chartIndexes[removeMeter[0]]=0;
    console.log('chart indexes after',this.chartIndexes );

    this.currentChart1.data.datasets[removeMeter[0]].data=[];
    console.log('before after chart1',this.currentChart1.data.datasets);
    this.currentChart1.update();

    this.currentChart2.data.datasets[removeMeter[0]].data=[];
    console.log('before after chart2',this.currentChart2.data.datasets);
    this.currentChart2.update();

  }

  receiveMessageBatch($event){
        console.log('batch', $event);
        if ($event==='Batch'){this.realTime=false;
          console.log('Batch 1',this.realTime);}
      else {
        this.realTime=true;
        console.log('Realtime',this.realTime);}
      }

  receiveReportCriteria($event){
    console.log('received criteria in chart', $event);
    console.log('received criteria in chart indexes', this.chartIndexes);

    console.log('values in chart 1', this.currentChart1.data.datasets);
    this.data=[];
    this.newData=[];

    //console.log('values in chart 1 - pos 1', this.currentChart1.data.datasets[0].data.length);
    //console.log('values in chart 2 - pos 2', this.currentChart1.data.datasets);
    //this.data = this.currentChart1.data.datasets;
    //this.newData = this.currentChart2.data.datasets;
    this.chartIndexes.forEach((element,index) => {

     // if (element !== 0){
        console.log('element',element);
        this.data.push(this.currentChart1.data.datasets[index].data);
        this.newData.push(this.currentChart2.data.datasets[index].data);
     // }
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
   // this.currentChart1 = this.message;

    if (this.message === 'Bar'){

      this.lineChart1.destroy();
      this.lineChart2.destroy();


      this.barChart1 = this.startBarChart('mycanvas100');
      this.barChart2 = this.startBarChart('mycanvas200');

      this.currentChart1 = this.barChart1;
      this.currentChart2 = this.barChart2;

      this.currentChart1=this.updateChartData(this.currentChart1, this.currentChart1.data.datasets[this.addChartIndex].data,this.addChartIndex);
      this.currentChart2=this.updateChartData(this.currentChart2, this.currentChart2.data.datasets[this.addChartIndex].data,this.addChartIndex);

    }

    if (this.message === 'Line'){
      //this.currentSetLabels = Array(this.data.length).fill("");
      this.lineChart1 = this.startChart('mycanvas100');
      this.lineChart2 = this.startChart('mycanvas200');

      this.currentChart1 = this.lineChart1;
      this.currentChart2 = this.lineChart2;

     this.currentChart1=this.updateChartData(this.currentChart1, this.currentChart1.data.datasets[this.addChartIndex].data,this.addChartIndex);
     this.currentChart2=this.updateChartData(this.currentChart2, this.currentChart2.data.datasets[this.addChartIndex].data,this.addChartIndex);
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
    this.pie1 = new Chart('mycanvas400',{
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
    return this.pie1;
  }

  startDoughnut(){
      this.doughnut1 =  new Chart('mycanvas500',{
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
      return this.doughnut1;
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

    var radarChart1 = new Chart('mycanvas600', {
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
return radarChart1;

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
            data: this.currentChart2.data.datasets[0].data,
            backgroundColor: '#ffd859',
            borderColor: '#ffd859',fill: false,
          },          {
            type: 'bar',label: 'Consumer Comsumption',
            data: this.currentChart2.data.datasets[1].data,
            backgroundColor: '#098765',
            borderColor: '#098765',fill: true,
          },          {
            type: 'bar',label: 'Consumer Comsumption',
            data: this.currentChart2.data.datasets[2].data,
            backgroundColor: '#2b2b87',
            borderColor: '#2b2b87',fill: true,
          },          {
            type: 'bar',label: 'Consumer Comsumption',
            data: this.currentChart2.data.datasets[3].data,
            backgroundColor: '#ff3d40',
            borderColor: '#ff3d40',fill: true,
          },          {
            type: 'bar',label: 'Consumer Comsumption',
            data: this.currentChart2.data.datasets[4].data,
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
          data: this.currentChart2.data.datasets[0].data,
        },{
          lineTension: 0.1,type: 'line',fill: false, borderColor:'#098765',
          data: this.currentChart2.data.datasets[1].data,
        },{
          lineTension: 0.1,type: 'line',fill: false, borderColor:'#2b2b87',
          data: this.currentChart2.data.datasets[2].data,
        },{
          lineTension: 0.1,type: 'line',fill: false, borderColor:'#ff3d40',
          data: this.currentChart2.data.datasets[3].data,
        },{
          lineTension: 0.1,type: 'line',fill: false, borderColor:'#0ffff0',
          data: this.currentChart2.data.datasets[4].data,
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
console.log('chart indexes update chart',this.chartIndexes);
  console.log('input data chart dataset',chart.data.datasets[dataSetIndex].data);
    console.log('input data1',data1);
  //  console.log('input data datasetindex',dataSetIndex);
    this.currentSetLabels = Array(data1.length).fill("");
    chart.data.datasets[dataSetIndex].data=data1;
    console.log('input data chart dataset after',chart.data.datasets[dataSetIndex].data);
    chart.data.labels = this.currentSetLabels;
console.log('current labels',chart);
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
    this.chart = new Chart('mycanvas200', {
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

}
