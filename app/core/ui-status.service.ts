import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { BehaviorSubject} from 'rxjs/behaviorsubject';
import { BomPosition } from '../fill-bom/bom-position';
import { InsertPositionDetails } from '../fill-bom/insert-position-details';

@Injectable()
export class UiStatusService
{
  private _insertPosition: BehaviorSubject<InsertPositionDetails> = new BehaviorSubject<InsertPositionDetails>(new InsertPositionDetails());
  public insertPosition: Observable<InsertPositionDetails> = this._insertPosition.asObservable();
  private _editPositionSubject: BehaviorSubject<BomPosition> = new BehaviorSubject<BomPosition>(null);
  public editPositionObservable: Observable<BomPosition> = this._editPositionSubject.asObservable();
  public commodityGroupCode: string;
  public commodityPartCode: string;
  public partId: number;
  public tablesAndSizesVisible = false;
  public materialsVisible = false;
  public disciplineCode = "";
  public disciplineId = 0;

  setInsertPosition(insertPositionVisible: boolean, insertTagPosition: boolean)
  {
     var details: InsertPositionDetails  = new InsertPositionDetails();
     details.displayInsertPosition = insertPositionVisible;
     details.positionFromTag = insertTagPosition;
     this._insertPosition.next(details);

   }

   editPosition(positionToEdit: BomPosition)
   {
     console.log("ui-status.service - editPosition");//TODO: remove
     this._editPositionSubject.next(positionToEdit);
   }
 }
