import { Component } from '@angular/core';
import { Project } from './project';

@Component({
    templateUrl: 'app/select-project/select-project.component.html'
  }
)
export class SelectProjectComponent{
  public projects: Project[];
  private _mockProjects = [{code: "A00001"}, {code: "A00002"}, {code: "A00002"}, {code: "B00001"}, {code: "B00002"}];

  constructor(){

    this.projects = this._mockProjects;
  }


}
