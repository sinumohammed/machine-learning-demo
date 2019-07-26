import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule, MatDividerModule, MatSelectModule, MatButtonModule, MatProgressSpinnerModule} from '@angular/material';
import { ChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';
import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSelectModule,
    MatButtonModule,
    ChartsModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
