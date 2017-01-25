import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { Subject } from 'rxjs/subject';
import { Project } from './project';
import { Discipline } from './discipline';
import { ProjectDiscipline } from './project-discipline';

@Injectable()
export class ProjectDisciplineStoreService{
  private BASE_URL = 'api/projectdiscipline';
  private PRJ_BASE_URL = 'api/projects';
  constructor(private _http: Http){}

  selectUser(): Observable<Project[]>{
    var _resultArray = new Array<Project[]>();
    var result = new Subject<Array<Project>>();
    this._http
        .get(this.PRJ_BASE_URL)
        .map((res:Response) => res.json())
        .subscribe(res => {
          result.next(res.map((pos: any) => this.mapProject(pos)));
        });
    return result.asObservable();

  }

  selectProject(projectCode: string): Observable<ProjectDiscipline[]>{

    var _resultArray = new Array<ProjectDiscipline[]>();
    var result = new Subject<Array<ProjectDiscipline>>();
    this._http
        .get(this.BASE_URL + "/project/" + projectCode)
        .map((res:Response) => res.json())
        .subscribe(res => {
          result.next(res.map((pos: any) => this.mapProjectDiscipline(pos)));
        });
    return result.asObservable();
}

 selectDiscipline(projectId: number, disciplineCode: string): Observable<ProjectDiscipline>{
   var result = new Subject<ProjectDiscipline>();
   this._http.get(this.BASE_URL + '/' + projectId + '/' + disciplineCode)
   .map((res: Response) => res.json())
   .subscribe(dis => result.next(this.mapProjectDiscipline(dis)));
   return result.asObservable();
 }


  mapProjectDiscipline(res: any): ProjectDiscipline{
    var resultProject = new Project(res.project.id, res.project.code);
    var resultDiscipline = new Discipline(res.discipline.id, res.discipline.code);
    return new ProjectDiscipline(res.id, resultProject, resultDiscipline);
  }

  mapProject(res: any): Project{
    return new Project(0, res.code);
  }

}
