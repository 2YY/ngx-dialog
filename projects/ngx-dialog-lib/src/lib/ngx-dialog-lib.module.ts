import { NgModule } from '@angular/core';
import { NgxDialogLibComponent } from './ngx-dialog-lib.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';



@NgModule({
  declarations: [NgxDialogLibComponent],
  imports: [
    OverlayModule,
    PortalModule
  ],
  exports: [NgxDialogLibComponent]
})
export class NgxDialogLibModule { }
