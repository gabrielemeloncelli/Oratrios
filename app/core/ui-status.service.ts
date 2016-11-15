import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { BehaviorSubject} from 'rxjs/behaviorsubject';
import { InsertPositionDetails } from './insert-position-details';

@Injectable()
export class UiStatusService
{
  private _insertPosition: BehaviorSubject<InsertPositionDetails> = new BehaviorSubject<InsertPositionDetails>(new InsertPositionDetails());
  public insertPosition: Observable<InsertPositionDetails> = this._insertPosition.asObservable();

  setInsertPosition(insertPositionVisible: boolean, insertTagPosition: boolean)
  {
     var details: InsertPositionDetails  = new InsertPositionDetails();
     details.displayInsertPosition = insertPositionVisible;
     details.positionFromTag = insertTagPosition;
     this._insertPosition.next(details);

   }
 }
