import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {LibNgxDialogService} from '../../projects/ngx-dialog-lib/src/lib/lib-ngx-dialog.service';
import {Overlay} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('dialogHello') dialogHelloRef: TemplateRef<any>;

  constructor(private overlay: Overlay, public viewContainerRef: ViewContainerRef, public dialogService: LibNgxDialogService) {}

  ngOnInit() {
    this.dialogService.overlayRef = this.overlay.create({
      hasBackdrop: true,
      width: '100rem',
      maxWidth: 'calc(100% - 5rem)',
      scrollStrategy: this.overlay.scrollStrategies.block()
    });
  }

  createTemplatePortal(templateRef: TemplateRef<any>) {
    return new TemplatePortal(templateRef, this.viewContainerRef);
  }

}
