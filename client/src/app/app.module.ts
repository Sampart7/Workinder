import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './_helpers/interceptors/loading.interceptor';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { JwtInterceptor } from './_helpers/interceptors/jwt.interceptor';
import { NavbarComponent } from './_components/navbar/navbar.component';
import { HomeComponent } from './_components/home/home.component';
import { RegisterComponent } from './_components/register/register.component';
import { MemberListComponent } from './_components/members/member-list/member-list.component';
import { ListsComponent } from './_components/lists/lists.component';
import { MessagesComponent } from './_components/messages/messages.component';
import { MemberCardComponent } from './_components/members/member-card/member-card.component';
import { MemberEditComponent } from './_components/members/member-edit/member-edit.component';
import { PhotoEditorComponent } from './_components/members/photo-editor/photo-editor.component';
import { DateInputComponent } from './forms/date-input/date-input.component';
import { TextInputComponent } from './forms/text-input/text-input.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TimeagoModule } from 'ngx-timeago';
import { ConfirmDialogComponent } from './_components/confirm-dialog/confirm-dialog.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmService } from './services/confirm.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    ListsComponent,
    MessagesComponent,
    MemberCardComponent,
    MemberEditComponent,
    PhotoEditorComponent,
    DateInputComponent,
    TextInputComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    TabsModule,
    BsDropdownModule,
    BsDatepickerModule,
    ButtonsModule,
    PaginationModule,
    TimeagoModule.forRoot(),
    ToastrModule.forRoot({ positionClass: "toast-bottom-right" }),
    NgxSpinnerModule.forRoot({ type: "timer" }),
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    BsModalService, ConfirmService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
