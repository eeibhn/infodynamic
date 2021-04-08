import { Injectable } from '@angular/core';
import {io} from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: any;
  socket1: any;


  constructor() {
    this.socket = io('http://localhost:3000');
    this.socket1 = io('http://localhost:8080');

  }

  listen(Eventname: string){
   return new Observable((subscriber) => {

    this.socket.on(Eventname, (data) => {
      console.log('returning',data);
     subscriber.next(data);
   });
  });
  }

  // tslint:disable-next-line: typedef
  listen1(Eventname: string){
    console.log('got here listen 1');
    return new Observable((subscriber) => {
      this.socket1.on(Eventname, (data) => {
        console.log('returning2',data);

        subscriber.next(data);
      });
    });
  }

  // tslint:disable-next-line: typedef
  emit(EventName: string, data: any){
    this.socket.emit(EventName, data);
  }

  // tslint:disable-next-line: typedef
  emit1(EventName: string, data: string, freq:number){
    console.log('emit1');
    this.socket1.emit(EventName, data,freq);
  }

}
