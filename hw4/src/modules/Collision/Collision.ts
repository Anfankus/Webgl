import {length, subtract } from "../MV";
import { Translatable } from "../interface/Translatable";

export enum ImpactType{
    ball,cube,flat
}
export default class Collision{
    private bind:Translatable;
    private type:ImpactType
    private size:number
    private position:number[]
    constructor(t:ImpactType,s:number,bind:Translatable=null){
        this.type=t;
        this.size=s;
        this.bind=bind;
    }
    public getSize():number{
        if(this.type==ImpactType.flat){
            return 0;
        }
        else{
            return this.size;
        }
    }
    public setPosition(pos:number[]){
        this.position=pos;
        this.bind=null;
    }
    public getPosition():number[]{
        if(this.bind==null){
            return this.position;
        }else{
            return this.bind.position;
        }
    }
    public ifCollide(B:Collision) {
        let distCenter;
        if(B.type==ImpactType.flat){
            distCenter=this.getPosition()[1]-B.getPosition()[1];
        }
        else
            distCenter=length(subtract(B.getPosition().slice(0,3),this.getPosition().slice(0,3)));
        let sizeSum=this.getSize()+B.getSize();
        return distCenter-sizeSum<0;
    }
}