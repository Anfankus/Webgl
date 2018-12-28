import { vec4 } from "../MV";
import { Util } from "../Util";
import { Ellipsoid } from "../models/Basis/Ellipsoid";
import { NoneMaterial } from "../materials/NoneMaterial";
import { SunMaterial } from "../materials/SunMaterial";

export abstract class Light extends Ellipsoid {
    public lightAmbient: Array<number>;
    public lightDiffuse: Array<number>;
    public lightSpecular: Array<number>;
    constructor() {
        super(20,20,[0,0,0],'');
        this.lightAmbient = Util.Hex2Vec4('0x202020');
        this.lightDiffuse = Util.Hex2Vec4('0xffffff');
        this.lightSpecular = Util.Hex2Vec4('0xffffff');
        this.setChoice(0);
        for(let i in this.normals){
            this.normals[i]=-this.normals[i];
        }
    }
}