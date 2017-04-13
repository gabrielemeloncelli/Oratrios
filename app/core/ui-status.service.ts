import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject}     from 'rxjs/Subject';

import { BomPosition }            from '../fill-bom/bom-position';
import { InsertPositionDetails }  from '../fill-bom/insert-position-details';
import { ProjectDiscipline }      from './project-discipline';
import { NodeTypeService }        from './node-type.service';
import { NodeType }               from './node-type';

@Injectable()
export class UiStatusService
{
  private _insertPosition: Subject<InsertPositionDetails> = new Subject<InsertPositionDetails>();
  public insertPosition: Observable<InsertPositionDetails> = this._insertPosition.asObservable();
  private _editPositionSubject: Subject<BomPosition> = new Subject<BomPosition>();
  public editPositionObservable: Observable<BomPosition> = this._editPositionSubject.asObservable();
  public commodityGroupCode: string;
  public commodityPartCode: string;
  public partId: number;
  public tablesAndSizesVisible = false;
  public materialsVisible = false;
  public disciplineCode = "";
  public disciplineId = 0;
  public projectDisciplineId = 0;
  public projectId = 0;
  public projectCode = "";
  public projectDisciplines: ProjectDiscipline[]
  public nodeTypes: NodeType[];
  public GROUP_CODE = "C_GROUP";
  public PART_CODE = "C_PART";

  constructor(private nodeTypeService: NodeTypeService) { }

  setInsertPosition(insertPositionVisible: boolean, insertTagPosition: boolean)
  {
     var details: InsertPositionDetails  = new InsertPositionDetails();
     details.displayInsertPosition = insertPositionVisible;
     details.positionFromTag = insertTagPosition;
     this._insertPosition.next(details);

   }

   editPosition(positionToEdit: BomPosition)
   {
     this._editPositionSubject.next(positionToEdit);
   }

   selectProject(projectId: number)
   {
     this.nodeTypes = new Array<NodeType>();
     this.nodeTypeService.getNodeTypes(projectId)
     .subscribe(nodes => this.nodeTypes = nodes);
   }
 }
