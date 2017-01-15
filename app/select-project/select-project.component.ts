import { Component, OnInit } from '@angular/core';
import { Project } from './project';
import { ProjectDisciplineService } from './project-discipline.service';
import { UiStatusService } from '../core/ui-status.service';
import { ProjectDiscipline } from './project-discipline';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'app/select-project/select-project.component.html'
  }
)
export class SelectProjectComponent{
  public projects: Project[];
  private _mockProjects = new Array<Project>();

  constructor(private _projectDisciplineService: ProjectDisciplineService, private _uiStatusService: UiStatusService,
    private _router: Router ){
    this.buildMockProjects();
    this.projects = this._mockProjects;
  }

  ngOnInit()
  {
     this._projectDisciplineService.projectDisciplines.subscribe(
      projectDisciplines => this.projectDisciplinesRetrieved(projectDisciplines)
    );
    this._projectDisciplineService.discipline.subscribe(
      projectDiscipline => this.projectDisciplineRetrieved(projectDiscipline)
    );

  }


  selectProject(code: string){
    console.log('select-project.component -- selectProject -- code: ' + code); //TODO: remove
    this._projectDisciplineService.selectProject(code);
    /*
    _disciplineService.getDisciplines(code)
    .subscribe(d => this.selectProjectDiscipline(d))
    */
  }

  buildMockProjects()
  {
    var newProject: Project;
    newProject = new Project(0, "A00001");
    this._mockProjects.push(newProject);
    newProject = new Project(0, "A00002");
    this._mockProjects.push(newProject);
    newProject = new Project(0, "A00003");
    this._mockProjects.push(newProject);
    newProject = new Project(0, "B00001");
    this._mockProjects.push(newProject);
    newProject = new Project(0, "B00002");
    this._mockProjects.push(newProject);
    newProject = new Project(0, "AKEPC234");
    this._mockProjects.push(newProject);
  }

  projectDisciplinesRetrieved(projectDisciplines: ProjectDiscipline[])
  {
    if (projectDisciplines != null && projectDisciplines.length > 0)
    {
      var selectedDiscipline = projectDisciplines[0];
      this._uiStatusService.projectCode = selectedDiscipline.project.code;
      this._uiStatusService.projectId = selectedDiscipline.project.id;
      this._projectDisciplineService.selectDiscipline(this._uiStatusService.projectId, selectedDiscipline.discipline.code)
    }
  }

  projectDisciplineRetrieved(projectDiscipline: ProjectDiscipline)
  {
    if (projectDiscipline != null)
    {
      this._uiStatusService.disciplineId = projectDiscipline.discipline.id;
      this._uiStatusService.disciplineCode = projectDiscipline.discipline.code;
      this._uiStatusService.projectDisciplineId = projectDiscipline.id;
      this._router.navigate(['/fill-bom']);
    }
  }


}
