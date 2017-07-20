import { Component,
            Input,
            OnInit }     from  '@angular/core';

import { PagerService } from './pager.service';

@Component({
    templateUrl: 'app/pager/pager.component.html',
    selector: 'pager'
})

export class PagerComponent implements OnInit {

    private _totalItems: number;
    // The total items
    @Input() set totalItems(value: number){
        this._totalItems = value;
        let currentPage = 0;
        if(!!this.pager) {
            if (!this.pager.page)
            {
                currentPage = 1;
            }
            else
            {
                currentPage = this.pager.page;
            }
        }
        else
        {
            currentPage = 1;
        }
        this.pager = this.pagerService.getPager(this._totalItems, currentPage);
    }

    // pager object
    pager: any = {};

    constructor(private pagerService: PagerService) {}

    ngOnInit() {}

 

 
 
    setPage(page: number) {
        console.log("pager.component -- setPage -- page: " + page); //TODO: remove
        console.log("pager.component -- setPage -- this.pager.totalPages: " + this.pager.totalPages); //TODO: remove
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
 
        // get pager object from service
        this.pager = this.pagerService.getPager(this._totalItems, page);

        console.log("pager.component -- setPage -- this.pager.page: " + this.pager.page); //TODO: remove
 

    }
}