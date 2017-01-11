export class NodeDTO{
  id : number;
  name: string;
  nodeType: string;
  hasChildren: boolean;
  idFather: number;
  url: string;
  locked: boolean;
  lockedBy: string;
  projectDisciplineId: number;
}
