import {length, subtract } from "../MV";

export enum ImpactType{
    ball,cube,flat
}
export default class Collision{
    private type:ImpactType
    private size:number
    private position:number[]
    constructor(t:ImpactType,s:number,pos:number[]){
        this.type=t;
        this.size=s;
        this.position=pos;
    }
    public getSize():number{
        if(this.type==ImpactType.flat){
            return 0;
        }
        else{
            return this.size;
        }
    }
    public ifCollide(B:Collision) {
        let distCenter=length(subtract(B.position,this.position));
        let sizeSum=this.getSize()+B.getSize();
        return distCenter-sizeSum<0;
    }
}