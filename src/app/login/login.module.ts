import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {AutoCompleteModule} from 'primeng/autocomplete';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { LoginComponent } from './login.component';
import {DialogModule, DropdownModule, FileUploadModule, MessageService} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    AutoCompleteModule,
    BrowserModule,
    FormsModule,
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
  bootstrap: [LoginComponent]
})
export class LoginModule { }
