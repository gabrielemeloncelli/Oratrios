import { Component } from '@angular/core';

import { UiStatusService }  from '../core/ui-status.service';
import { ExportService }    from './export.service';

@Component({
        selector: 'export',
        templateUrl: 'app/export/export.component.html',
    })
export class ExportComponent
{
    exportResult: string;
    exportQueued: boolean;
    exportSuccess: boolean;

    constructor(private exportService: ExportService, private uiStatusService: UiStatusService) {}

    exportAll(): void
    {
        this.exportQueued = false;
        this.exportSuccess = false;
        this.exportService.exportAll(this.uiStatusService.projectDisciplineId)
        .subscribe(res => {
            this.exportResult = 'Export success';
            this.exportQueued = true;
            this.exportSuccess = true;
        });
    }
}