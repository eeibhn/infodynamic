import { StringDecoder } from "string_decoder";

export interface SearchDevices {
  id: number;
  item: string;
 // searchValues: [];
 //  params1: string;
}

export interface FileType {
  name: string;
  datecreated: BigInteger;
}

export interface ReportType {
  name: string;
  datecreated: BigInteger;
}

export interface AreaType {
  areaid: number;
  name: string;
}

export interface ReportDataType {
  areaid: any;
  areaname: string;
  meterserialno: number;
  nmi: number;
  schedulename: string;
}


export interface MeterData {
  //name: string;
  //value: BigInteger;
  intervaldatavalue: number;
}


/*export interface FileType {
  name: string;
  datecreated: number;
  startdate: number;
  devicetype: string;
  frequency; number;

 // searchValues: [];
 //  params1: string;
}
*/
export class ScheduleType {
  id: number;
  name: string;
  selectedDeviceType: DeviceType;
  startdevice: number;
  endDeviceValue: number;
  frequency: number;
  startdate:any;
  enddate: any;
  startscheduledate:Date;
  endscheduledate:any;
  rangedate:[any,any];

}

export class bsRange{
  startDate:Date;
  endDate:Date;
}

export class SearchType {
  selectedDeviceType: String[];
  startdevice: number;
  endDeviceValue: number;
  startTime:any;
  endTime: any;
  startscheduledate:any;
  endscheduledate:any;
  name:string;
  rangedate:[any,any];
  frequency:number;
}

export class ScheduleReportInterface {
  id: number;
  name: string;
  selectedDeviceType: DeviceType;
  startDeviceValue: number;
  endDeviceValue: number;
  frequency: number;
  startTime:any;
  endTime: any;

}

export interface Infodata {
  id: number;
  item: string;
}

export interface DeviceType {
  id:  number;
  item: string;
}

export interface MeterType {
  id:  number;
  item: string;
}


export interface NEMType {
  id: number;
  item: string;
}





