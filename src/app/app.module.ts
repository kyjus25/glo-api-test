import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {MenuModule} from 'primeng/menu';
import {MenuItem, MessageService} from 'primeng/api';
import {AutoCompleteModule} from 'primeng/autocomplete';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import {CardModule} from 'primeng/card';
import {ChartModule} from 'primeng/chart';
import {appRoutes} from './routes';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {DropdownModule} from 'primeng/dropdown';
import {DialogModule, FileUploadModule, TabMenuModule, TooltipModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {DashboardModule} from './dashboard/dashboard.module';
import {LoginModule} from './login/login.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true }),
    MenuModule,
    ChartModule,
    DropdownModule,
    AutoCompleteModule,
    BrowserModule,
    CardModule,
    FormsModule,
    DialogModule,
    TabMenuModule,
    TableModule,
    HttpClientModule,
    TooltipModule,
    FileUploadModule,
    ToastModule,
    BrowserAnimationsModule,
    LoginModule,
    DashboardModule,
  ],
  providers: [
    MessageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
