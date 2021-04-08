import { iHomeComponent } from './Components/iHome/iHome.component';
import { iDashComponent } from './Components/iDash/iDash.component';
import { iReportComponent } from './Components/iReport/iReport.component';
import { iIntellComponent } from './Components/iIntell/iIntell.component';
import { iBillComponent } from './Components/iBill/iBill.component';
import { iControlComponent } from './Components/iControl/iControl.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path: '' , redirectTo: '/home', pathMatch: 'full'},
  {path: 'home' , component: iHomeComponent},
  {path: 'iDash', component: iDashComponent},
  {path: 'iReport', component: iReportComponent},
  {path: 'iIntell', component: iIntellComponent},
  {path: 'iBill', component: iBillComponent},
  {path: 'iControl', component: iControlComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [iHomeComponent, iDashComponent, iReportComponent, iIntellComponent , iBillComponent, iControlComponent ];
