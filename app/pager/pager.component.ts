import { Component,
            Input,
            OnInit }     from  '@angular/core';

import { PagerService } from './pager.service';

@Component({
    templateUrl: 'app/pager/pager.component.html',
    selector: 'pager'
})

export class PagerComponent implements OnInit {
    // The total items
    @Input() set totalItems(value: number){
        if(!!this.pager) {
            this.setPage(this.pager.page);
        }
        else
        {
            this.setPage(1);
        }
    }

    // pager object
    pager: any = {};

    constructor(private pagerService: PagerService) {}

    ngOnInit() {
        this.pager.totalPages = 0;
    }

 

 
 
    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
 
        // get pager object from service
        this.pager = this.pagerService.getPager(this.totalItems, page);
 

    }
}