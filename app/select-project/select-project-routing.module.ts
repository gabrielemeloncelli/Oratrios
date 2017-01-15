import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SelectProjectComponent } from './select-project.component';
import { ProjectDisciplineService } from './project-discipline.service';
import { ProjectDisciplineStoreService } from './project-discipline-store.service';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'select-project', component: SelectProjectComponent}
  ])],
  exports: [RouterModule],
  providers: [ProjectDisciplineStoreService, ProjectDisciplineService]
})
export class SelectProjectRoutingModule {}
