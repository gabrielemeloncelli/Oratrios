import { CommodityTable } from './commodity-table';
import { SelectItem } from '../ng2-select/select/select-item';

export class MappedTable
{
  public name: string;
  public description: string;
  public detailItems: SelectItem[];
  constructor(table: CommodityTable){
    this.name = table.name;
    this.description = table.description;
    this.detailItems = table.values.map(d => new SelectItem({id: d.code, text: d.description}));
  }
}
