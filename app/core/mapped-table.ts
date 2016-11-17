import { RuleTable } from './rule-table';
import { SelectItem } from '../ng2-select/select/select-item';

export class MappedTable
{
  public name: string;
  public description: string;
  public detailItems: SelectItem[];
  constructor(table: RuleTable){
    this.name = table.name;
    this.description = table.description;
    this.detailItems = table.details.map(d => new SelectItem({id: d.detail, text: d.description}));
  }
}
