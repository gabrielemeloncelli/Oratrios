import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/observable';
import { Subject } from 'rxjs/subject';
import { ProjectDiscipline } from './project-discipline';
import { ProjectDisciplineStoreService } from './project-discipline-store.service';
import { Project } from './project';


@Injectable()
export class ProjectDisciplineService{
  private _projects: Subject<Array<Project>> = new Subject<Array<Project>>();
  public projects: Observable<Project[]> = this._projects.asObservable();
  private _projectDisciplines: Subject<Array<ProjectDiscipline>> = new Subject<ProjectDiscipline[]>();
  public projectDisciplines: Observable<Array<ProjectDiscipline>> = this._projectDisciplines.asObservable();
  private _discipline: Subject<ProjectDiscipline> = new Subject<ProjectDiscipline>();
  public discipline: Observable<ProjectDiscipline> = this._discipline.asObservable();
  private nodeId: number = 0;

  constructor(private _storeService: ProjectDisciplineStoreService){}

  selectUser(){
    this._storeService.selectUser().subscribe(
      projects => this._projects.next(projects)
    );
  }

  selectProject(projectCode: string)
  {
    this._storeService.selectProject(projectCode).subscribe(
      projectDisciplines => this._projectDisciplines.next(projectDisciplines)
    );
  }

  selectDiscipline(projectId: number, disciplineCode: string)
  {
    this._storeService.selectDiscipline(projectId, disciplineCode).subscribe(
      discipline => this._discipline.next(discipline)
    );
  }
}
