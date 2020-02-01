import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgxDialogLibModule} from '../../projects/ngx-dialog-lib/src/lib/ngx-dialog-lib.module';
import {OverlayModule} from '@angular/cdk/overlay';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    OverlayModule,
    NgxDialogLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
