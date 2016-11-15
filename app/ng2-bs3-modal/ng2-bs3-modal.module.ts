import { NgModule, Type } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ModalComponent } from './components/modal';
import { ModalHeaderComponent } from './components/modal-header';
import { ModalBodyComponent } from './components/modal-body';
import { ModalFooterComponent } from './components/modal-footer';
import { AutofocusDirective } from './directives/autofocus';


@NgModule({
  imports:      [ SharedModule ],
  declarations: [ ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent, AutofocusDirective ],
  exports:      [ ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent, AutofocusDirective ]
})
export class ModalModule {}
