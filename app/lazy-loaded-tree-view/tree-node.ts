export class TreeNode{
  expanded : boolean = false;
  cssClass : string = null;




  constructor(public id: number, public url: string, public name: string, public type: string, public idFather: number, public locked: boolean, public lockedBy: string){
      this.cssClass = this.getCssClass();
  }



  expand(){
    if (this.url)
    {
      this.expanded = !this.expanded;
      this.cssClass = this.getCssClass();
    }
  }


  private getCssClass() : string
  {
    if (this.url)
    {
      if(this.expanded){
        return 'glyphicon glyphicon-chevron-down';
      }
      return 'glyphicon glyphicon-chevron-right';

    }
    return 'glyphicon glyphicon-minus';
  }
}
