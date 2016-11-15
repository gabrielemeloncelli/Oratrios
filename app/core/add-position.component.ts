import { Component, OnInit, ViewChild } from '@angular/core';
import { UiStatusService } from './ui-status.service';
import { ModalComponent } from '../ng2-bs3-modal/components/modal';

@Component({
selector: "addposition",
templateUrl: "/app/core/add-position.component.html",
styleUrls: ["/app/core/add-position.component.css"  ]

})
export class AddPositionComponent
{

  @ViewChild(ModalComponent)
  private modalComponent: ModalComponent;
  public groups: any[] = [{"text": "Group1", "id": "Group1"}, {"text": "Group2", "id": "Group2"}];
  public groupsDisabled: boolean = false;
  public groupBg: any = {"text": "Area", "id": "Area"};

  constructor(private _uiStatusService: UiStatusService)
  {

  }

  ngOnInit()
  {
    this._uiStatusService.insertPosition.subscribe(
      detail => {
        if (detail.displayInsertPosition)
        {
          this.modalComponent.open('sm');
        }
      }
    )
  }

  refreshValue(event: any)
  {

  }
  removed(event: any){}

  typed(event: any){}
}
