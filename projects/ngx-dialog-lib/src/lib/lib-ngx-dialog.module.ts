import { NgModule } from '@angular/core';
import { LibNgxDialogComponent } from './lib-ngx-dialog.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';



@NgModule({
  declarations: [LibNgxDialogComponent],
  imports: [
    OverlayModule,
    PortalModule
  ],
  exports: [LibNgxDialogComponent]
})
export class LibNgxDialogModule { }
