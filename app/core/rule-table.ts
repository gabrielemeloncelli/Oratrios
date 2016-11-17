import { RuleTableDetail } from './rule-table-detail';

export class RuleTable
{
  constructor(public name: string, public description: string, public details: RuleTableDetail[]){}
}
