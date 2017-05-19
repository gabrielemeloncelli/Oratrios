import { Component,
            OnInit }        from '@angular/core';
import { Validators,
            FormGroup,
            FormControl }   from '@angular/forms';

import { UiStatusService }  from '../core/ui-status.service';


@Component({
  selector: 'top-bar',
  templateUrl: 'app/shared/top-bar.component.html',
  styleUrls: [ 'app/shared/top-bar.component.css' ]


})
export class TopBarComponent implements OnInit {

  constructor(private uiStatusService: UiStatusService) {       
  }







  ngOnInit() {
  }



}
