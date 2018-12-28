import { vec4 } from "../MV";
import { Util } from "../Util";
import { Ellipsoid } from "../models/Basis/Ellipsoid";
import { NoneMaterial } from "../materials/NoneMaterial";
import { SunMaterial } from "../materials/SunMaterial";
import { Light } from "./Light";

export class Sun extends Light {
    public lightAmbient: Array<number>;
    public lightDiffuse: Array<number>;
    public lightSpecular: Array<number>;
    constructor() {
        super();
        this.translate(300,3);
        this.lightDiffuse = Util.Hex2Vec4('0xffffff');
        this.lightSpecular = Util.Hex2Vec4('0xffffff');
        this.material=new SunMaterial;
        this.setChoice(0);
    }
}