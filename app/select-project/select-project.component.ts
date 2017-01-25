import { Component, OnInit } from '@angular/core';
import { Project } from './project';
import { ProjectDisciplineService } from './project-discipline.service';
import { UiStatusService } from '../core/ui-status.service';
import { ProjectDiscipline } from './project-discipline';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'app/select-project/select-project.component.html',
    styleUrls:['app/select-project/select-project.component.css']
  }
)
export class SelectProjectComponent{
  public projects: Project[];
  private _mockProjects = new Array<Project>();

  constructor(private _projectDisciplineService: ProjectDisciplineService, private _uiStatusService: UiStatusService,
    private _router: Router ){
    //this.buildMockProjects();
    //this.projects = this._mockProjects;
    this._uiStatusService.projectCode = "";
    this._uiStatusService.projectId = 0;
    this._uiStatusService.disciplineId = 0;
    this._uiStatusService.disciplineCode = "";
    this._uiStatusService.projectDisciplineId = 0;
  }

  ngOnInit()
  {

     this._projectDisciplineService.projects.subscribe(
       projects => this.projectsRetrieved(projects)
     );

     this._projectDisciplineService.projectDisciplines.subscribe(
      projectDisciplines => this.projectDisciplinesRetrieved(projectDisciplines)
    );
    this._projectDisciplineService.discipline.subscribe(
      projectDiscipline => this.projectDisciplineRetrieved(projectDiscipline)
    );

    this._projectDisciplineService.selectUser();


  }


  selectProject(code: string){
    console.log('select-project.component -- selectProject -- code: ' + code); //TODO: remove
    this._projectDisciplineService.selectProject(code);

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
    console.log('select-project.component -- projectDisciplineRetrieved');//TODO:remove
    if (projectDiscipline != null)
    {
      this._uiStatusService.disciplineId = projectDiscipline.discipline.id;
      this._uiStatusService.disciplineCode = projectDiscipline.discipline.code;
      this._uiStatusService.projectDisciplineId = projectDiscipline.id;
      console.log('select-project.component -- projectDisciplineRetrieved -- navigate');//TODO:remove
      this._router.navigate(['/fill-bom']);
    }
  }

  projectsRetrieved(projects: Project[])
  {
    if (projects == null)
    {
      this.projects = new Array<Project>();
    }
    else
    {
      this.projects = projects;
    }
  }


}
