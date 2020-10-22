import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';

import { 
  SettingsService, 
  SidebarService, 
  SharedService, 
  UploadService,
  UserService,
  LoginGuard
} from "./service.index";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingsService, 
    SidebarService, 
    SharedService,
    UserService,
    LoginGuard,
    UploadService,
    ModalUploadService
  ]
})
export class ServiceModule { }
