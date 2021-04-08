import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { iDashComponent } from './Components/iDash/iDash.component';
import { iReportComponent } from './Components/iReport/iReport.component';
import { iIntellComponent } from './Components/iIntell/iIntell.component';
import { iBillComponent } from './Components/iBill/iBill.component';
import { iControlComponent } from './Components/iControl/iControl.component';
import { iHomeComponent } from './Components/iHome/iHome.component';
import { DatabaseComponent } from './Components/database/database.component';

import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SearchComponent } from './Components/search/search.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DownloadComponent } from './Components/download/download.component';
import { UploadComponent } from './Components/upload/upload.component';
import { ChartComponent } from './Components/chart/chart.component';
import { ChartcopyComponent } from './Components/chartcopy/chartcopy.component';

import { DisplayComponent } from './Components/display/display.component';
import { EditComponent } from './Components/edit/edit.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxSliderModule } from '@m0t0r/ngx-slider';
import { SchedulerComponent } from './Components/scheduler/scheduler.component';
import { ScheduleviewerComponent } from './Components/scheduleviewer/scheduleviewer.component';
import { ReportselectorComponent }

from './Components/reportselector/reportselector.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SearchBillComponent } from './Components/search-bill/search-bill.component';
import { DisplayBillComponent } from './Components/display-bill/display-bill.component';
import { BatchComponent } from './Components/batch/batch.component';
import { MetertreeComponent } from './Components/metertree/metertree.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    DatabaseComponent,
    SearchComponent,
    DownloadComponent,
    UploadComponent,
    DisplayComponent,
    ChartComponent,
    ChartcopyComponent,
    EditComponent,
    SchedulerComponent,
    ScheduleviewerComponent,
    ReportselectorComponent,
    SearchBillComponent,
    DisplayBillComponent,
    BatchComponent,
    MetertreeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxSliderModule,
    PdfViewerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
