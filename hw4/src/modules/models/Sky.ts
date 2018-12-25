import { Ellipsoid } from "../models/Basis/Ellipsoid";
import { SkyMaterial } from "../materials/SkyMaterial";
import { Util } from "../Util";
import { rotateX } from "../MV";

export class Sky extends Ellipsoid {
    constructor() {
        super(500,500,[0,0,0],'');
        this.material=new SkyMaterial;
        for(let i in this.normals){
            this.normals[i]=-this.normals[i];
        }
        this.setChoice(3);
    }
    public sunset(degree:number){
        this.rotateMatrix=rotateX(degree)
    }
}