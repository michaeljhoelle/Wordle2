import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {WordRowComponent} from "./word-row/word-row.component";
import { LetterBoxComponent } from './letter-box/letter-box.component';
import {FormsModule} from "@angular/forms";
import {ToastModule} from "@syncfusion/ej2-angular-notifications";
import {ButtonModule} from "@syncfusion/ej2-angular-buttons";

@NgModule({
  declarations: [
    AppComponent,
    WordRowComponent,
    LetterBoxComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    FormsModule,
    ToastModule,
    ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
