import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ModalModule } from '../ng2-bs3-modal/ng2-bs3-modal.module';
import { SelectProjectComponent } from './select-project.component';
import { SelectProjectRoutingModule } from './select-project-routing.module';
import { ProjectDisciplineService } from './project-discipline.service';
import { ProjectDisciplineStoreService } from './project-discipline-store.service';

@NgModule({
    imports: [
    BrowserModule,
    ModalModule,
    SelectProjectRoutingModule
  ],
  declarations: [ SelectProjectComponent ],
  providers: [ ProjectDisciplineService, ProjectDisciplineStoreService]
})
export class SelectProjectModule{}
