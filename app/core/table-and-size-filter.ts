import { TableFilter } from './table-filter';

export class TableAndSizeFilter{
  constructor(private size1: string, private size2: string, private size3: string, private size4: string, private size5: string,
  private tableFilters: TableFilter[]){

  }
  get cacheKey(): string
  {
    var resultKey: string = "";
    if(this.size1)
    {
      if (resultKey)
      {
        resultKey += '-----';
      }
      resultKey += 'SIZE1' + '-----' + this.size1;
    }
    if(this.size2)
    {
      if (resultKey)
      {
        resultKey += '-----';
      }
      resultKey += 'SIZE2' + '-----' + this.size2;
    }
    if(this.size3)
    {
      if (resultKey)
      {
        resultKey += '-----';
      }
      resultKey += 'SIZE3' + '-----' + this.size3;
    }
    if(this.size4)
    {
      if (resultKey)
      {
        resultKey += '-----';
      }
      resultKey += 'SIZE4' + '-----' + this.size4;
    }
    if(this.size5)
    {
      if (resultKey)
      {
        resultKey += '-----';
      }
      resultKey += 'SIZE5' + '-----' + this.size5;
    }
    if(this.tableFilters)
    {
      for(var filterIndex = 0; filterIndex < this.tableFilters.length; filterIndex += 1)
      {
        if (resultKey)
        {
          resultKey += '-----';
        }
        resultKey += this.tableFilters[filterIndex].tableName + '-----' + this.tableFilters[filterIndex].detail;
      }
    }
    return resultKey;
  }
}
