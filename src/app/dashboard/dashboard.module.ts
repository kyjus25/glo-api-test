import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {AutoCompleteModule} from 'primeng/autocomplete';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { DashboardComponent } from './dashboard.component';
import {DialogModule, DropdownModule, FileUploadModule, MenuModule, MessageService, MultiSelectModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {ToastModule} from 'primeng/toast';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    AutoCompleteModule,
    BrowserModule,
    FormsModule,
    MultiSelectModule,
    MenuModule,
    TooltipModule,
    DropdownModule,
    FileUploadModule,
    DialogModule,
    TableModule,
    ToastModule,
    BrowserAnimationsModule,
  ],
  providers: [
    MessageService,
  ],
  bootstrap: [DashboardComponent]
})
export class DashboardModule { }
