import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './_modules/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HomeComponent } from './_modules/home/home.component';
import { RegisterComponent } from './_modules/register/register.component';
import { MemberListComponent } from './_modules/members/member-list/member-list.component';
import { ListsComponent } from './_modules/lists/lists.component';
import { MessagesComponent } from './_modules/messages/messages.component';
import { ToastrModule } from 'ngx-toastr';
import { MemberCardComponent } from './_modules/members/member-card/member-card.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MemberEditComponent } from './_modules/members/member-edit/member-edit.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { PhotoEditorComponent } from './_modules/members/photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: "toast-bottom-right"
    }),
    NgxSpinnerModule.forRoot({
      type: "timer"
    }),
    FileUploadModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
