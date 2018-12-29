import { vec4 } from "../MV";
import { Util } from "../Util";
import { Ellipsoid } from "../models/Basis/Ellipsoid";
import { NoneMaterial } from "../materials/NoneMaterial";
import { SunMaterial } from "../materials/SunMaterial";
import { Light } from "./Light";
import { MoonMaterial } from "../materials/MoonMaterial";

export class Moon extends Light {
    public lightAmbient: Array<number>;
    public lightDiffuse: Array<number>;
    public lightSpecular: Array<number>;
    constructor() {
        super();
        this.translate(-300,3);
        this.lightDiffuse = Util.Hex2Vec4('0x4a4a8f');
        this.lightSpecular = Util.Hex2Vec4('0xbbbbbb');
        this.material=new MoonMaterial;
        this.setChoice(2);
    }
}