import { CommodityTable } from './commodity-table';
import { Option } from 'angular2-select/dist/option';

export class MappedTable
{
  public name: string;
  public description: string;
  public detailItems: Option[];
  constructor(table: CommodityTable){
    this.name = table.name;
    this.description = table.description;
    this.detailItems = table.values.map(d => new Option(d.code, d.description));
  }
}
