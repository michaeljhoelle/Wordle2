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
import { WinnerBoxComponent } from './winner-box/winner-box.component';
import {MatDialogModule} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {RouterTestingModule} from "@angular/router/testing";
import { WordleComponent } from './wordle/wordle.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    WordRowComponent,
    LetterBoxComponent,
    WinnerBoxComponent,
    WordleComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    FormsModule,
    ToastModule,
    ButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule,
    ClipboardModule,
    RouterTestingModule,
    RouterModule.forRoot([
      {path: 'wordle', component: WordleComponent},
      {path: '', redirectTo: '/wordle', pathMatch: 'full'},
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
